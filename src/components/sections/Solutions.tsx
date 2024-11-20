'use client'

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { CheckCircle } from "lucide-react"

const solutions = [
  { 
    title: "Data Analysis Automation", 
    description: "Save time and reduce errors with our AI-driven data processing." 
  },
  { 
    title: "Strategic Insights", 
    description: "Gain actionable insights for informed decision-making." 
  },
  { 
    title: "Scalable Solutions", 
    description: "Our platform grows and adapts with your business needs." 
  },
]

export default function Solutions() {
  return (
    <section id="solution" className="py-8 xs:py-12 md:py-16 lg:py-24 bg-gray-50">
      <div className="container">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00A3FF] to-[#0047FF] rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <Image
              alt="AI Solution Visualization"
              className="relative rounded-lg shadow-2xl"
              height="310"
              src="/placeholder.svg"
              width="550"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              How We Solve Your Problems
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              VisionArc&apos;s AI-powered platform tackles complex business challenges through:
            </p>
            <div className="grid gap-6">
              {solutions.map((item, index) => (
                <Card 
                  key={index} 
                  className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-2" />
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 