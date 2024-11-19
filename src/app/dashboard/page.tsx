"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // Icons
import SidebarMenuComponent from "./(components)/sidebarmenu";
import { Sidebar, SidebarProvider, SidebarTrigger } from "./(components)/sidebar";
import { useIsMobile } from "../../hooks/use-mobile";
import Home from "./pages/home"; // Import Home page component
import Profile from "./pages/profile"; // Import Profile page component
import Navbar from "./(components)/navbar";

// Dashboard Component
export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Dark mode is enabled by default
  const [open, setOpen] = useState(true); // Sidebar is open by default
  const [currentPage, setCurrentPage] = useState("home"); // Default page is 'home'
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Theme Logic: Apply saved or default dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // Apply system preference if no theme is saved
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark); // This will set the theme based on system preference
    }
  }, []);

  useEffect(() => {
    // Set dark mode class on the root element
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Render the page content dynamically
  const renderPageContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;  // Render Home page
      case 'profile':
        return <Profile />;  // Render Profile page
      default:
        return <Home />;  // Default to Home page
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      {/* Sidebar */}
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar collapsible="icon">
          <SidebarMenuComponent setCurrentPage={setCurrentPage} currentPage={currentPage} /> {/* Pass setCurrentPage and currentPage to SidebarMenu */}
        </Sidebar>
        <main>
          <SidebarTrigger />
          <div className="max-w-7xl mx-auto">
            {/* Render the page content dynamically */}
            <div className="mt-6">
              {renderPageContent()}
            </div>
          </div>
        </main>
      </SidebarProvider>

      {/* Footer with copyright */}
      <footer className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} text-center py-4 mt-6`}>
        <p>© {new Date().getFullYear()} VisionArc. All rights reserved.</p>
      </footer>
    </div>
  );
}
