"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "@medusajs/icons"
import { clx } from "@modules/common/components/ui"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-8 h-8" />
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={clx(
        "relative flex items-center justify-center w-8 h-8 transition-colors duration-300 rounded-none border border-transparent hover:border-brand-neon group",
        "text-black dark:text-white"
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 group-hover:text-brand-neon" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:text-brand-neon" />
    </button>
  )
}
