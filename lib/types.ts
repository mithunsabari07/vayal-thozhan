export type Language = 'ta' | 'en';

export type SystemMode = 'auto' | 'manual';

export interface FieldData {
  id: 'field_a' | 'field_b';
  letter: 'A' | 'B';
  nameEn: string;
  nameTa: string;
  cropEn: string;
  cropTa: string;
  cropEmoji: string;
  soilTypeEn: string;
  soilTypeTa: string;
  moisture: number; // percentage 0 - 100
  targetStart: number; // default 40
  targetStop: number; // default 70
  valveStatus: 'open' | 'closed';
  valveTimeRemainingSeconds: number;
  durationMinutes: number;
  temperature: number; // Celsius
  humidity: number; // percentage
  rainSensor: 'dry' | 'wet';
  flowRateLpm: number; // Liters per minute
  primaryColor: string;
  accentBg: string;
  status: 'good' | 'dry' | 'critical' | 'watering';
}

export interface TankData {
  currentLiters: number;
  capacityLiters: number;
  pumpStatus: 'idle' | 'running_feed' | 'refilling';
  dryRunCutoffLiters: number;
  boreholeWaterLevelPercent: number;
  voltage: number;
}

export interface ActivityLogItem {
  id: string;
  time: string;
  timestamp: number;
  category: 'valve' | 'sensor' | 'tank' | 'weather';
  color: string;
  emoji: string;
  titleEn: string;
  titleTa: string;
  descEn: string;
  descTa: string;
}

export interface WeatherData {
  condition: 'sunny' | 'partly_cloudy' | 'rainy';
  tempCelsius: number;
  humidityPercent: number;
  radarStatusEn: string;
  radarStatusTa: string;
  locationEn: string;
  locationTa: string;
  forecast6hEn: string;
  forecast6hTa: string;
}
