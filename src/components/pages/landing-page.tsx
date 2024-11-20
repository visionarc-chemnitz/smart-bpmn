'use client'

import Hero from '../sections/Hero'
import { Team_swiper } from '../sections/Team_swiper'
import CoreValues from '../sections/CoreValues'
import { useEffect, useState } from 'react'

export function LandingPageComponent() {
  return (
    <>
      <Hero />
      <CoreValues />
      <Team_swiper />
    </>
  )
}