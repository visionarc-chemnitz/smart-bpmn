'use client'

import Marquee from "../ui/marquee"

const testimonials = [
  {
    quote: "VisionArc has transformed the way we analyze market trends. Their AI solutions are unparalleled.",
    author: "Alex Thompson",
    role: "CEO of MarketPro",
  },
  {
    quote: "The insights we've gained through VisionArc have been instrumental in our company's growth strategy.", 
    author: "Samantha Lee",
    role: "Director of Operations at TechGrowth",
  },
  {
    quote: "Working with VisionArc has given us a competitive edge in the market.",
    author: "Michael Chen",
    role: "CTO of InnovateTech",
  },
  {
    quote: "The AI-powered analytics have exceeded our expectations.",
    author: "Sarah Williams",
    role: "Head of Data Science at FutureScale",
  }
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-8 md:py-12 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8 sm:mb-12">
          What Our Clients Say
        </h2>
        <Marquee className="py-4 sm:py-8" pauseOnHover>
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 w-[280px] sm:w-[400px] mx-2 sm:mx-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 h-full transform transition-transform hover:scale-105">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="rounded-full bg-gradient-to-r from-[#00A3FF] to-[#0047FF] h-12 w-12 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {testimonial.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <blockquote className="text-lg italic leading-relaxed">
                  &quot;{testimonial.quote}&quot;
                </blockquote>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
} 