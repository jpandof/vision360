import { atom } from 'nanostores'

export type Theme = 'light' | 'dark' | 'system'

export const $theme = atom<Theme>('system')

export const setTheme = (theme: Theme) => {
  $theme.set(theme)
  
  const root = window.document.documentElement
  root.classList.remove('light', 'dark')
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
    root.classList.add(systemTheme)
  } else {
    root.classList.add(theme)
  }
}

// Initialize theme
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as Theme
  if (savedTheme) {
    setTheme(savedTheme)
  } else {
    setTheme('system')
  }
}