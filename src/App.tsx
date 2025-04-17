import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Moon, Sun } from 'lucide-react'
import { WeatherCard } from '@/components/weather/WeatherCard'
import { SearchBar } from '@/components/weather/SearchBar'
import { useWeather } from '@/hooks/useWeather'
import { Button } from '@/components/ui/button'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true' || 
           (saved === null && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const { weatherData, loading, error, fetchWeatherData, searchCity } = useWeather()

  useEffect(() => {
    fetchWeatherData()
  }, [fetchWeatherData])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      searchCity(searchQuery.trim())
    }
  }

  const handleRefresh = (cityName: string) => {
    searchCity(cityName)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Прогноз погоды
          </motion.h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Переключить тему"
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          loading={loading}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleSearch}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-red-500 dark:text-red-400 mb-4"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 dark:text-blue-400" />
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weatherData.map((city) => (
                <WeatherCard
                  key={city.city}
                  weather={city}
                  onRefresh={() => handleRefresh(city.city)}
                />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

export default App