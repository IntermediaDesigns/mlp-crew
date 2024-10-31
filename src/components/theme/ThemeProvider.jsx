import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("theme")
      if (stored) return stored
      
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark"
      }
    }
    return "light"
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}