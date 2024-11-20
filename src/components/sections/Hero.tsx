'use client'

import BlurIn from "../ui/blur-in"
import Particles from "../ui/particles"
import { ChevronDown } from "lucide-react"
import { motion } from "framer-motion"
import FloatingFigures from "../ui/floating-figures"

export default function HeroSection() {
  const scrollToNextSection = () => {
    const nextSection = document.getElementById('about')
    nextSection?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative w-full h-screen bg-background overflow-hidden">
      {/* Background with blue tint */}
      <div className="absolute inset-0 bg-sky-50/50 dark:bg-transparent" />
      
      {/* Background Particles */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={200}
        staticity={30}
        ease={70} 
        color="#0ea5e9"
        size={1}
      />
      
      {/* Main Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Text Content - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center text-center gap-6 md:gap-8">
            <BlurIn
              word="Where Vision Meets Innovation"
              className="inline-block bg-clip-text text-transparent bg-gradient-to-br from-[#0ea5e9] via-[#0284c7] to-[#0369a1] text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight"
            />
            
            <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto text-muted-foreground font-light">
              VisionArc combines cutting-edge AI technology with intuitive SaaS solutions 
              to transform your business data into actionable insights.
            </p>

            {/* CTA Button */}
            {/* <button className="mt-4 px-8 py-3 bg-gradient-to-r from-[#0ea5e9] to-[#0369a1] text-white rounded-full 
              font-medium hover:shadow-lg hover:scale-105 transition-all duration-300">
              Get Started
            </button> */}
          </div>
        </div>
        <FloatingFigures />

        {/* Scroll Down Arrow */}
        <motion.div 
          className="mb-8 cursor-pointer"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={scrollToNextSection}
        >
          <ChevronDown className="w-8 h-8 text-muted-foreground hover:text-primary transition-colors" />
        </motion.div>
      </div>
    </section>
  )
} 