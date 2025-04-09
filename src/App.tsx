import { useState } from 'react';
import './App.css';

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
  }[];
  cod: number;
}

function App() {
  const [city, setCity] = useState<string>('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>('');

  const apiKey = '686f17ae0f0ddc75c8c8882b5ff8727f'; 

  const getWeather = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=ru`;

    try {
      const response = await fetch(url);
      const data: WeatherData = await response.json();

      if (data.cod === 200) {
        setWeather(data);
        setError('');
      } else {
        setError('Город не найден. Попробуйте снова.');
        setWeather(null);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Не удалось получить данные. Проверьте соединение и повторите попытку.');
      setWeather(null);
    }
  };

  return (
    <div className="weather-app">
      <h1>Прогноз погоды</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Введите город"
      />
      <button onClick={getWeather}>Получить прогноз</button>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>Погода в {weather.name}</h2>
          <p>Температура: {weather.main.temp}°C</p>
          <p>{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;