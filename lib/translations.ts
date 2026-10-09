import { Language } from './types';

export const translations = {
  ta: {
    // Top Bar
    brand_title: "Vayal Thozhan",
    brand_tag: "· farm01",
    nav_overview: "பண்ணை நிலவரம் (Overview)",
    nav_fields: "வயல் A & B (Fields)",
    nav_irrigation: "நீர் மேலாண்மை (Irrigation)",
    nav_telemetry: "அறிக்கைகள் (Telemetry)",
    theme_light: "Light",
    theme_dark: "Dark",
    lang_btn: "தமிழ் / EN",
    simulation_panel: "சிமுலேட்டர் (Demo)",

    // Hero Section
    live_status: "Online · நேரலை இணைப்பு",
    hero_title: "வணக்கம் முருகன் அண்ணா",
    hero_title_sub: "Vanakkam Murugan anna",
    hero_subtitle_watering: "வயல் B தக்காளிக்கு நீர் பாய்கிறது. வால்வு B இயங்குகிறது.",
    hero_subtitle_field_a_watering: "வயல் A சம்பா நெல்லுக்கு நீர் பாய்கிறது. வால்வு A இயங்குகிறது.",
    hero_subtitle_both_watering: "வயல் A மற்றும் B இரண்டிலும் பாசனம் இயங்குகிறது.",
    hero_subtitle_dry_ready: "வயல் B ஈரம் 40% கீழ் உள்ளது. பாசனத்திற்கு தயார்.",
    hero_subtitle_optimal: "அனைத்து வயல்களும் போதுமான ஈரப்பதத்துடன் பசுமையாக உள்ளன.",
    updated_time: "புதுப்பிக்கப்பட்டது: ",
    today: "(இன்று)",
    location: "தஞ்சாவூர் மாவட்டம் (Thanjavur)",
    speech_thirsty: "வயல் B தாகமாக உள்ளது! தக்காளிக்கு தண்ணீர் தேவை!",
    speech_watering: "தக்காளிக்கு நீர் பாய்கிறது! பாசனம் இயங்குகிறது 💦",
    speech_watering_a: "சம்பா நெல்லுக்கு நீர் பாய்கிறது! பாசனம் இயங்குகிறது 💦",
    speech_satisfied: "வயல்கள் பசுமை! தண்ணீர் அளவு நன்று!",
    btn_listen_report: "அறிக்கையை கேள் (குரல்)",
    stop_audio: "குரல் நிறுத்து",

    // Alerts
    dry_alert_title: "வயல் B மண் வறண்டுள்ளது (28%)",
    dry_alert_badge: "பாசனம் தொடங்கியது",
    dry_alert_desc: "மண் ஈரப்பதம் 40% க்கும் குறைந்தது. தானியங்கி வால்வு B மூலம் பாசனம் தொடங்கப்பட்டது.",
    rain_alert_msg: "வானிலை ரேடார்: தெளிவான வானம். அடுத்த 6 மணி நேரத்திற்கு தஞ்சாவூரில் மழை இல்லை.",
    radar_ok: "ரேடார் தெளிவு",
    dismiss: "மூடு",

    // Summary Stats
    stat_avg_moisture: "சராசரி ஈரம்",
    stat_needs_water: "தண்ணீர் தேவை",
    stat_valves: "இயங்கும் வால்வு",
    stat_rain: "மழை நிலை",
    no_rain: "மழை இல்லை",
    rain_detected: "மழை பெய்கிறது",
    sensors_dry: "சென்சார் A & B: உலர்",
    sensors_wet: "மழை கண்டறியப்பட்டது (பாசனம் நிறுத்தம்)",

    // Field View Schematic
    field_view_title: "வயல் வரைபடம் (Field View)",
    schematic_sub: "நேரலை நீர்ப்பாசன வரைபடம் மற்றும் ஓட்ட சென்சார்கள்",
    mode_auto: "Auto (தானியங்கி)",
    mode_manual: "Manual (கைமுறை)",
    main_pipe_tag: "முதன்மை குழாய் · 2.4 BAR அழுத்தம்",
    auto_caption: "⚙️ தானியங்கி விதி: 40% கீழே குறைந்தால் தொடங்கும் · 70% அடைந்தால் தானாக நிற்கும்",
    crop_paddy: "சம்பா நெல் (Samba Paddy)",
    soil_clay: "வண்டல் மண் (Clay Loam)",
    crop_tomato: "நாட்டு தக்காளி (Country Tomato)",
    soil_red: "செம்மண் (Red Sand)",
    satisfied: "போதுமானது",
    irrigating: "நீர்ப்பாசனம் இயங்குகிறது",

    // Detailed Field Cards
    soil_moisture: "மண் ஈரப்பதம்",
    adequate: "போதுமானது (Adequate)",
    water_needed: "தண்ணீர் தேவை! (Dry)",
    valve_label: "வால்வு நிலை",
    valve_closed: "மூடியுள்ளது (OFF)",
    valve_open: "திறந்துள்ளது (ON)",
    rain_sensor: "மழை சென்சார்",
    dry: "உலர்",
    wet: "ஈரம்",
    temp_label: "வெப்பநிலை",
    humid_label: "காற்று ஈரம்",
    btn_start_a: "வால்வு A தொடங்கு",
    btn_stop_b: "வால்வு B நிறுத்து",
    min_duration: "நிமிட கால அளவு",
    left: "மீதம்",

    // Water Tank
    tank_header: "மேல்நிலை தொட்டி (Overhead Tank)",
    tank_sub: "சொட்டுநீர் மற்றும் தெளிப்பான் பாசன நீர் சேமிப்பு",
    sufficient: "நிறைவு (Sufficient)",
    low_water: "குறைந்த நீர் (Low)",
    avail_water: "கிடைக்கும் நீர்",
    total_cap: "மொத்த கொள்ளளவு: 1000 லிட்டர்",
    pump_status: "மோட்டார் நிலை",
    pump_running: "இயங்குகிறது (வால்வு B பாய்ச்சல்)",
    pump_idle: "காத்திருப்பில் (Idle)",
    pump_refill: "கிணற்றிலிருந்து நிறைகிறது...",
    safety_title: "மோட்டார் வறட்சி தடுப்பு பாதுகாப்பு இயங்குகிறது",
    safety_desc: "போர்வெல் மோட்டார் சூடாவதை தடுக்க 200 லிட்டருக்கு (20%) கீழே சென்றால் தானாக நிற்கும்.",
    btn_tank_refill: "⚡ போர்வெல் மோட்டார் இயக்கு (Refill Tank)",

    // Telemetry History
    trends_title: "சென்சார் வரைபடம் (Telemetry History)",
    trends_sub: "கடந்த 24 மணி நேர ஈரப்பதம் மற்றும் வானிலை பதிவுகள்",
    moisture_trend_title: "மண் ஈரப்பதம் போக்கு (%)",
    temp_trend_title: "வெப்பநிலை போக்கு (°C)",
    humid_trend_title: "காற்று ஈரப்பதம் போக்கு (%)",

    // Activity Timeline
    timeline_title: "சமீபத்திய நிகழ்வுகள் (Recent Activity)",
    live_sync: "நேரலை நிகழ்வு பதிவு",

    // Basic Phone Voice Hotline
    phone_header: "ஸ்மார்ட்போன் இல்லையா? சாதாரண போனில் அழைக்கலாம்",
    phone_sub: "No smartphone? Use any basic phone in Tamil",
    toll_free_badge: "கட்டணமில்லா சேவை (Toll-Free)",
    phone_explanation: "இந்த கட்டணமில்லா எண்ணுக்கு மிஸ்டு கால் கொடுங்கள். தானியங்கி குரல் கணினி உடனே அழைத்து தமிழில் உங்கள் வயல் ஈரப்பத நிலவரத்தை ஒலிக்கும்.",
    call_now_btn: "உடனே அழைக்க (Simulate Call)",
    keypad_guide: "தானியங்கி குரல் விசை வழிகாட்டி (IVR Keypad Guide):",
    ivr_1: "முழு நிலவரம் கேட்க",
    ivr_1_en: "Full field report",
    ivr_2: "பாசனம் தொடங்க",
    ivr_2_en: "Irrigation ON",
    ivr_3: "பாசனம் நிறுத்த",
    ivr_3_en: "Irrigation OFF",
    ivr_4: "மீண்டும் கேட்க",
    ivr_4_en: "Repeat report",

    // Footer
    footer_text: "© 2025 Vayal Thozhan (வயல் தோழன்). தமிழ்நாடு விவசாயிகளுக்கான நுண்ணறிவு நீர்ப்பாசன அமைப்பு.",
    footer_ivr: "IVR உதவி எண்: 1800-425-1555",
    footer_guide: "பயன்பாட்டு வழிகாட்டி",
    footer_weather: "வானிலை அறிக்கை",
    footer_privacy: "தனியுரிமை கொள்கை",
    footer_footnote: "வேளாண் விரிவாக்க அலுவலர்கள் மற்றும் சிறு விவசாயிகளுக்காக வடிவமைக்கப்பட்டது · குறைந்த இணைய நுகர்வு முறை",

    // Simulation Drawer
    sim_title: "ஊடாடும் சோதனை பலகை (Interactive Test Bench)",
    sim_speed: "வேகம்",
    sim_heatwave: "🔥 வெப்ப அலை (ஈரம் குறையும்)",
    sim_rain: "🌧️ மழை பெய்வி (பாசனம் நிற்கும்)",
    sim_refill_well: "💧 தொட்டி நிரப்பு",
    sim_reset: "மீட்டமை (Reset)",
  },
  en: {
    // Top Bar
    brand_title: "Vayal Thozhan",
    brand_tag: "· farm01",
    nav_overview: "Farm Overview",
    nav_fields: "Fields A & B",
    nav_irrigation: "Irrigation Management",
    nav_telemetry: "Reports & Telemetry",
    theme_light: "Light",
    theme_dark: "Dark",
    lang_btn: "English / தமிழ்",
    simulation_panel: "Demo Simulator",

    // Hero Section
    live_status: "Online · Live Telemetry",
    hero_title: "Vanakkam Murugan anna",
    hero_title_sub: "வணக்கம் முருகன் அண்ணா",
    hero_subtitle_watering: "Field B needs water. Irrigation is running via Valve B.",
    hero_subtitle_field_a_watering: "Field A paddy irrigation is active via Valve A.",
    hero_subtitle_both_watering: "Both Field A and Field B are actively being irrigated.",
    hero_subtitle_dry_ready: "Field B moisture is below 40%. Ready for irrigation.",
    hero_subtitle_optimal: "All fields are optimal and healthy. Soil moisture well balanced.",
    updated_time: "Updated: ",
    today: "(Today)",
    location: "Thanjavur District, Tamil Nadu",
    speech_thirsty: "Field B thirsty! Tomato soil moisture critical!",
    speech_watering: "Watering Field B! Irrigation is running 💦",
    speech_watering_a: "Watering Field A Paddy! Irrigation active 💦",
    speech_satisfied: "Crops healthy! Moisture levels optimal!",
    btn_listen_report: "Listen Voice Report",
    stop_audio: "Stop Voice",

    // Alerts
    dry_alert_title: "Field B is DRY (28%)",
    dry_alert_badge: "Irrigation Active",
    dry_alert_desc: "Soil moisture dropped below critical 40% threshold. Irrigation started automatically via Valve B.",
    rain_alert_msg: "Weather Radar: Clear skies. No rain forecast in Thanjavur district for next 6 hours.",
    radar_ok: "Radar Clear",
    dismiss: "Dismiss",

    // Summary Stats
    stat_avg_moisture: "Avg Moisture",
    stat_needs_water: "Needs Water",
    stat_valves: "Valves Open",
    stat_rain: "Rain Status",
    no_rain: "No Rain",
    rain_detected: "Rain Detected",
    sensors_dry: "Sensors A & B: Dry",
    sensors_wet: "Rain Sensor Active (Paused)",

    // Field View Schematic
    field_view_title: "Field View Topology",
    schematic_sub: "Live top-down irrigation topology & flow sensors",
    mode_auto: "Auto Mode",
    mode_manual: "Manual Mode",
    main_pipe_tag: "Main Water Pipe · 2.4 Bar Pressure",
    auto_caption: "⚙️ Auto logic: Start pump below 40% threshold · Stop pump automatically at 70%",
    crop_paddy: "Samba Paddy",
    soil_clay: "Clay Loam Soil",
    crop_tomato: "Native Tomato",
    soil_red: "Red Sand Soil",
    satisfied: "Optimal",
    irrigating: "Irrigation Active",

    // Detailed Field Cards
    soil_moisture: "Soil Moisture",
    adequate: "Adequate",
    water_needed: "Water Needed!",
    valve_label: "Valve Status",
    valve_closed: "CLOSED (OFF)",
    valve_open: "OPEN (ON)",
    rain_sensor: "Rain Sensor",
    dry: "Dry",
    wet: "Wet",
    temp_label: "Temperature",
    humid_label: "Humidity",
    btn_start_a: "Start Valve A",
    btn_stop_b: "Stop Valve B now",
    min_duration: "min duration",
    left: "left",

    // Water Tank
    tank_header: "Overhead Water Tank",
    tank_sub: "Reservoir storage for micro-drip & sprinkler pump feed",
    sufficient: "Sufficient",
    low_water: "Low Water",
    avail_water: "Available Water",
    total_cap: "Total capacity: 1000 Litres",
    pump_status: "Pump Status",
    pump_running: "Running (Feeding Valve B)",
    pump_idle: "Idle (Standby)",
    pump_refill: "Borehole refilling tank...",
    safety_title: "Motor Dry-Run Protection Active",
    safety_desc: "Automatic safety switch trips if water dips below 200 Litres (20%) to prevent borehole pump overheating.",
    btn_tank_refill: "⚡ Force Well Refill (Run Pump)",

    // Telemetry History
    trends_title: "Telemetry History & Sensors",
    trends_sub: "Recorded 24-hour moisture and micro-climate sensor cycles",
    moisture_trend_title: "Soil Moisture Trends (%)",
    temp_trend_title: "Temperature Trend (°C)",
    humid_trend_title: "Ambient Humidity Trend (%)",

    // Activity Timeline
    timeline_title: "Recent Activity Log",
    live_sync: "Real-time Event Log",

    // Basic Phone Voice Hotline
    phone_header: "No smartphone? Use any basic phone",
    phone_sub: "Access automated IVR phone system in Tamil",
    toll_free_badge: "Toll-Free (Free)",
    phone_explanation: "Give a missed call to this toll-free number. The automated system calls you back immediately and reads your field moisture report in spoken Tamil.",
    call_now_btn: "Call Now (Simulate IVR Call)",
    keypad_guide: "Automated Voice Keypad Guide:",
    ivr_1: "Full field report",
    ivr_1_en: "Full field report",
    ivr_2: "Irrigation ON",
    ivr_2_en: "Start irrigation",
    ivr_3: "Irrigation OFF",
    ivr_3_en: "Stop irrigation",
    ivr_4: "Repeat report",
    ivr_4_en: "Repeat report",

    // Footer
    footer_text: "© 2025 Vayal Thozhan. Smart Precision Irrigation System for Tamil Nadu smallholder farmers.",
    footer_ivr: "Toll-Free IVR: 1800-425-1555",
    footer_guide: "User Manual",
    footer_weather: "Weather Radar",
    footer_privacy: "Privacy Policy",
    footer_footnote: "Designed for agricultural extension offices & Tamil Nadu farmers · Low Data Consumption Mode Active",

    // Simulation Drawer
    sim_title: "Interactive Simulation Playground",
    sim_speed: "Speed",
    sim_heatwave: "🔥 Heatwave (Dries Soil)",
    sim_rain: "🌧️ Rain Storm (Auto Pause)",
    sim_refill_well: "💧 Refill Tank",
    sim_reset: "Reset Defaults",
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations['en']): string {
  return translations[lang][key] || translations['en'][key] || key;
}
