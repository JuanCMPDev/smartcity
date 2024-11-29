import React from 'react'
import { useTheme } from 'next-themes'

const WaveTransition: React.FC = () => {
  const { theme } = useTheme()

  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden">
      <svg
        className="absolute bottom-0 left-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          fill={theme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(243,244,246)'}
          fillOpacity="1"
          d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,80C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  )
}

export default WaveTransition

