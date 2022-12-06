import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const theme = localStorage.getItem("theme")

if(theme === "dark" || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add("dark")
} else {
  document.documentElement.classList.add("light")
} 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
