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

constexpr uint8_t SUCCESS_PIN = 2;
constexpr uint8_t ERROR_PIN = 15;
constexpr uint8_t LOADING_PIN = 32;

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
  Serial.println("Getting UID Oubound");
  // Getting ready for reading Tags
  if (!outboundMfrc522.PICC_IsNewCardPresent())
  { // If a new tag is placed close to the RFID reader, continue
    // delay(2000);
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

boolean registerTagInbound(String tagID)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("Posting tag - Wifi Strength: " + String(WiFi.RSSI()));
    WiFiClient client;

    if (!client.connect(SERVER_ADDRESS, SERVER_PORT))
    {
      Serial.println("Connection failed.");
      return false;
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
      return true;
    }
    else
    {
      Serial.println("POST Tag failed. Tag: " + tagID);
      return false;
    }
  }

  return false;
}

boolean checkMRFC(MFRC522 mrfc522, String name)
{
  byte v = mrfc522.PCD_ReadRegister(mrfc522.VersionReg);
  if (v == 0x00 || v == 0xFF)
  {
    Serial.println(name + " - Could not find MFRC522 board. Check wiring.");
    return false;
  }
  else
  {
    Serial.print(name + " - RFID reader found, version ");
    Serial.println(v, HEX);
    return true;
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
  Serial.println("RFID reader Inbound initialized");

  delay(4);

  outboundMfrc522.PCD_Init();
  Serial.println("RFID reader Outbound initialized");
  delay(4);

  checkMRFC(inboundMrfc522, "RFID reader Inbound");
  checkMRFC(outboundMfrc522, "RFID reader Outbound");
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

  pinMode(SUCCESS_PIN, OUTPUT);
  pinMode(ERROR_PIN, OUTPUT);
  pinMode(LOADING_PIN, OUTPUT);
}

void loop()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    digitalWrite(ERROR_PIN, HIGH);
    initWifi();
    digitalWrite(ERROR_PIN, LOW);
  }

  if (checkMRFC(inboundMrfc522, "RFID reader Inbound") == false || checkMRFC(outboundMfrc522, "RFID reader Outbound") == false)
  {
    digitalWrite(ERROR_PIN, HIGH);
    initRFID();
    digitalWrite(ERROR_PIN, LOW);
  }

  if (getUIDInbound())
  {
    Serial.println("Tag " + tagID + " detected");
    digitalWrite(LOADING_PIN, HIGH);
    const boolean success = registerTagInbound(tagID);
    digitalWrite(LOADING_PIN, LOW);
    if (success)
    {
      digitalWrite(SUCCESS_PIN, HIGH);
      Serial.println("Tag " + tagID + " registered");
    }
    else
    {
      digitalWrite(ERROR_PIN, HIGH);
      Serial.println("Tag " + tagID + " failed to register");
    }

    delay(3000);

    digitalWrite(ERROR_PIN, LOW);
    digitalWrite(SUCCESS_PIN, LOW);
  }
  else
  {
    Serial.println("No tag detected");
  }

  if (getUIDOutbound())
  {
    Serial.println("Outbound: Tag " + tagID + " detected");
    // postTag(tagID);
    digitalWrite(SUCCESS_PIN, HIGH);
    delay(3000);
    digitalWrite(SUCCESS_PIN, LOW);
  }
  else
  {
    Serial.println("No tag detected");
  }
}
