import Hero from '../sections/Hero'
import { Team_swiper } from '../sections/Team_swiper'
import CoreValues from '../sections/CoreValues'
import Solutions from '../sections/Solutions'
import ProgressStepper from '../sections/ProgressStepper'

export function LandingPageComponent() {
  return (
    <>
      <Hero />
      <CoreValues />
      <Solutions />
      <ProgressStepper />
      <Team_swiper />
    </>
  )
}