#ifndef RFID_H
#define RFID_H

#include <MFRC522.h>

void test();

class RFIDReader {
public:
    RFIDReader();

    String tagID = "";
    void setup();
    void loop();

private:
    MFRC522 mfrc522;
};

#endif