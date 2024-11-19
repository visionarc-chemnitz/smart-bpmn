'use client'

import { motion } from "framer-motion"

const FloatingFigure = ({ 
  className, 
  size, 
  duration = 20,
  delay = 0,
  path
}: { 
  className: string
  size: number
  duration?: number
  delay?: number
  path?: string
}) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [0, -20, 0],
      x: [0, 20, 0],
      rotate: [0, 360],
    }}
    transition={{
      duration,
      repeat: Infinity,
      ease: "linear",
      delay,
    }}
    style={{
      width: size,
      height: size,
    }}
  >
    {path ? (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d={path} fill="currentColor" />
      </svg>
    ) : (
      <div className="w-full h-full rounded-full bg-current" />
    )}
  </motion.div>
)

export default function FloatingFigures() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large Circle - Top Left */}
      <FloatingFigure
        className="left-[5%] top-[10%] text-sky-500/20 dark:text-sky-500/30"
        size={window.innerWidth < 640 ? 80 : 100} // Adjusted size difference
        duration={28}
      />

      {/* Small Dot - Top Right */}
      <FloatingFigure
        className="right-[10%] top-[25%] text-emerald-500/25 dark:text-emerald-500/35"
        size={window.innerWidth < 640 ? 8 : 10} // Adjusted size difference
        duration={15}
      />

      {/* Triangle - Center Left */}
      <FloatingFigure
        className="left-[15%] top-[50%] text-blue-500/20 dark:text-blue-500/30"
        size={window.innerWidth < 640 ? 60 : 80} // Adjusted size difference
        duration={24}
        delay={2}
        path="M50 0 L100 100 L0 100 Z"
      />

      {/* Square - Center Right */}
      <FloatingFigure
        className="right-[80%] top-[85%] text-purple-500/20 dark:text-purple-500/30"
        size={window.innerWidth < 640 ? 50 : 60} // Adjusted size difference
        duration={22}
        delay={1}
        path="M0 0 H100 V100 H0 Z"
      />

      {/* Hexagon - Bottom Right */}
      <FloatingFigure
        className="right-[10%] bottom-[25%] text-indigo-500/20 dark:text-indigo-500/30"
        size={window.innerWidth < 640 ? 70 : 90} // Adjusted size difference
        duration={25}
        delay={2}
        path="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
      />

      {/* Small Circle - Center */}
      <FloatingFigure
        className="left-[30%] top-[30%] text-pink-500/25 dark:text-pink-500/35"
        size={window.innerWidth < 640 ? 15 : 18} // Adjusted size difference
        duration={18}
      />

      {/* Plus - Center Bottom */}
      <FloatingFigure
        className="left-[30%] bottom-[25%] text-red-500/20 dark:text-red-500/30"
        size={window.innerWidth < 640 ? 40 : 50} // Adjusted size difference
        duration={20}
        delay={1}
        path="M35 0 H65 V35 H100 V65 H65 V100 H35 V65 H0 V35 H35 Z"
      />

      {/* Star - Top Center */}
      <FloatingFigure
        className="left-[75%] top-[15%] text-orange-500/20 dark:text-orange-500/30"
        size={window.innerWidth < 640 ? 35 : 45} // Adjusted size difference
        duration={19}
        delay={1.5}
        path="M50 0 L61.8 35.4 L100 35.4 L69.1 57.6 L80.9 93 L50 71 L19.1 93 L30.9 57.6 L0 35.4 L38.2 35.4 Z"
      />

      {/* Pentagon - Bottom Center */}
      <FloatingFigure
        className="left-[55%] bottom-[15%] text-teal-500/20 dark:text-teal-500/30"
        size={window.innerWidth < 640 ? 40 : 50} // Adjusted size difference
        duration={21}
        delay={2.5}
        path="M50 0 L100 38.2 L81.8 100 L18.2 100 L0 38.2 Z"
      />
    </div>
  )
}