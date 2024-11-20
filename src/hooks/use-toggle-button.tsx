"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useToggleButton() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Render theme toggle button
  const renderThemeToggle = () => (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
    >
      {mounted && (theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
    </Button>
  );

  // Only render logo after mounting
  const logoSrc =  mounted 
    ? theme === 'dark' 
      ? '/assets/img/logo/logo.png'
      : '/assets/img/logo/logo.png'
    : '/assets/img/logo/logo.png'; // Default logo for SSR here

  // export the toggle button and logo from the hook
  return { toggleButton: renderThemeToggle, logoSrc };
}