import { useTheme } from 'next-themes'
import React from 'react'

const CurvedTransition: React.FC = () => {
  const { theme } = useTheme()


  return (
    <div className="relative h-32 overflow-hidden">
      <div
        className="absolute inset-0"
      >
        <svg
          viewBox="0 0 1440 320"
          className="absolute top-0 w-full h-full"
          preserveAspectRatio="none"
        >
          <path
            fill={theme === 'dark' ? 'rgb(17, 24, 39)' : 'rgb(243,244,246)'}
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,213.3C1248,235,1344,213,1392,202.7L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          ></path>
        </svg>
      </div>
    </div>
  )
}

export default CurvedTransition

