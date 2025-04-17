import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'
import { Toaster } from 'sonner'
import { ConfigProvider } from 'antd'
import ruRU from 'antd/locale/ru_RU'

// Проверяем системные настройки темы
const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
if (isDarkMode) {
  document.documentElement.classList.add('dark')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4,
        },
      }}
    >
      <App />
      <Toaster 
        position="top-right"
        theme="system"
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />
    </ConfigProvider>
  </React.StrictMode>,
) 