'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Eye, Heart, Lightbulb, Users, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import SparklesText from '../ui/sparkles-text'
import AnimatedShinyText from '../ui/animated-shiny-text'
import { cn } from "@/lib/utils"
import { MagicCard } from '../ui/magic-card'
import { ValueDialog } from '../ui/value-dialog'
import { WavyLine } from '../ui/wavy-line'

interface TabContentProps {
  title: string
  description: string
  icon: React.ReactNode
  image: string
}

const tabContents: TabContentProps[] = [
  {
    title: "Mission",
    description: "Breathing life into business workflows.",
    icon: <Compass className="w-5 h-5" />,
    image: "/assets/img/aboutus/mission.jpg"
  },
  {
    title: "Vision",
    description: "Our vision is to build the arc that connects people, processes, and technology, empowering businesses to focus on what truly matters by harnessing the power of intelligent solutions.",
    icon: <Eye className="w-5 h-5" />,
    image: "/assets/img/aboutus/vision.jpg"
  },
  {
    title: "Values",
    description: "Our values acronym is KITE. It conveys the idea of lifting ideas and people, like a kite rising with the wind..",
    icon: <Heart className="w-5 h-5" />,
    image: "/images/values.jpg"
  },
  {
    title: "Purpose",
    description: "Our purpose is to revolutionize business process management by infusing it with intelligence, simplicity, and efficiency. Through AI-driven insights and automation, we empower teams to create workflows that are intuitive, adaptable, and impactful, enabling streamlined decision-making and continuous innovation.",
    icon: <Lightbulb className="w-5 h-5" />,
    image: "/assets/img/aboutus/purpose.jpg"
  }
]

// Text reveal animation variants
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

// Update the ValueCardProps interface
interface ValueCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  longDescription: string;
  keyPoints: string[];
}

// Update the valueCards data with more detailed content
const valueCards: ValueCardProps[] = [
  {
    title: "Kindness",
    description: "Kindness is foundational at VisionArc, shaping positive interactions within our team and with clients. We believe in creating a supportive environment that’s friendly, understanding, and forgiving of mistakes. Kindness builds our reputation and invites others to engage openly. In difficult moments, we respond with compassion, helping foster a respectful, collaborative culture.",
    icon: <Heart className="w-6 h-6" />,
    longDescription: "Kindness is foundational at VisionArc, shaping positive interactions within our team and with clients. We believe in creating a supportive environment that’s friendly, understanding, and forgiving of mistakes. Kindness builds our reputation and invites others to engage openly. In difficult moments, we respond with compassion, helping foster a respectful, collaborative culture.",
    keyPoints: [
      "Transparent communication at all levels",
      "Ethical decision-making processes",
      "Accountability in all actions",
      "Honest business practices",
      "Trust-based relationships with stakeholders"
    ]
  },
  {
    title: "Innovation",
    description: "Innovation drives everything we do, encouraging us to see potential where others see obstacles. At VisionArc, we value bold ideas and creative problem-solving, constantly seeking new ways to improve. This culture of curiosity and experimentation allows us to craft solutions that make a real difference. Through innovation, we aim to shape the future.",
    icon: <Lightbulb className="w-6 h-6" />,
    longDescription: "Innovation drives everything we do, encouraging us to see potential where others see obstacles. At VisionArc, we value bold ideas and creative problem-solving, constantly seeking new ways to improve. This culture of curiosity and experimentation allows us to craft solutions that make a real difference. Through innovation, we aim to shape the future.",
    keyPoints: [
      "Continuous learning and improvement",
      "Embracing emerging technologies",
      "Supporting experimental initiatives",
      "Encouraging creative problem-solving",
      "Investment in research and development"
    ]
  },
  {
    title: "Trust",
    description: "Trust is the foundation of our work, built on transparency, integrity, and follow-through. We prioritize open communication, reliability, and accountability—internally and with our clients. By valuing trust, we create strong, lasting partnerships and a collaborative work environment where everyone feels supported and respected.",
    icon: <Users className="w-6 h-6" />,
    longDescription: "Trust is the foundation of our work, built on transparency, integrity, and follow-through. We prioritize open communication, reliability, and accountability—internally and with our clients. By valuing trust, we create strong, lasting partnerships and a collaborative work environment where everyone feels supported and respected.",
    keyPoints: [
      "Cross-functional team engagement",
      "Inclusive decision-making",
      "Knowledge sharing culture",
      "Open communication channels",
      "Diverse perspective appreciation"
    ]
  },
  {
    title: "Empowerment",
    description: "Empowerment is about enabling growth, confidence, and independence. At VisionArc, we give our team and clients the tools and support they need to excel. We celebrate each contribution and foster a culture of ownership, helping everyone reach their potential and achieve impactful results.",
    icon: <Star className="w-6 h-6" />,
    longDescription: "Empowerment is about enabling growth, confidence, and independence. At VisionArc, we give our team and clients the tools and support they need to excel. We celebrate each contribution and foster a culture of ownership, helping everyone reach their potential and achieve impactful results.",
    keyPoints: [
      "Rigorous quality standards",
      "Continuous performance improvement",
      "Best-in-class deliverables",
      "Professional development focus",
      "Industry-leading practices"
    ]
  }
];

export default function CoreValues() {
  const [activeTab, setActiveTab] = useState<number | null>(0)
  const [selectedValue, setSelectedValue] = useState<ValueCardProps | null>(null)

  const handleCardClick = (card: ValueCardProps) => {
    setSelectedValue(card)
  }

  return (
    <section id="about" className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col justify-between">
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div 
            variants={textVariants}
            className="mb-4"
          >
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out text-[#FF6A43] dark:text-[#FF6A43] hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
            <span>✨ Our Foundation</span>
          </AnimatedShinyText>
          </motion.div>
          
          <motion.div variants={textVariants}>
            <SparklesText
              text="Core Principles That Drive Us"
              className="text-4xl md:text-5xl font-bold mb-6"
              colors={{ first: "#4F46E5", second: "#9333EA" }}
              sparklesCount={15}
            />
          </motion.div>
          
          <motion.p 
            variants={textVariants}
            className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg"
          >
            Discover the fundamental values that shape our identity and guide our journey towards excellence.
          </motion.p>
        </motion.div>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap justify-center mb-16 gap-4 md:gap-8">
          {tabContents.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`group flex items-center gap-3 px-8 py-4 rounded-full transition-all duration-500 relative
                backdrop-blur-sm border
                ${activeTab === index 
                  ? 'bg-white/90 dark:bg-gray-800/90 border-primary-400/30 shadow-[0_8px_16px_-2px_rgba(0,163,255,0.3)] dark:shadow-[0_8px_16px_-2px_rgba(0,163,255,0.15)] scale-105 transform' 
                  : 'hover:bg-white/80 dark:hover:bg-gray-800/80 border-gray-200/30 dark:border-gray-700/30 hover:border-primary-400/20 hover:scale-102 hover:shadow-[0_4px_12px_-4px_rgba(0,163,255,0.2)] dark:hover:shadow-[0_4px_12px_-4px_rgba(0,163,255,0.1)]'}`}
            >
              <div className={`transition-all duration-500 text-xl
                ${activeTab === index 
                  ? 'text-primary-500 dark:text-primary-400 scale-110 transform' 
                  : 'text-gray-400 group-hover:text-primary-500 dark:group-hover:text-primary-400'}`}>
                {tab.icon}
              </div>
              <span className={`text-sm font-medium transition-all duration-500
                ${activeTab === index 
                  ? 'text-gray-900 dark:text-gray-100 tracking-wide' 
                  : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'}`}>
                {tab.title}
              </span>
              {activeTab === index && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 rounded-full -z-10"
                  transition={{ 
                    duration: 0.5,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow mt-8 pt-4"
          >
            {activeTab === 2 ? (
              <>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto relative isolate"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  
                  {valueCards.map((card, index) => (
                    <MagicCard
                      key={index}
                      onClick={() => handleCardClick(card)}
                      className="group cursor-pointer p-8 hover:scale-105 transition-all duration-300 relative z-[2]"
                      gradientColor="#0ea5e9"
                      gradientOpacity={0.15}
                    >
                      <div className="flex flex-col items-center text-center space-y-6">
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
                          animate={{ 
                            scale: 1, 
                            opacity: 1, 
                            rotateY: 0
                          }}
                          whileHover={{ 
                            scale: 1.15,
                            y: -12,
                            rotateY: 15,
                            rotateZ: 5,
                            boxShadow: "0 25px 35px -12px rgba(14, 165, 233, 0.4)"
                          }}
                          transition={{ 
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                            mass: 1
                          }}
                          className="p-6 rounded-3xl bg-gradient-to-br from-white via-gray-50 to-blue-50
                            dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/30
                            text-primary-500 dark:text-primary-400
                            shadow-[0_10px_20px_-8px_rgba(14,165,233,0.2)] 
                            dark:shadow-[0_10px_20px_-8px_rgba(14,165,233,0.15)]
                            group-hover:shadow-2xl group-hover:shadow-primary-500/20
                            dark:group-hover:shadow-primary-400/20
                            backdrop-blur-xl
                            border-2 border-gray-100/80 dark:border-gray-700/80
                            transition-all duration-700 ease-out
                            animate-pulse-subtle
                            hover:border-primary-200 dark:hover:border-primary-700"
                          style={{
                            transformStyle: "preserve-3d",
                            perspective: "1200px",
                            transformOrigin: "center center"
                          }}
                        >
                          {card.icon}
                        </motion.div>
                        
                        <div className="space-y-3">
                          <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {card.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {card.description}
                          </p>
                        </div>

                        <span className="text-blue-500 dark:text-blue-400 text-sm font-medium inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Dive deeper
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </MagicCard>
                  ))}
                </motion.div>

                <ValueDialog 
                  isOpen={!!selectedValue}
                  onClose={() => setSelectedValue(null)}
                  value={selectedValue}
                />
              </>
            ) : (
              // Original layout for other tabs
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <motion.div 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  <motion.h3 
                    variants={textVariants}
                    className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-primary-600 dark:from-gray-100 dark:to-primary-400"
                  >
                    {activeTab !== null ? tabContents[activeTab].title : ''}
                  </motion.h3>
                  <motion.p 
                    variants={textVariants}
                    className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                  >
                    {activeTab !== null ? tabContents[activeTab].description : ''}
                  </motion.p>
                </motion.div>
                
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl"
                >
                  <img 
                    src={activeTab !== null ? tabContents[activeTab].image : ''}
                    alt={activeTab !== null ? tabContents[activeTab].title : ''}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
} 