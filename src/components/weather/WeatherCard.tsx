import { Card, Typography, Button, Tooltip, Progress, Divider } from 'antd'
import { ReloadOutlined, InfoCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { WeatherData } from '@/types/weather'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Line } from '@ant-design/plots'

const { Title, Text } = Typography

interface WeatherCardProps {
  weather: WeatherData;
  onRefresh: () => void;
  className?: string;
}

export const WeatherCard = ({ weather, onRefresh, className }: WeatherCardProps) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [temperatureData, setTemperatureData] = useState<{ time: string; temperature: number }[]>([])

  useEffect(() => {
    // Генерация случайных данных для графика температуры
    const generateTemperatureData = () => {
      const data = []
      const now = new Date()
      for (let i = 0; i < 24; i++) {
        const time = new Date(now.getTime() + i * 3600000)
        data.push({
          time: time.toLocaleTimeString('ru-RU', { hour: '2-digit' }),
          temperature: Math.round(weather.temperature + (Math.random() * 4 - 2))
        })
      }
      return data
    }

    setTemperatureData(generateTemperatureData())
  }, [weather.temperature])

  const handleImageError = () => {
    setImageError(true)
  }

  const getWindDirection = (degrees: number) => {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ']
    const index = Math.round(degrees / 45) % 8
    return directions[index]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          'weather-card',
          'hover:shadow-lg transition-shadow duration-300',
          className
        )}
        title={
          <div className="flex justify-between items-center w-full">
            <Title level={4} className="!m-0 dark:text-white">
              {weather.city}
            </Title>
            <Tooltip title="Обновить данные">
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={onRefresh}
                className={cn(
                  'dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700',
                  'transition-transform duration-300',
                  isHovered && 'rotate-180'
                )}
              />
            </Tooltip>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={weather.icon}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {!imageError ? (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="weather-icon"
                    onError={handleImageError}
                  />
                ) : (
                  <InfoCircleOutlined className="weather-icon text-gray-400" />
                )}
              </motion.div>
            </AnimatePresence>
            <Title level={2} className="!m-0 weather-temp">
              {weather.temperature}°C
            </Title>
          </div>

          <div className="weather-details grid grid-cols-2 gap-4">
            <div className="weather-detail p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Text className="text-gray-500 dark:text-gray-400">Ощущается как</Text>
              <div className="flex items-center gap-2">
                <Text className="text-lg font-medium">
                  {weather.feelsLike}°C
                </Text>
                {weather.feelsLike > weather.temperature ? (
                  <ArrowUpOutlined className="text-red-500" />
                ) : (
                  <ArrowDownOutlined className="text-blue-500" />
                )}
              </div>
            </div>

            <div className="weather-detail p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Text className="text-gray-500 dark:text-gray-400">Влажность</Text>
              <div className="flex items-center gap-2">
                <Text className="text-lg font-medium">
                  {weather.humidity}%
                </Text>
                <Progress
                  percent={weather.humidity}
                  showInfo={false}
                  strokeColor="#1890ff"
                  size="small"
                />
              </div>
            </div>

            <div className="weather-detail p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Text className="text-gray-500 dark:text-gray-400">Ветер</Text>
              <div className="flex items-center gap-2">
                <Text className="text-lg font-medium">
                  {weather.windSpeed} м/с
                </Text>
                <Text className="text-gray-500">
                  {getWindDirection(weather.windDeg)}
                </Text>
              </div>
            </div>

            <div className="weather-detail p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <Text className="text-gray-500 dark:text-gray-400">Давление</Text>
              <Text className="text-lg font-medium">
                {weather.pressure} мм рт. ст.
              </Text>
            </div>
          </div>

          <Divider className="my-2" />

          <div className="weather-graph">
            <Line
              data={temperatureData}
              xField="time"
              yField="temperature"
              smooth
              height={100}
              color="#1890ff"
              tooltip={{
                formatter: (datum: { time: string; temperature: number }) => {
                  return {
                    name: 'Температура',
                    value: `${datum.temperature}°C`,
                  }
                },
              }}
            />
          </div>

          <Text className="text-lg capitalize weather-detail text-center">
            {weather.description}
          </Text>
        </div>
      </Card>
    </motion.div>
  )
} 