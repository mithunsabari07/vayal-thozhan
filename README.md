# Vayal Thozhan (வயல் தோழன்) 🌾💧
### Smart Agricultural IoT & Automated Irrigation Dashboard

**Vayal Thozhan** is a next-generation smart farming and precision agriculture control dashboard built with **Next.js**, **React**, and **Firebase Realtime Database**. Designed to empower farmers with automated irrigation, real-time ESP32 sensor telemetry, bilingual support (English & தமிழ்), and phone IVR hotline assistance.

---

## 🌟 Key Features

- **Real-time IoT Telemetry**: Live sensor feedback for Dual-Zone Soil Moisture (Zone A & Zone B), Rain detection, Water Tank levels, and Solar battery status.
- **Automated & Manual Actuation**: Remote control over Solenoid Valves A & B and the main submersible water pump with instant audio-tactile feedback.
- **Bilingual Interface**: Seamless 1-click language toggling between **English** and **தமிழ் (Tamil)** across all metrics, alerts, and instructions.
- **Interactive IVR Farmer Hotline (1800-419-VAYAL)**: In-app dialer simulating voice-assisted agricultural advisories for pest management, weather forecasts, and market crop prices.
- **Hardware Config & Arduino C++ Generator**: Integrated modal providing copy-paste ESP32 code templates with pre-configured Firebase endpoints and GPIO pinouts.
- **Interactive Simulation Controls**: Testable slider drawer to simulate soil moisture dry-outs, heavy rainfall triggers, and emergency tank cutoffs.
- **PWA / Responsive Design**: Works seamlessly on mobile devices, tablets, and desktop workstations.

---

## 🛠️ Hardware Specifications (ESP32 Integration)

| Component | Pin / GPIO | Description |
| :--- | :--- | :--- |
| **Zone A Soil Moisture Sensor** | `GPIO 34` | Analog soil resistivity sensor |
| **Zone B Soil Moisture Sensor** | `GPIO 35` | Analog soil resistivity sensor |
| **Rain Detection Sensor** | `GPIO 32` | Analog/Digital precipitation detector |
| **Relay 1 (Valve A)** | `GPIO 25` | Active LOW 5V relay module |
| **Relay 2 (Valve B)** | `GPIO 26` | Active LOW 5V relay module |
| **Relay 3 (Water Tank Pump)** | `GPIO 27` | Active LOW 5V relay module |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/mithunsabari07/vayal-thozhan.git
cd vayal-thozhan
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Live GitHub Pages Deployment
This repository is configured with automated GitHub Actions CI/CD. Pushes to `main` automatically build and deploy the application to GitHub Pages.
