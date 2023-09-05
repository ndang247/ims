#include <Arduino.h>
#include <rfid.h>

#include <SPI.h>

void test() {
  Serial.println("test");
}

constexpr uint8_t RST_PIN = 16;        // Configurable, see typical pin layout above
constexpr uint8_t SS_PIN = 15;         // Configurable, see typical pin layout above

RFIDReader::RFIDReader() : mfrc522(SS_PIN, RST_PIN) {}

void RFIDReader::setup() {
    Serial.begin(9600);
    SPI.begin();
    mfrc522.PCD_Init();

    tagID = "";
}

void RFIDReader::loop() {
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
        Serial.println("RFID Card detected!");
        // Your RFID card processing code here
        tagID = "";
        for ( uint8_t i = 0; i < 4; i++) {                  // The MIFARE tag in use has a 4 byte UID
          tagID.concat(String(mfrc522.uid.uidByte[i], HEX));  // Adds the 4 bytes in a single string variable
        }
        tagID.toUpperCase();
        mfrc522.PICC_HaltA();
    }
}