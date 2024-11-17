'use client'

import { Zap, Target, Users } from "lucide-react"
import { MagicCard } from "@/components/ui/magic-card"

const features = [
  { 
    icon: Zap, 
    title: "Real-time Analytics", 
    description: "Get instant insights from your data with our advanced AI algorithms." 
  },
  { 
    icon: Target, 
    title: "Predictive Modeling", 
    description: "Forecast trends and make data-driven decisions with our predictive AI models." 
  },
  { 
    icon: Users, 
    title: "Collaborative Platform", 
    description: "Seamlessly collaborate with your team on AI-powered projects and insights." 
  },
]

export default function Features() {
  return (
    <>
      <section id="features" className="px-3 xs:px-4 py-8 xs:py-12 md:py-16 lg:py-24 bg-white dark:bg-gray-900">
        <div className="container">
          <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-center mb-8 xs:mb-12 text-gray-900 dark:text-white">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-6">
            {features.map((feature, index) => (
              <MagicCard key={index} className="relative overflow-hidden group bg-white dark:bg-gray-800">
                <div className="p-6">
                  <feature.icon className="h-8 w-8 mb-2 text-[#00A3FF] dark:text-[#00A3FF]" />
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </MagicCard>
            ))}
          </div>
        </div>
      </section>
    </>
  )
} 