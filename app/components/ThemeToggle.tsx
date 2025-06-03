'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-zinc-800/50 animate-pulse" />
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="relative p-2 rounded-xl bg-zinc-800/50 dark:bg-zinc-800/50 hover:bg-zinc-700/50 dark:hover:bg-zinc-700/50 border border-zinc-700/50 dark:border-zinc-700/50 transition-all duration-300 group hover:scale-110"
        aria-label="Toggle theme"
      >
        <div className="relative w-5 h-5">
          {/* Sun icon for light mode */}
          <FiSun className={`absolute inset-0 w-5 h-5 text-orange-500 transition-all duration-300 ${
            theme === 'light' 
              ? 'scale-100 rotate-0 opacity-100' 
              : 'scale-0 rotate-90 opacity-0'
          }`} />
          
          {/* Moon icon for dark mode */}
          <FiMoon className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
            theme === 'dark' 
              ? 'scale-100 rotate-0 opacity-100' 
              : 'scale-0 -rotate-90 opacity-0'
          }`} />
        </div>
        
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-xl blur-lg transition-opacity duration-300 ${
          theme === 'light' 
            ? 'bg-orange-500/20 opacity-100' 
            : 'bg-blue-400/20 opacity-100'
        } group-hover:opacity-100`} />
      </button>
    </div>
  )
}

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl bg-zinc-800/50 animate-pulse" />
    )
  }

  const themes = [
    { name: 'Light', value: 'light', icon: FiSun, color: 'text-orange-500' },
    { name: 'Dark', value: 'dark', icon: FiMoon, color: 'text-blue-400' },
    { name: 'System', value: 'system', icon: FiMonitor, color: 'text-purple-400' },
  ]

  const currentTheme = themes.find(t => t.value === theme)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-zinc-800/50 dark:bg-zinc-800/50 hover:bg-zinc-700/50 dark:hover:bg-zinc-700/50 border border-zinc-700/50 dark:border-zinc-700/50 transition-all duration-300 group hover:scale-110"
        aria-label="Change theme"
      >
        <div className="relative w-5 h-5">
          {currentTheme && (
            <currentTheme.icon className={`w-5 h-5 ${currentTheme.color} transition-all duration-300`} />
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-32 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => {
                  setTheme(themeOption.value)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  theme === themeOption.value
                    ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <themeOption.icon className={`w-4 h-4 ${
                  theme === themeOption.value ? themeOption.color : 'text-current'
                }`} />
                <span>{themeOption.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
