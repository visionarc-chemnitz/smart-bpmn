"use client";
import { useRef } from "react";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { FaLinkedin, FaTwitter } from "react-icons/fa";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./sidebar"; 
// Sidebar menu JSON configuration
const menuItems = [
  {
    title: "Home",
    icon: HomeIcon,
    page: "home",
  },
  {
    title: "Profile",
    icon: UserIcon,
    page: "profile",
  }
];

export default function SidebarMenuComponent({ setCurrentPage, currentPage }) {
  // Function to handle the menu click and set active page
  const handleMenuClick = (page) => {
    setCurrentPage(page); // Update the current page in the parent component
  };

  return (
    <div>
      <SidebarMenu>
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Logo"
          className="mx-auto mt-6"  // Center the logo horizontally and give margin-top
          style={{ width: "180px", height: "auto" }}  // Inline styles for width and height
        />
        
        {/* Blue Separator (Border below the logo) */}
        <div className="my-2" style={{ borderTop: "2px solid #0bb3ff" }} /> {/* Use inline style for custom color */}
        
        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <SidebarMenuItem 
            key={index}
            data-active={currentPage === item.page ? 'true' : 'false'} // Set data-active attribute
            className="peer"
          >
            <SidebarMenuButton
              onClick={() => item.page ? handleMenuClick(item.page) : item.onClick()}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-300 ${
                currentPage === item.page ? 'bg-gray-700 text-white' : 'hover:bg-gray-600 text-gray-900 dark:text-gray-300'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      {/* Footer with Social Media Icons */}
      <div
  className="absolute bottom-6 left-0 w-full px-4 flex flex-col items-center space-y-4"
>
  {/* LinkedIn and Twitter Icons */}
  <a
    href="https://www.linkedin.com/in/vision-arc-5bb507336/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaLinkedin className="text-gray-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-500 w-6 h-6 transition-all" />
  </a>
  
  <a
    href="https://x.com/visionArc_"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaTwitter className="text-gray-600 dark:text-white hover:text-blue-400 dark:hover:text-blue-300 w-6 h-6 transition-all" />
  </a>
</div>

    </div>
    
  );
}