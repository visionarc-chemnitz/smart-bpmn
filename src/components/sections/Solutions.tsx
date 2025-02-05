'use client'

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { CheckCircle } from "lucide-react"

const solutions = [
  { 
    title: "Chat-to-BPMN", 
    description: "Convert text into BPMN diagrams instantly" 
  },
  { 
    title: "Image-to-BPMN", 
    description: "Upload a process image and get a generated BPMN diagram" 
  },
  { 
    title: "Stakeholder Collaboration", 
    description: "Share diagrams, collect feedback, and refine processes" 
  },
  { 
    title: "Diff Checker", 
    description: "Compare two BPMN files to track changes and updates" 
  },
  { 
    title: "Organization and Member Management", 
    description: "Operates at an organization level, where people can be invited to work together on BPMN projects" 
  },
  { 
    title: "Arc42 document generation", 
    description: "Export of BPMN models as arc42 compliant documents for documenting software architecture" 
  }
]

export default function Solutions() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            How We Solve Your Problems
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            VisionArc&apos;s AI-powered platform tackles complex business challenges through:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((item, index) => (
              <Card 
                key={index} 
                className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
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
    </section>
  )
}