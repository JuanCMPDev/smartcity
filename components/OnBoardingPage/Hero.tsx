"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ThreeDModel from '@/components/3DModel'
import Link from 'next/link'
import { AlertTriangle, Shield } from 'lucide-react'

const Hero: React.FC = () => {

  return (
    <div className="relative flex flex-col gap-8 lg:flex-row items-center justify-center min-h-screen overflow-hidden p-4 lg:p-8 mt-14 lg:mt-0">
      <motion.div 
        className="w-full lg:w-1/2 z-10 mb-8 lg:mb-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-2xl mx-auto backdrop-blur-lg bg-background/80 shadow-xl border-primary/10">
          <CardContent className="p-8 lg:p-12">
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold mb-6 text-primary tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              SmartCity: Seguridad Urbana Inteligente
            </motion.h1>
            <motion.p 
              className="text-lg lg:text-xl mb-8 text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Empodera tu comunidad con nuestra plataforma de reporte de incidentes. Juntos, construyamos una ciudad más segura y conectada para todos.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button asChild size="lg" className="text-lg py-6 font-medium">
                <Link href="/registro">
                  <Shield className="mr-2 h-5 w-5" />
                  Reportar Incidente
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg py-6 font-medium">
                <Link href="/acerca">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Cómo Funciona
                </Link>
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div 
        className="w-full sm:h-48 lg:w-1/2 lg:h-full relative z-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <ThreeDModel 
          width="100%" 
          height="100%" 
          className="rounded-lg"
          modelProps={{ 
            position: [0, -2, 0],
            rotation: [0, Math.PI / 4, 0],
            scale: 0.7
          }}
        />
      </motion.div>
    </div>
  )
}

export default Hero

