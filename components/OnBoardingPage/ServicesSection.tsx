'use client'

import React, { useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import { AlertTriangle, Users, BarChart3, Shield, MapPin, Bell } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

interface Service {
  title: string
  description: string
  icon: React.ReactNode
}

const services: Service[] = [
  {
    title: "Reporte de Incidentes",
    description: "Reporta incidentes de seguridad en tiempo real para una respuesta rápida",
    icon: <AlertTriangle className="w-12 h-12" />
  },
  {
    title: "Participación Comunitaria",
    description: "Colabora con tus vecinos para crear una comunidad más segura",
    icon: <Users className="w-12 h-12" />
  },
  {
    title: "Análisis de Datos",
    description: "Visualiza estadísticas y patrones de seguridad en tu área",
    icon: <BarChart3 className="w-12 h-12" />
  },
  {
    title: "Seguridad Inteligente",
    description: "Sistemas de vigilancia y respuesta rápida para tu tranquilidad",
    icon: <Shield className="w-12 h-12" />
  },
  {
    title: "Mapeo de Incidentes",
    description: "Visualiza la distribución geográfica de incidentes en tu ciudad",
    icon: <MapPin className="w-12 h-12" />
  },
  {
    title: "Alertas de Seguridad",
    description: "Recibe notificaciones sobre incidentes relevantes en tu área",
    icon: <Bell className="w-12 h-12" />
  }
]

const ServicesSection: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()])

  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 120, friction: 8 },
  })

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
    }
  }, [emblaApi])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <animated.div style={fadeIn} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">Nuestros Servicios</h2>
          <p className="text-lg text-muted-foreground">Descubre cómo SmartCity está mejorando la seguridad urbana con tecnología innovadora</p>
        </animated.div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {[...services, ...services, ...services].map((service, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4">
                <Card className="h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                    <animated.div style={fadeIn} className="text-primary mb-4">
                      {service.icon}
                    </animated.div>
                    <h3 className="text-xl font-semibold mb-2 text-primary">{service.title}</h3>
                    <p className="text-center text-card-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection

