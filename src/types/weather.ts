export interface City {
  name: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  icon: string;
  feelsLike: number;
  pressure: number;
  airQuality?: {
    co: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    'us-epa-index': number;
  };
}

export const cities: City[] = [
  { name: 'Москва', lat: 55.7558, lon: 37.6173 },
  { name: 'Санкт-Петербург', lat: 59.9343, lon: 30.3351 },
  { name: 'Новосибирск', lat: 55.0084, lon: 82.9357 },
  { name: 'Екатеринбург', lat: 56.8389, lon: 60.6057 },
  { name: 'Казань', lat: 55.7887, lon: 49.1221 }
]; 