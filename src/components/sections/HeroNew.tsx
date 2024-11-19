'use client'

import BlurIn from "@/components/ui/blur-in"
import FloatingFigures from "../ui/floating-figures"

export default function HeroSection() {

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background with stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.1,
        }} />
      </div>

      {/* Floating Figures */}
      <FloatingFigures />
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <BlurIn
            word="Design tools"
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4"
          />
          <BlurIn
            word="from the future."
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8"
          />
          
          <p className="text-gray-400 text-lg sm:text-xl mb-8">
            Unleash your creativity with VisionArc&apos;s AI-powered design tools.
          </p>

          <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full 
            font-medium hover:bg-white/20 transition-all duration-300 border border-white/20">
            Explore the future
          </button>
        </div>

      </div>
    </section>
  )
}