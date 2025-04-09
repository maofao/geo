import React, { useState, FormEvent, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherCondition {
  text: string;
  icon: string;
}

interface WeatherData {
  temp_c: number;
  condition: WeatherCondition;
  humidity: number;
  wind_kph: number;
}

interface WeatherDisplayProps {
  city: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ city }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=2a589905d5114dbaa34163043250904&q=${city}&aqi=no`
        );
        
        if (!response.ok) {
          throw new Error('Город не найден');
        }

        const data = await response.json();
        setWeather(data.current);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  if (loading) return <p className="text-center">Загрузка...</p>;
  if (error) return <p className="text-center text-red-500">Ошибка: {error}</p>;
  if (!weather) return null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Погода в {city}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <img src={`https:${weather.condition.icon}`} alt="weather icon" className="w-16 h-16" />
        <div className="text-center space-y-2">
          <p>Температура: {weather.temp_c}°C</p>
          <p>Состояние: {weather.condition.text}</p>
          <p>Влажность: {weather.humidity}%</p>
          <p>Ветер: {weather.wind_kph} км/ч</p>
        </div>
      </CardContent>
    </Card>
  );
};

const App: React.FC = () => {
  const [city, setCity] = useState<string>('');
  const [searchCity, setSearchCity] = useState<string>(''); 

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (city.trim()) {
      setSearchCity(city.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Проверка погоды</h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Введите название города"
            className="flex-1"
          />
          <Button type="submit">Узнать погоду</Button>
        </form>
        {searchCity && <WeatherDisplay city={searchCity} />}
      </div>
    </div>
  );
};

export default App;