'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Sun, Moon, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"

const navLinks = [
  { name: "Home", id: "home" },
  { name: "About  ", id: "about" },
  { name: "Team", id: "team" }
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const renderThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
    >
      {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
    </Button>
  )

  // Only render logo after mounting
  const logoSrc = mounted 
    ? theme === 'dark' 
      ? '/assets/img/logo/logo.png'
      : '/assets/img/logo/logo.png'
    : '/assets/img/logo/logo.png' // Default logo for SSR

  return (
    <>
      <header className="fixed top-0 w-full px-3 xs:px-4 lg:px-6 h-14 xs:h-16 flex items-center bg-white/75 dark:bg-background/75 backdrop-blur-xl z-50 border-b border-gray-200/50 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
        <Link className="flex items-center" href="">
          <Image
            src={logoSrc}
            alt="VisionArc Logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-lg font-semibold">VisionArc</span>
        </Link>
        
        <nav className="ml-auto hidden md:flex items-center justify-end gap-8">
          {navLinks.map((item) => (
            <Link 
              key={item.id} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative group"
              href={`#${item.id}`}
              onClick={() => {
                const section = document.getElementById(item.id);
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10">{item.name}</span>
              <span className="absolute -inset-x-4 -inset-y-2 bg-primary/5 dark:bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></span>
              <span className="absolute -inset-x-4 -inset-y-2 bg-primary/5 dark:bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out delay-100"></span>
              <span className="absolute -inset-x-4 -inset-y-2 bg-primary/5 dark:bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out delay-200"></span>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4 ml-auto md:ml-0">
          {renderThemeToggle()}
          <Button
            variant="ghost" 
            size="icon"
            className="md:hidden hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed top-14 xs:top-16 left-0 right-0 bg-background/75 backdrop-blur-xl shadow-lg z-40 md:hidden">
          <nav className="flex flex-col p-4">
            {navLinks.map((item) => (
              <Link 
                key={item.id} 
                className="text-sm font-medium py-3 px-4 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-all duration-300 transform hover:translate-x-2" 
                href={`#${item.id}`} 
                onClick={() => {
                  const section = document.getElementById(item.id);
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}