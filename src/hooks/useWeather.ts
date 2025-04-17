import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { WeatherData } from '@/types/weather'
import { cities } from '@/types/weather'
import { API_ENDPOINTS } from '@/constants/api'

const CACHE_DURATION = 5 * 60 * 1000 // 5 минут
const MAX_RETRIES = 3 // Максимальное количество попыток
const RETRY_DELAY = 1000 // Задержка между попытками в мс

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetchTime, setLastFetchTime] = useState(() => Date.now())

  const fetchCityWeather = async (city: { name: string; lat: number; lon: number }, retryCount = 0): Promise<WeatherData | null> => {
    try {
      if (!import.meta.env.VITE_WEATHER_API_KEY) {
        throw new Error('API ключ не определен. Пожалуйста, проверьте .env файл')
      }

      const url = API_ENDPOINTS.WEATHER(city.lat, city.lon)
      console.log(`Запрос к API для города ${city.name}:`, url)

      const response = await fetch(url)

      console.log(`Ответ API для города ${city.name}:`, response.status, response.statusText)

      if (response.status === 401) {
        throw new Error('Неверный API ключ. Пожалуйста, проверьте .env файл')
      }

      if (response.status === 429) {
        if (retryCount < MAX_RETRIES) {
          console.log(`Превышен лимит запросов для ${city.name}. Попытка ${retryCount + 1} из ${MAX_RETRIES}`)
          await sleep(RETRY_DELAY)
          return fetchCityWeather(city, retryCount + 1)
        }
        throw new Error('Слишком много запросов. Пожалуйста, подождите немного.')
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error(`Ошибка API для города ${city.name}:`, errorData)
        
        if (retryCount < MAX_RETRIES) {
          console.log(`Повторная попытка для ${city.name}. Попытка ${retryCount + 1} из ${MAX_RETRIES}`)
          await sleep(RETRY_DELAY)
          return fetchCityWeather(city, retryCount + 1)
        }
        throw new Error(`Ошибка при получении данных для города ${city.name}: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`Данные для города ${city.name}:`, data)
      
      if (!data.current || !data.location) {
        throw new Error(`Неверный формат данных для города ${city.name}`)
      }

      return {
        city: city.name,
        temperature: Math.round(data.current.temp_c),
        description: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        icon: data.current.condition.icon,
        feelsLike: Math.round(data.current.feelslike_c),
        pressure: data.current.pressure_mb,
        airQuality: data.current.air_quality ? {
          co: data.current.air_quality.co,
          no2: data.current.air_quality.no2,
          o3: data.current.air_quality.o3,
          so2: data.current.air_quality.so2,
          pm2_5: data.current.air_quality.pm2_5,
          pm10: data.current.air_quality.pm10,
          'us-epa-index': data.current.air_quality['us-epa-index']
        } : undefined
      }
    } catch (err) {
      console.error(`Ошибка при получении данных для ${city.name}:`, err)
      return null
    }
  }

  const fetchWeatherData = useCallback(async (force = false) => {
    const now = Date.now()
    if (!force && now - lastFetchTime < CACHE_DURATION && weatherData.length > 0) {
      console.log('Используем кэшированные данные')
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log('Начинаем загрузку данных о погоде')
      const results = await Promise.all(
        cities.map(city => fetchCityWeather(city))
      )

      const validResults = results.filter((result): result is WeatherData => result !== null)
      
      if (validResults.length === 0) {
        throw new Error('Не удалось получить данные ни для одного города')
      }

      console.log('Успешно получены данные для городов:', validResults.map(r => r.city))
      setWeatherData(validResults)
      setLastFetchTime(now)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка'
      console.error('Ошибка при загрузке данных о погоде:', err)
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [lastFetchTime, weatherData.length])

  const searchCity = async (cityName: string) => {
    const city = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase())
    if (!city) {
      setError('Город не найден')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await fetchCityWeather(city)
      
      if (result) {
        setWeatherData(prev => {
          const existingIndex = prev.findIndex(w => w.city === result.city)
          if (existingIndex >= 0) {
            const newData = [...prev]
            newData[existingIndex] = result
            return newData
          }
          return [...prev, result]
        })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('Компонент монтирован, начинаем загрузку данных')
    fetchWeatherData(true)
  }, [])

  return {
    weatherData,
    loading,
    error,
    fetchWeatherData,
    searchCity
  }
} 