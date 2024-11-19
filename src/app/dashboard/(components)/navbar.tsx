import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // Importing icons for moon and sun
import { ChevronDownIcon } from "@heroicons/react/24/outline"; // Importing a down arrow icon
import SparklesText from "@/components/ui/sparkles-text"; // Assuming you have this component
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";


export default function Navbar({ isDarkMode, toggleTheme }) {
  const { data: session, status } = useSession(); // Get session data and loading status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to toggle the dropdown visibility

  // Safely handle the user image and check if session is loaded
  const user = {
    image: session?.user?.image || "/default-avatar.png" // Fallback to a default image if session is not available
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // If session is loading, return null or a loading state (you can customize this)
  if (status === "loading") {
    return (
      <nav className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <div className="text-xl font-bold text-gray-900 dark:text-white">Loading...</div>
      </nav>
    );
  }

  return (
    <div>
      <nav className="bg-gray-100 dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
        {/* Centering the Text */}
        <div className="flex-grow text-center">
          <SparklesText text="Welcome to VisionArc !!!" className="text-lg" />
        </div>

        {/* Dark Mode Toggle */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
          >
            {isDarkMode ? <FaSun className="text-sm" /> : <FaMoon className="text-sm" />}
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative">
            {/* User Image (or placeholder) */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
              <img
                src={user.image} // Fallback to default if image is not available
                alt="User"
                className="w-10 h-10 rounded-full"
              />
              <ChevronDownIcon className="w-5 h-5 text-gray-700 dark:text-white" />
            </div>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border rounded-lg shadow-lg">
                
                {/* Logout Option */}
                <div
                  className="px-4 py-2 text-gray-700 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => signOut({ callbackUrl: window.location.origin })}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
