'use client'

import React, { useState } from 'react'
import { AlertTriangle, Users, BarChart3 } from 'lucide-react'
import { useTheme } from 'next-themes'

interface CardInfo {
  title: string
  description: string
  icon: React.ReactNode
}

const InfoSection: React.FC = () => {
  const [flippedCard, setFlippedCard] = useState<number | null>(null)

  const {theme} = useTheme();

  const cardInfo: CardInfo[] = [
    {
      title: "Reporte de Incidentes",
      description: "Permite a los ciudadanos reportar incidentes de seguridad en tiempo real, ayudando a las autoridades a responder rápidamente y mejorar la seguridad urbana.",
      icon: <AlertTriangle className="w-12 h-12" />
    },
    {
      title: "Participación Comunitaria",
      description: "Fomenta la colaboración entre vecinos y autoridades, creando una red de vigilancia comunitaria que fortalece el tejido social y la seguridad local.",
      icon: <Users className="w-12 h-12" />
    },
    {
      title: "Análisis de Datos",
      description: "Utiliza tecnología avanzada para analizar patrones de incidentes, permitiendo a las autoridades implementar estrategias de prevención más efectivas.",
      icon: <BarChart3 className="w-12 h-12" />
    }
  ]

  const handleCardClick = (index: number) => {
    setFlippedCard(flippedCard === index ? null : index)
  }

  return (
    <section className={`relative overflow-hidden py-16 -mt-24 md:-mt-32 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary">
            Características de SmartCity
          </h2>
          <p className="text-lg mb-12 text-muted-foreground">
            SmartCity es una plataforma innovadora diseñada para mejorar la seguridad urbana
            a través de la participación ciudadana y el uso inteligente de datos. Nuestro objetivo
            es crear comunidades más seguras y conectadas para todos.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {cardInfo.map((card, index) => (
              <div
                key={index}
                className="h-64 w-full [perspective:1000px]"
                onClick={() => handleCardClick(index)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] cursor-pointer ${
                    flippedCard === index ? '[transform:rotateY(180deg)]' : ''
                  }`}
                >
                  {/* Front of the card */}
                  <div 
                    className="absolute w-full h-full [backface-visibility:hidden] rounded-xl shadow-lg flex flex-col items-center justify-center p-6 bg-card"
                  >
                    <div className="text-primary mb-4">{card.icon}</div>
                    <h3 className="text-2xl font-semibold text-primary">{card.title}</h3>
                  </div>
                  
                  {/* Back of the card */}
                  <div 
                    className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl shadow-lg flex items-center justify-center p-6 bg-card"
                  >
                    <p className="text-card-foreground text-center">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default InfoSection

