"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import Hero from '../../components/OnBoardingPage/Hero'
import WaveTransition from '../../components/OnBoardingPage/WaveTransition'
import InfoSection from '../../components/OnBoardingPage/InfoSection'
import CurvedTransition from '../../components/OnBoardingPage/CurvedTransition'
import ServicesSection from '../../components/OnBoardingPage/ServicesSection'
import Footer from '@/components/Footer'

const AnimatedBackground = dynamic(() => import('../../components/AnimatedBackground'), { ssr: false })

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        <Hero />
        <WaveTransition />
        <InfoSection />
        <CurvedTransition />
        <ServicesSection />
        <Footer/>
      </div>
    </div>
  )
}

