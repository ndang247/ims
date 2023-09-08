#include <Arduino.h>

#include <SPI.h>
#include <MFRC522.h>

#include "rfid.h"

#include <ESP8266WiFi.h>
#include <WiFiManager.h>

#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

constexpr uint8_t RST_PIN = 16;        // Configurable, see typical pin layout above
constexpr uint8_t SS_PIN = 15;         // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN);

String tagID = "";

boolean getUID() {
  // Getting ready for reading Tags
  if ( ! mfrc522.PICC_IsNewCardPresent()) {   //If a new tag is placed close to the RFID reader, continue
    return false;
  }
  if ( ! mfrc522.PICC_ReadCardSerial()) {     //When a tag is placed, get UID and continue
    return false;
  }

  tagID = "";
  for ( uint8_t i = 0; i < 4; i++) {                  // The MIFARE tag in use has a 4 byte UID
    tagID.concat(String(mfrc522.uid.uidByte[i], HEX));  // Adds the 4 bytes in a single string variable
  }
  tagID.toUpperCase();

  

  mfrc522.PICC_HaltA(); // Stop reading
  return true;
}

String SERVER_ADDRESS = "192.168.1.122";
String SERVER_PORT = "3000";
String postInboundRoute = "/iot/inbound";

void getRequest() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Connected to WiFi - Strength" + String(WiFi.RSSI()));
    WiFiClient client;

    // Send GET request
    if (client.connect(String(SERVER_ADDRESS), 3000)) {
      client.println("GET " + postInboundRoute + " HTTP/1.1");
      client.println("Host: " + String(SERVER_ADDRESS));
      client.println("Connection: close");
      client.println();
      while (client.connected()) {
          String line = client.readStringUntil('\n');
          Serial.println(line);
      }
      client.stop();
    } else {
      Serial.println("GET Connection failed.");
    }
  }
}

void postTag(String tagID) {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("Posting tag - Wifi Strength: " + String(WiFi.RSSI()));
    WiFiClient client;

    // Send POST request
    if (client.connect( String(SERVER_ADDRESS), 3000)) {
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

      while (client.connected()) {
          String line = client.readStringUntil('\n');
          Serial.println(line);
      }
      client.stop();
    } else {
      Serial.println("POST Tag failed. Tag: " + tagID);
    }


  }
}


// Replace with your network credentials (STATION)
const char* ssid = "WiFi-DFAE-5G-pro-5G";
const char* password = "18190793";
void initWifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println("WiFi connected");
  Serial.println(WiFi.localIP());
  }

void setup() {
	Serial.begin(9600);		// Initialize serial communications with the PC
	while (!Serial);		  // Do nothing if no serial port is opened (added for Arduinos based on ATMEGA32U4)
	SPI.begin();			    // Init SPI bus
	mfrc522.PCD_Init();		// Init MFRC522

  WiFiManager wifiManager;
  if (!wifiManager.autoConnect()) {
    Serial.println("Failed to connect wifi and hit timeout.");
    // Reset and try again, or do something else
    ESP.reset();
    delay(1000);
  }
  Serial.println("Done Setup!");
  Serial.println("Connected to: " + WiFi.SSID());
}

void loop() {
  
  while (getUID()) 
  {
    Serial.println("Tag " + tagID + " detected");
    // getRequest();
    postTag(tagID);
  }
}
