'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Github, Linkedin, ChevronLeft, ChevronRight } from "lucide-react"

const teamMembers = [
  { 
    name: "Eshwari Kangutkar", 
    role: "Developer", 
    image: "/assets/img/team/eshwari.png", 
    github: "https://github.com/EshwariK", 
    linkedin: "https://www.linkedin.com/in/eshwari-kangutkar" 
  },
  { 
    name: "Roshita Shakya", 
    role: "Developer", 
    image: "/assets/img/team/roshita.jpg", 
    github: "https://github.com/roshita02", 
    linkedin: "https://www.linkedin.com/in/roshitashk/" 
  },
  { 
    name: "Omkar Mirgal", 
    role: "Developer", 
    image: "/assets/img/team/omkar.jpeg", 
    github: "https://github.com/OmkarMirgal", 
    linkedin: "https://www.linkedin.com/in/omkar-mirgal-19a959227/" 
  },
  { 
    name: "Toushika Islam", 
    role: "Developer", 
    image: "/assets/img/team/toushika.jpeg", 
    github: "https://github.com/Toushika", 
    linkedin: "https://www.linkedin.com/in/toushika-islam-38a7323b/" 
  },
  { 
    name: "Shrushti Sakala", 
    role: "Developer", 
    image: "/assets/img/team/shrushti.jpeg", 
    github: "https://github.com/ShrushtiSakala/", 
    linkedin: "https://www.linkedin.com/in/shrushtisakala" 
  },
]

interface TeamProps {
  windowWidth: number
}

export default function Team({ windowWidth }: TeamProps) {
  const [currentTeamMember, setCurrentTeamMember] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentTeamMember((prev) => (prev + 1) % teamMembers.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="team" className="py-8 xs:py-12 md:py-16 lg:py-24 bg-background">
      <div className="container">
        <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 xs:mb-8 md:mb-12 text-foreground">
          Meet Our Team
        </h2>
        <div className="relative px-6 sm:px-12">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out" 
              style={{ 
                transform: mounted ? `translateX(-${currentTeamMember * (windowWidth >= 768 ? 50 : 100)}%)` : 'none'
              }}
            >
              {teamMembers.map((member, index) => (
                <div key={index} className="w-full md:w-1/2 flex-shrink-0 px-4">
                  <Card className="max-w-sm mx-auto overflow-hidden h-full bg-card hover:shadow-xl transition-all duration-300">
                    <div className="relative h-64">
                      <Image
                        alt={member.name}
                        src={member.image}
                        layout="fill"
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-foreground">{member.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{member.role}</p>
                      <div className="mt-4 flex justify-start space-x-4">
                        <Link 
                          href={member.github} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Github className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
                        </Link>
                        <Link 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:scale-110 transition-transform duration-200"
                        >
                          <Linkedin className="h-6 w-6 text-foreground hover:text-primary transition-colors" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <button
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-card hover:scale-110 transition-all duration-200"
            onClick={() => setCurrentTeamMember((prev) => 
              (prev - 1 + Math.ceil(teamMembers.length / (windowWidth >= 768 ? 2 : 1))) % 
              Math.ceil(teamMembers.length / (windowWidth >= 768 ? 2 : 1))
            )}
            aria-label="Previous team member"
          >
            <ChevronLeft className="h-6 w-6 text-foreground" />
          </button>
          <button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-card hover:scale-110 transition-all duration-200"
            onClick={() => setCurrentTeamMember((prev) => 
              (prev + 1) % Math.ceil(teamMembers.length / (windowWidth >= 768 ? 2 : 1))
            )}
            aria-label="Next team member"
          >
            <ChevronRight className="h-6 w-6 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  )
} 