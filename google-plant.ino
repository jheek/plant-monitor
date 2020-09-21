/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
/**
 * Google Plant
 * 
 * A small device you can plug in the soil of your plant, it will
 * record signals such as the amount of sunlight and water.
 * 
 * The circuit:
 * - ESP8266
 * - LRD
 * - LED
 * - Capacitive Soil Sensor
 * 
 * https://github.com/HalleyInteractive/google-plant
 */

#include <EEPROM.h>
#include <WiFi.h>
#include <DNSServer.h>
#include <WebServer.h>
#include <WiFiManager.h>
#include <FirebaseESP32.h>

#define LED_RED 12
#define LED_GREEN 14
#define LED_BLUE 27
#define LDR 36
#define CSMS 39

#define uS_TO_S_FACTOR 1000000  /* Conversion factor for micro seconds to seconds */
#define TIME_TO_SLEEP  20
#define CONFIG_PORTAL_GPIO GPIO_NUM_33

bool shouldSaveConfig = false;

FirebaseData firebaseData;

enum LedColor {
  OFF,
  RED,
  GREEN,
  BLUE,
  YELLOW,
  CYAN,
  MAGENTA
};

struct SensorReading {
  int light;
  int water;
};

/**
 * Setup WifiManager and components.
 */
void setup() {
  Serial.begin(9600);
  EEPROM.begin(512);

  pinMode(LDR, INPUT);
  pinMode(CSMS, INPUT);

  pinMode(LED_RED, OUTPUT);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);

  setLEDColor(YELLOW);

  WiFiManager wifiManager;

  char firebaseProject[64] = "Firebase Project ID";
  char firebaseSecret[64] = "Firebase Secret";
  int pointer = 0x0F;
  pointer = readFromEEPROM(firebaseProject, pointer, 64);
  pointer = readFromEEPROM(firebaseSecret, pointer, 64);
  
//  wifiManager.resetSettings(); // Reset WiFi settings for debugging.
  WiFiManagerParameter firebaseProjectParam("fbp", "Firebase Project", firebaseProject, 64);
  wifiManager.addParameter(&firebaseProjectParam);

  WiFiManagerParameter firebaseSecretParam("fbs", "Firebase Secret", firebaseSecret, 64);
  wifiManager.addParameter(&firebaseSecretParam);
  
  wifiManager.setSaveConfigCallback(saveConfigCallback);

  print_wakeup_reason();
  esp_sleep_wakeup_cause_t wakeup_reason;
  wakeup_reason = esp_sleep_get_wakeup_cause();
 
  wifiManager.setConfigPortalTimeout(180);

  if(wakeup_reason == 1 || wakeup_reason == 2) {
    // If woken up by external interrupt signal we start the config portal.
    setLEDColor(BLUE);
    wifiManager.startConfigPortal("Plant", "googlePlant");
  } else {
    wifiManager.autoConnect("Plant", "googlePlant");
  }
  
  setLEDColor(GREEN);
  if(shouldSaveConfig) {
    int pointer = 0x0F;
    strcpy(firebaseProject, firebaseProjectParam.getValue());
    pointer = writeToEEPROM(firebaseProject, pointer, 64);
    strcpy(firebaseSecret, firebaseSecretParam.getValue());
    pointer = writeToEEPROM(firebaseSecret, pointer, 64);
  }

  Serial.print("Firebase Project: ");
  Serial.println(firebaseProject);

  Serial.print("Firebase Secret: ");
  Serial.println(firebaseSecret);

  
  Firebase.begin(firebaseProject, firebaseSecret);
  Firebase.reconnectWiFi(true);
  Firebase.setMaxRetry(firebaseData, 3);
  Firebase.setMaxErrorQueue(firebaseData, 30);
  Firebase.enableClassicRequest(firebaseData, true);
  
  SensorReading reading = readSensorData();
  
  setLEDColor(CYAN);
  sendSensorDataToFirestore(reading);
  
  setLEDColor(OFF);
  setESPSleepCycle();
}

void setESPSleepCycle() {
  esp_err_t rtc_gpio_pulldown_en(CONFIG_PORTAL_GPIO);
  esp_sleep_enable_ext0_wakeup(CONFIG_PORTAL_GPIO, HIGH);
  esp_sleep_enable_timer_wakeup(TIME_TO_SLEEP * uS_TO_S_FACTOR);
  Serial.println("Setup ESP32 to sleep for every " + String(TIME_TO_SLEEP) + " Seconds");
  esp_deep_sleep_start();
}

/**
 * Sets current timestamp in Firebase, reads it and 
 * returns value.
 * @return Current timestamp in seconds.
 */
int getTimestamp() {
  Firebase.setTimestamp(firebaseData,  "/current/timestamp");
  int currentTimestamp = firebaseData.intData();
  Serial.print("TIMESTAMP (Seconds): ");
  Serial.println(currentTimestamp);
  return currentTimestamp;
}

/**
 * Reads a char array from EEPROM.
 * @param param The parameter to write EEPROM data to.
 * @param start EEPROM memory location to start read from.
 * @param size Length of the parameter.
 * @return EEPROM pointer, start + size.
 */
int readFromEEPROM(char *param, int start, int size) {
  Serial.print("Reading from EEPROM: ");
  for(int i = 0; i < size; i++) {
    char chr = char(EEPROM.read(start+i));
    Serial.print(chr);
    param[i] = chr;
  }
  Serial.println(" from EEPROM");
  return start + size;
}

/**
 * Writes a char array to EEPROM.
 * @param param The parameter to to store.
 * @param start EEPROM memory location to start writing at.
 * @param size Length of the parameter.
 * @return EEPROM pointer, start + size.
 */
int writeToEEPROM(char *param, int start, int size) {
  Serial.print("Writing '");
  for(int i = 0; i < size; i++) {
    Serial.print(param[i]);
    EEPROM.write(start+i, param[i]);
  }
  Serial.println("' to EEPROM");
  EEPROM.commit();
  return start + size;
}

/**
 * Triggered by the WifiManager if config has changed and
 * we need to write parameters to EEPROM.
 */
void saveConfigCallback () {
  shouldSaveConfig = true;
}

/**
 * Changes color of the  RGB LED.
 * @param color LedColor Value.
 */
void setLEDColor(LedColor color) {
  digitalWrite(LED_RED, LOW);
  digitalWrite(LED_GREEN, LOW);
  digitalWrite(LED_BLUE, LOW);
  
  switch(color) {
    case RED:
      digitalWrite(LED_RED, HIGH);
      break;
    case GREEN:
      digitalWrite(LED_GREEN, HIGH);
      break;
    case BLUE:
      digitalWrite(LED_BLUE, HIGH);
      break;
    case YELLOW:
      digitalWrite(LED_RED, HIGH);
      digitalWrite(LED_GREEN, HIGH);
      break;
    case CYAN:
      digitalWrite(LED_GREEN, HIGH);
      digitalWrite(LED_BLUE, HIGH);
      break;
    case MAGENTA:
      digitalWrite(LED_RED, HIGH);
      digitalWrite(LED_BLUE, HIGH);
      break;
  }
}

/**
 * Reads the LDR and Capacitive Soil Sensor data.
 * @return SensorReading
 */
SensorReading readSensorData() {
  Serial.println("Reading sensor values");
  setLEDColor(RED);
 
  int lightReading = analogRead(LDR);
  int waterReading = analogRead(CSMS);
  
  int lightPercentage = map(lightReading, 0, 4095, 0, 100);
  int waterPercentage = map(waterReading, 0, 4095, 100, 0);

  SensorReading reading = {lightPercentage, waterPercentage};
  Serial.print("SENSORS: ");
  Serial.print(reading.light);
  Serial.print("  ");
  Serial.println(reading.water); 
  return reading;
}

/**
 * Sends Sensor Reading data to Firestore.
 * @param reading with sensor values.
 */
void sendSensorDataToFirestore(SensorReading reading) {
  Serial.println("Send Data to Firestore");
  setLEDColor(YELLOW);
  int currentTimestamp = getTimestamp();
  FirebaseJson sensorReading;
  sensorReading.set("light", reading.light);
  sensorReading.set("water", reading.water);
  Firebase.set(firebaseData, "plant/" + String(currentTimestamp), sensorReading);
}

/**
 * Method to print the reason by which ESP32
 * has been awaken from sleep.
 */
void print_wakeup_reason(){
  esp_sleep_wakeup_cause_t wakeup_reason;

  wakeup_reason = esp_sleep_get_wakeup_cause();

  switch(wakeup_reason)
  {
    case 1  : Serial.println("Wakeup caused by external signal using RTC_IO"); break;
    case 2  : Serial.println("Wakeup caused by external signal using RTC_CNTL"); break;
    case 3  : Serial.println("Wakeup caused by timer"); break;
    case 4  : Serial.println("Wakeup caused by touchpad"); break;
    case 5  : Serial.println("Wakeup caused by ULP program"); break;
    default : Serial.println("Wakeup was not caused by deep sleep"); break;
  }
}

/**
 * Arduino main event loop.
 */
void loop() {
  
}
