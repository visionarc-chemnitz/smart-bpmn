'use client'

import { SwiperSlide, Swiper } from 'swiper/react'
import Image from 'next/image'
import Link from 'next/link'
import { Github, Linkedin } from 'lucide-react'
import { Pagination, Autoplay, FreeMode, EffectCards } from 'swiper/modules'
import { motion, AnimatePresence } from 'framer-motion'
import SparklesText from '@/components/ui/sparkles-text'
import AnimatedShinyText from '../ui/animated-shiny-text'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import 'swiper/css/free-mode'
import 'swiper/css/effect-cards'

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

const teamMembers = [
    { name: "Eshwari", role: "CEO", image: "/assets/img/team/eshwari.png", github: "https://github.com/EshwariK", linkedin: "https://www.linkedin.com/in/eshwari-kangutkar" },
    { name: "Omkar", role: "CTO", image: "/assets/img/team/omkar.jpeg", github: "https://github.com/OmkarMirgal", linkedin: "https://www.linkedin.com/in/omkar-mirgal-19a959227/" },
    { name: "Roshita", role: "Product Manager", image: "/assets/img/team/roshita.jpg", github: "https://github.com/roshita02", linkedin: "https://www.linkedin.com/in/roshitashk/" },
    { name: "Shrushti", role: "QA Manager", image: "/assets/img/team/shrushti.jpeg", github: "https://github.com/ShrushtiSakala/", linkedin: "https://www.linkedin.com/in/shrushtisakala" },
    { name: "Toushika", role: "BD Manager", image: "/assets/img/team/toushika.jpeg", github: "https://github.com/Toushika", linkedin: "https://www.linkedin.com/in/toushika-islam-38a7323b/" },
]

export const Team_swiper = () => {
  return (
    <section id="team" className="py-20 md:py-32 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden px-10 md:px-20">
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
            <span>✨ Our Visionaries</span>
          </AnimatedShinyText>
          </motion.div>
          
          <motion.div variants={textVariants}>
            <SparklesText
              text="Meet Our Team"
              className="text-4xl md:text-5xl font-bold mb-6"
              colors={{ first: "#4F46E5", second: "#9333EA" }}
              sparklesCount={15}
            />
          </motion.div>
          
          <motion.p 
            variants={textVariants}
            className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg"
          >
            Talented innovators crafting intelligent solutions.
          </motion.p>
        </motion.div>

      <div className="px-4 py-10">
        <Swiper
          modules={[Autoplay, FreeMode, EffectCards]}
          spaceBetween={50}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          freeMode={{
            enabled: true,
            momentum: true,
            momentumRatio: 0.9,
            sticky: true,
          }}
          grabCursor={true}
          loop={true}
          className="pb-16"
        >
          {teamMembers.map((member, index) => (
            <SwiperSlide key={index}>
              <div className="backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-500 ease-out mb-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl transform rotate-6 opacity-25 blur-sm"></div>
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border-3 border-gray-100 dark:border-gray-700 shadow-inner">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                        sizes="(max-width: 768px) 192px, 192px"
                        priority
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium mb-6">
                    {member.role}
                  </p>
                  
                  <div className="flex gap-4 justify-center">
                    <Link 
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:shadow-lg transition-all duration-300 flex items-center justify-center w-10 h-10 hover:scale-110 hover:rotate-6"
                    >
                      <Github className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400" />
                    </Link>
                    <Link 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="p-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:shadow-lg transition-all duration-300 flex items-center justify-center w-10 h-10 hover:scale-110 hover:rotate-6"
                    >
                      <Linkedin className="h-5 w-5 text-gray-700 dark:text-gray-300 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
