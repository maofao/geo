if (!import.meta.env.VITE_WEATHER_API_KEY) {
  throw new Error('API_KEY не определен. Пожалуйста, добавьте VITE_WEATHER_API_KEY в .env файл');
}

export const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
export const API_URL = 'https://api.weatherapi.com/v1';

export const API_ENDPOINTS = {
  WEATHER: (lat: number, lon: number) => {
    if (!API_KEY) {
      throw new Error('API ключ не определен');
    }
    return `${API_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&lang=ru&aqi=yes`;
  }
}; 