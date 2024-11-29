"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from "next-themes"

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme()

  const gradients = {
    light: [
      "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
      "linear-gradient(to bottom right, #10b981, #3b82f6)",
      "linear-gradient(to bottom right, #f59e0b, #ef4444)",
      "linear-gradient(to bottom right, #3b82f6, #8b5cf6)",
    ],
    dark: [
      "linear-gradient(to bottom right, #1e3a8a, #5b21b6)",
      "linear-gradient(to bottom right, #065f46, #1e3a8a)",
      "linear-gradient(to bottom right, #92400e, #991b1b)",
      "linear-gradient(to bottom right, #1e3a8a, #5b21b6)",
    ]
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: theme === 'dark' ? gradients.dark : gradients.light,
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
      />
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'}`}
          style={{
            width: Math.random() * 50 + 10,
            height: Math.random() * 50 + 10,
          }}
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
          }}
          transition={{
            duration: Math.random() * 20 + 30,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

export default AnimatedBackground

