/**
 * Production-ready ESP32 Arduino code for Vayal Thozhan
 * Matching pins:
 *   SOIL1: GPIO 34 (Field A)
 *   SOIL2: GPIO 35 (Field B)
 *   RAIN:  GPIO 32 (Rain detector)
 *   RELAY1: GPIO 25 (Valve A - Active LOW)
 *   RELAY2: GPIO 26 (Valve B - Active LOW)
 *   RELAY3: GPIO 27 (Tank Pump - Active LOW)
 */

export function generateEsp32Code(firebaseUrl: string): string {
  const cleanUrl = firebaseUrl.replace(/\/+$/, '');
  return `/*
  ==============================================================
   VAYAL THOZHAN (வயல் தோழன்) - ESP32 Firebase IoT Firmware
   Smart Automated Irrigation System
  ==============================================================
  Hardware Pin Configuration:
    - SOIL SENSOR 1 : GPIO 34 (Analog ADC - Field A Paddy)
    - SOIL SENSOR 2 : GPIO 35 (Analog ADC - Field B Tomato)
    - RAIN SENSOR   : GPIO 32 (Analog ADC / Digital)
    - RELAY 1       : GPIO 25 (Valve A Solenoid - Active LOW)
    - RELAY 2       : GPIO 26 (Valve B Solenoid - Active LOW)
    - RELAY 3       : GPIO 27 (Tank Refill Motor Pump - Active LOW)
  ==============================================================
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h> // Install "ArduinoJson" v6 or v7 via Library Manager

// --- Wi-Fi Credentials ---
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// --- Firebase Realtime Database URL ---
const char* FIREBASE_HOST = "${cleanUrl}";
const char* FIREBASE_PATH = "/vayal_thozhan.json";

// --- Sensor Pin Definitions ---
#define SOIL1 34
#define SOIL2 35
#define RAIN  32

// --- Relay Pin Definitions ---
#define RELAY1 25
#define RELAY2 26
#define RELAY3 27

// Active LOW Relays
#define RELAY_ON  LOW
#define RELAY_OFF HIGH

// Timing
unsigned long lastTelemetryMillis = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 2500; // Send telemetry every 2.5 seconds

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("\\n==================================");
  Serial.println("  VAYAL THOZHAN - ESP32 IoT Node   ");
  Serial.println("==================================");

  // Initialize Relays as OUTPUT & set them OFF immediately
  pinMode(RELAY1, OUTPUT);
  pinMode(RELAY2, OUTPUT);
  pinMode(RELAY3, OUTPUT);

  digitalWrite(RELAY1, RELAY_OFF);
  digitalWrite(RELAY2, RELAY_OFF);
  digitalWrite(RELAY3, RELAY_OFF);

  // Configure ADC inputs
  pinMode(SOIL1, INPUT);
  pinMode(SOIL2, INPUT);
  pinMode(RAIN,  INPUT);

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\\n[WiFi] Connected successfully!");
  Serial.print("[WiFi] IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Ensure Wi-Fi remains connected
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Connection lost. Reconnecting...");
    WiFi.reconnect();
    delay(2000);
    return;
  }

  unsigned long currentMillis = millis();

  // Periodic Telemetry Push & Relay Sync
  if (currentMillis - lastTelemetryMillis >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryMillis = currentMillis;

    // 1. Read Analog Sensors (ESP32 ADC 0-4095)
    int rawSoil1 = analogRead(SOIL1);
    int rawSoil2 = analogRead(SOIL2);
    int rawRain  = analogRead(RAIN);

    // Optional: map to 0-100% in hardware or let Dashboard map it
    Serial.println("----------------------------------------");
    Serial.printf("[Sensors] Soil 1 (Field A): %d | Soil 2 (Field B): %d | Rain: %d\\n", rawSoil1, rawSoil2, rawRain);

    // 2. Fetch Relay Commands from Firebase
    syncRelayCommandsAndPushTelemetry(rawSoil1, rawSoil2, rawRain);
  }
}

void syncRelayCommandsAndPushTelemetry(int soil1, int soil2, int rain) {
  HTTPClient http;
  String url = String(FIREBASE_HOST) + String(FIREBASE_PATH);

  // Step A: First read current relay commands set by Web Dashboard
  http.begin(url);
  int httpCode = http.GET();

  if (httpCode == HTTP_CODE_OK) {
    String payload = http.getString();
    
    // Parse JSON
    StaticJsonDocument<512> doc;
    DeserializationError error = deserializeJson(doc, payload);

    if (!error) {
      bool targetRelay1 = doc["relay1"] | false;
      bool targetRelay2 = doc["relay2"] | false;
      bool targetRelay3 = doc["relay3"] | false;

      // Apply to hardware (Active LOW)
      digitalWrite(RELAY1, targetRelay1 ? RELAY_ON : RELAY_OFF);
      digitalWrite(RELAY2, targetRelay2 ? RELAY_ON : RELAY_OFF);
      digitalWrite(RELAY3, targetRelay3 ? RELAY_ON : RELAY_OFF);

      Serial.printf("[Relays] 1 (Valve A): %s | 2 (Valve B): %s | 3 (Pump): %s\\n",
                    targetRelay1 ? "ON (OPEN)" : "OFF",
                    targetRelay2 ? "ON (OPEN)" : "OFF",
                    targetRelay3 ? "ON (REFILL)" : "OFF");
    }
  }
  http.end();

  // Step B: Push updated sensor telemetry to Firebase
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  StaticJsonDocument<256> outDoc;
  outDoc["soil1"] = soil1;
  outDoc["soil2"] = soil2;
  outDoc["rain"] = rain;
  outDoc["updatedAt"] = millis();
  outDoc["deviceStatus"] = "online";

  String outJson;
  serializeJson(outDoc, outJson);

  int patchCode = http.PATCH(outJson);
  if (patchCode == HTTP_CODE_OK || patchCode == 204) {
    Serial.println("[Firebase] Telemetry synced successfully!");
  } else {
    Serial.printf("[Firebase] PATCH failed. Code: %d\\n", patchCode);
  }
  http.end();
}
`;
}
