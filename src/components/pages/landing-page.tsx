'use client'

import { useState, useEffect } from 'react'

import Hero from '@/components/sections/Hero'
// import Team from '@/components/sections/Team'
// import Features from '@/components/sections/Features'
// import Solutions from '@/components/sections/Solutions'
// import Testimonials from '@/components/sections/Testimonials'
// import ProgressStepper from '@/components/sections/ProgressStepper'
import { Team_swiper } from '@/components/sections/Team_swiper'
import HeroNew from '../sections/HeroNew'
import CoreValues from '../sections/CoreValues'

export function LandingPageComponent() {
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
       {/*<HeroNew />*/}
      <Hero />
      <CoreValues />
      {/* <Solutions /> */}
      {/* <Features /> */}
      <Team_swiper />
      {/* <ProgressStepper />
      <Testimonials /> */}
    </>
  )
}