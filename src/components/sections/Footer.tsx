'use client'

import Link from 'next/link'
import { RainbowButton } from '@/components/ui/rainbow-button'
import { motion } from 'framer-motion'

const navLinks = ["Team"]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function Footer() {
  return (
    <footer className="w-full px-4 py-12 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <motion.div 
        className="container mx-auto max-w-7xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <motion.div variants={itemVariants} className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">About VisionArc</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Revolutionizing businesses with AI-powered insights and SaaS solutions.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quick Links</h3>
            <nav className="flex flex-col space-y-3">
              {navLinks.map((item) => (
                <Link 
                  key={item} 
                  className="text-sm text-gray-300 hover:text-white transition-colors relative group" 
                  href={`#${item.toLowerCase()}`}
                >
                  <span className="relative z-10">{item}</span>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>
          </motion.div>
          
          <motion.div variants={itemVariants} className="backdrop-blur-lg bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">Send us a message</h3>
            <form 
              action="https://api.web3forms.com/submit"
              method="POST"
              className="flex flex-col space-y-4"
            >
              <input 
                type="hidden" 
                name="access_key" 
                value="f2854aa1-bf75-4ef7-8a7a-46922de4ab03"
              />
              <input
                type="email"
                name="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                required
                placeholder="Enter your email"
                className="bg-white/10 text-white border border-white/20 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              <textarea
                name="message"
                required
                placeholder="Enter your message"
                rows={3}
                className="bg-white/10 text-white border border-white/20 rounded-lg p-3 w-full resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
              />
              <RainbowButton type="submit" className="w-full">
                Send Message
              </RainbowButton>
            </form>
          </motion.div>
        </div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-3 text-center md:text-left">
              <p className="text-sm text-gray-300">
                © 2024 VisionArc. All rights reserved.
              </p>
              <p className="text-sm text-gray-400 max-w-2xl">
                Disclaimer: This website is not associated with an actual company but is part of the &quot;Planspiel&quot; web engineering project at the TU Chemnitz.
              </p>
            </div>
            {/* <div className="flex gap-6">
              <Link className="text-sm text-gray-300 hover:text-white transition-colors" href="#">
                Terms
              </Link>
              <Link className="text-sm text-gray-300 hover:text-white transition-colors" href="#">
                Privacy
              </Link>
            </div> */}
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}