import { motion } from 'framer-motion'

const pathVariants = {
  hidden: {
    pathLength: 0,
    opacity: 0
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 2.5,
      ease: "easeInOut"
    }
  }
}

export function WavyLine() {
  return (
    <div className="absolute top-[45%] -left-24 w-[calc(100%+12rem)] -z-[1] hidden lg:block pointer-events-none">
      <svg
        className="w-full h-48"
        viewBox="0 0 1200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Random flowing path with upward projection */}
        <motion.path
          d="M0 100 
             C100 50, 150 150, 250 100
             S400 20, 500 80
             S650 150, 750 90
             S900 40, 950 100
             C1000 140, 1050 60, 1100 100
             C1120 120, 1130 80, 1150 100
             C1170 80, 1160 60, 1150 40
             C1140 20, 1130 10, 1150 20"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="8 8"
          className="text-primary-500/40 dark:text-primary-400/40"
          variants={pathVariants}
          initial="hidden"
          animate="visible"
        />
        
        {/* Cartoonish Kite at the end */}
        <g transform="translate(1150, 20)" className="text-primary-500/40 dark:text-primary-400/40">
          {/* Kite body */}
          <path
            d="M-10 0
               L15 -30
               A5 5 0 0 1 25 -30
               L50 0
               A5 5 0 0 1 50 10
               L25 40
               A5 5 0 0 1 15 40
               L-10 10
               A5 5 0 0 1 -10 0Z"
            fill="currentColor"
            className="text-primary-400/30 dark:text-primary-500/30"
          />
          
          {/* Kite cross lines */}
          <path
            d="M20 -25L20 35M-5 5L45 5"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary-500/40 dark:text-primary-400/40"
          />
          
          {/* Kite tail */}
          <path
            d="M20 40
               Q30 50 25 60
               Q20 70 30 80
               Q40 90 35 100"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="4 4"
            className="text-primary-500/40 dark:text-primary-400/40"
          />
          
          {/* Kite strings */}
          <path
            d="M-5 5L-15 -5M45 5L55 -5"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        </g>
      </svg>
    </div>
  )
} 