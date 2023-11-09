#include <Arduino.h>

#include <SPI.h>
#include <MFRC522.h>

#include <WiFi.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

constexpr uint8_t RST_INBOUND_PIN = 22; // Configurable, see typical pin layout above
constexpr uint8_t SS_INBOUND_PIN = 5;   // Configurable, see typical pin layout above

constexpr uint8_t RST_OUTBOUND_PIN = 21; // Configurable, see typical pin layout above
constexpr uint8_t SS_OUTBOUND_PIN = 4;   // Configurable, see typical pin layout above

MFRC522 inboundMrfc522(SS_INBOUND_PIN, RST_INBOUND_PIN);
MFRC522 outboundMfrc522(SS_OUTBOUND_PIN, RST_OUTBOUND_PIN);

String tagID = "";

boolean getUIDInbound()
{
  Serial.println("Getting UID Inbound");
  // Getting ready for reading Tags
  if (!inboundMrfc522.PICC_IsNewCardPresent())
  { // If a new tag is placed close to the RFID reader, continue
    // delay(2000);
    // Serial.println("No new card");
    return false;
  }
  if (!inboundMrfc522.PICC_ReadCardSerial())
  { // When a tag is placed, get UID and continue
    // delay(2000);
    Serial.println("No card serial");
    return false;
  }

  tagID = "";
  for (uint8_t i = 0; i < 4; i++)
  {                                                           // The MIFARE tag in use has a 4 byte UID
    tagID.concat(String(inboundMrfc522.uid.uidByte[i], HEX)); // Adds the 4 bytes in a single string variable
  }
  tagID.toUpperCase();

  // Serial.println("Tag ID: " + tagID);

  inboundMrfc522.PICC_HaltA(); // Stop reading
  return true;
}

boolean getUIDOutbound()
{
  Serial.println("Getting UID 2");
  // Getting ready for reading Tags
  if (!outboundMfrc522.PICC_IsNewCardPresent())
  { // If a new tag is placed close to the RFID reader, continue
    // delay(2000);
    Serial.println("No new card");
    return false;
  }
  if (!outboundMfrc522.PICC_ReadCardSerial())
  { // When a tag is placed, get UID and continue
    // delay(2000);
    Serial.println("No card serial");
    return false;
  }

  tagID = "";
  for (uint8_t i = 0; i < 4; i++)
  {                                                            // The MIFARE tag in use has a 4 byte UID
    tagID.concat(String(outboundMfrc522.uid.uidByte[i], HEX)); // Adds the 4 bytes in a single string variable
  }
  tagID.toUpperCase();

  // Serial.println("Tag ID: " + tagID);

  outboundMfrc522.PICC_HaltA(); // Stop reading
  return true;
}

const char *SERVER_ADDRESS = "172.20.10.9";
const uint16_t SERVER_PORT = 3000;
String postInboundRoute = "/iot/inbound";

void postTag(String tagID)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("Posting tag - Wifi Strength: " + String(WiFi.RSSI()));
    WiFiClient client;

    if (!client.connect(SERVER_ADDRESS, SERVER_PORT))
    {
      Serial.println("Connection failed.");
      return;
    }

    // Send POST request
    if (client.connect(SERVER_ADDRESS, SERVER_PORT))
    {                                  // Use c_str() to convert String to const char*
      StaticJsonDocument<200> jsonDoc; // Adjust the size as needed
      jsonDoc["sensor"] = "ESP8266";
      jsonDoc["role"] = "inbound";

      StaticJsonDocument<200> sensorValueDoc;
      sensorValueDoc["tagID"] = tagID;

      jsonDoc["value"] = sensorValueDoc;

      String jsonStr;
      serializeJson(jsonDoc, jsonStr);

      client.println("POST " + postInboundRoute + " HTTP/1.1");
      client.println("Host: " + String(SERVER_ADDRESS));
      client.println("Content-Type: application/json");
      client.print("Content-Length: ");
      client.println(jsonStr.length());
      client.println();
      client.println(jsonStr);

      while (client.connected())
      {
        String line = client.readStringUntil('\n');
        Serial.println(line);
      }
      client.stop();
    }
    else
    {
      Serial.println("POST Tag failed. Tag: " + tagID);
    }
  }
}

// Replace with your network credentials (STATION)
const char *ssid = "SaeForWork";
const char *password = "08102001";
void initWifi()
{
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print('.');
    delay(2000);
  }
  Serial.println("WiFi connected");
  Serial.println(WiFi.localIP());
  Serial.println(WiFi.SSID());
}

void initRFID()
{
  SPI.begin();               // Init SPI bus
  inboundMrfc522.PCD_Init(); // Init MFRC522
  Serial.println("RFID reader initialized");

  delay(4);

  outboundMfrc522.PCD_Init();
  Serial.println("RFID reader 2 initialized");
  delay(4);

  byte v = inboundMrfc522.PCD_ReadRegister(inboundMrfc522.VersionReg);
  if (v == 0x00 || v == 0xFF)
  {
    Serial.println("Could not find MFRC522 board. Check wiring.");
  }
  else
  {
    Serial.print("RFID reader found, version ");
    Serial.println(v, HEX);
  }
}

void setup()
{
  Serial.begin(115200); // Initialize serial communications with the PC
  while (!Serial)
    ; // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
  delay(5000);
  Serial.println("Setting up RFID reader");
  WiFi.mode(WIFI_STA);

  delay(4);
  initRFID();
}

void loop()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    initWifi();
  }
  if (getUIDInbound())
  {
    Serial.println("Tag " + tagID + " detected");
    // postTag(tagID);
    delay(3000);
  }
  else
  {
    Serial.println("No tag detected");
  }

  if (getUIDOutbound())
  {
    Serial.println("Outbound: Tag " + tagID + " detected");
    // postTag(tagID);
    delay(3000);
  }
  else
  {
    Serial.println("No tag detected");
  }
}
