'use client'

import { useState, useEffect, useRef } from 'react'
import { MagicCard } from "../ui/magic-card"

const progressSteps = [
  { 
    title: "Milestone 1", 
    description: "Team Building, Requirements Handling",
    date: "31 Oct 2024"
  },
  { 
    title: "Milestone 2", 
    description: "Design Prototyping, Starting Development",
    date: "11 Nov 2024"
  },
  { 
    title: "Milestone 3", 
    description: "Data Collection, Automation Tool and Testing",
    date: "9 Dec 2024"
  },
  { 
    title: "Milestone 4", 
    description: "Deployment, Marketing Strategies and Integration Testing",
    date: "31 Jan 2025"
  },
]

export default function ProgressStepper() {
  const [visibleSteps, setVisibleSteps] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSteps((prev) => Math.min(prev + 1, 4))
          }
        })
      },
      { threshold: 0.5 }
    )

    if (progressRef.current) {
      observer.observe(progressRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="progress" className="w-full py-12 md:py-24 lg:py-32" ref={progressRef}>
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Our Journey
        </h2>
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-8 md:left-1/2 top-0 h-full w-0.5 bg-[#00A3FF] dark:bg-[#00A3FF]" />
          {progressSteps.map((step, index) => (
            <div
              key={index}
              className={`relative z-10 mb-12 ${
                index < visibleSteps ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500`}
            >
              <div className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="absolute left-8 md:left-1/2 w-8 h-8 transform -translate-x-4 md:-translate-x-4 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-[#00A3FF] dark:bg-[#00A3FF] border-4 border-background" />
                  <div 
                    className="absolute w-8 h-0.5 bg-[#00A3FF] dark:bg-[#00A3FF] transform -translate-y-1/2 top-1/2"
                    style={{ 
                      left: index % 2 === 0 ? '100%' : 'auto', 
                      right: index % 2 === 0 ? 'auto' : '100%' 
                    }}
                  />
                </div>
                <MagicCard 
                  className={`w-full md:w-[calc(50%-2rem)] ml-16 md:ml-0 ${
                    index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                  }`}
                >
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                    <p className='text-muted-foreground mt-4'>{step.date}</p>
                  </div>
                </MagicCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 