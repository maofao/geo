import { Input, Button, AutoComplete, Tooltip, InputRef } from 'antd'
import { SearchOutlined, LoadingOutlined, HistoryOutlined, CloseOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { cities } from '@/types/weather'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  searchQuery: string;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

const DEBOUNCE_DELAY = 300
const MAX_HISTORY_ITEMS = 5

export const SearchBar = ({
  searchQuery,
  loading,
  onSearchChange,
  onSearchSubmit
}: SearchBarProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const inputRef = useRef<InputRef>(null)

  // Загрузка истории поиска из localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherSearchHistory')
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Сохранение истории поиска в localStorage
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('weatherSearchHistory', JSON.stringify(searchHistory))
    }
  }, [searchHistory])

  const updateSuggestions = useCallback((value: string) => {
    if (value.length < 2) {
      setSuggestions([])
      return
    }

    const filtered = cities
      .map(city => city.name)
      .filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      )
      .slice(0, 5)

    setSuggestions(filtered)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSuggestions(searchQuery)
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(timer)
  }, [searchQuery, updateSuggestions])

  const handleInputChange = (value: string) => {
    onSearchChange(value)
    setShowSuggestions(true)
  }

  const handleSuggestionSelect = (value: string) => {
    onSearchChange(value)
    setShowSuggestions(false)
    addToHistory(value)
    onSearchSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  const addToHistory = (value: string) => {
    setSearchHistory(prev => {
      const newHistory = [value, ...prev.filter(item => item !== value)]
      return newHistory.slice(0, MAX_HISTORY_ITEMS)
    })
  }

  const clearHistory = () => {
    setSearchHistory([])
    localStorage.removeItem('weatherSearchHistory')
  }

  // Обработка горячих клавиш
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowSuggestions(false)
      }
      if (e.key === 'Enter' && !showSuggestions) {
        onSearchSubmit({ preventDefault: () => {} } as React.FormEvent)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showSuggestions, onSearchSubmit])

  return (
    <motion.form 
      onSubmit={onSearchSubmit} 
      className="mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex w-full max-w-md gap-2">
        <AutoComplete
          value={searchQuery}
          onChange={handleInputChange}
          onSelect={handleSuggestionSelect}
          options={[
            ...(searchHistory.length > 0 ? [{
              label: (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HistoryOutlined />
                    История поиска
                  </span>
                  <Button
                    type="text"
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={(e) => {
                      e.stopPropagation()
                      clearHistory()
                    }}
                  />
                </div>
              ),
              options: searchHistory.map(item => ({
                value: item,
                label: item
              }))
            }] : []),
            ...(suggestions.length > 0 ? [{
              label: 'Предложения',
              options: suggestions.map(suggestion => ({
                value: suggestion,
                label: suggestion
              }))
            }] : [])
          ]}
          className="flex-1"
          open={showSuggestions && (suggestions.length > 0 || searchHistory.length > 0)}
          dropdownRender={(menu) => (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {menu}
              </motion.div>
            </AnimatePresence>
          )}
        >
          <Input
            ref={inputRef}
            placeholder="Поиск города..."
            className={cn(
              'bg-background-card-light dark:bg-background-card-dark',
              'border-border-light dark:border-border-dark',
              'text-text dark:text-text-dark',
              'focus:border-primary focus:ring-2 focus:ring-primary/20'
            )}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
        </AutoComplete>
        <Tooltip title="Нажмите Enter для поиска">
          <Button
            type="primary"
            htmlType="submit"
            icon={loading ? <LoadingOutlined /> : <SearchOutlined />}
            loading={loading}
            className={cn(
              'bg-primary hover:bg-primary-dark',
              'text-white',
              'border-none'
            )}
          >
            Поиск
          </Button>
        </Tooltip>
      </div>
    </motion.form>
  )
} 