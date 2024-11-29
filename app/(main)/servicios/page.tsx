'use client'

import React, { useEffect } from 'react'
import { AlertTriangle, Users, BarChart3, Shield, MapPin, Bell, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import { motion, useAnimation, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackground'), { ssr: false })

const services = [
  {
    title: "Reporte de Incidentes",
    description: "Sistema avanzado para reportar y rastrear incidentes de seguridad en tiempo real.",
    icon: <AlertTriangle className="w-12 h-12" />,
    image: "/assets/robbery.webp",
    benefits: ["Reportes rápidos y fáciles", "Seguimiento en tiempo real", "Categorización automática de incidentes"]
  },
  {
    title: "Participación Comunitaria",
    description: "Plataforma para conectar y colaborar con tu comunidad en temas de seguridad.",
    icon: <Users className="w-12 h-12" />,
    image: "/assets/communidad.avif",
    benefits: ["Foros de discusión", "Eventos de vigilancia vecinal", "Compartir alertas locales"]
  },
  {
    title: "Análisis de Datos",
    description: "Herramientas potentes para analizar patrones de seguridad y prevenir incidentes.",
    icon: <BarChart3 className="w-12 h-12" />,
    image: "/assets/data-analysis.jpg",
    benefits: ["Visualización de tendencias", "Predicción de zonas de riesgo", "Informes personalizados"]
  },
  {
    title: "Seguridad Inteligente",
    description: "Sistemas de vigilancia y respuesta rápida para una ciudad más segura.",
    icon: <Shield className="w-12 h-12" />,
    image: "/assets/seguridad-digital.jpg",
    benefits: ["Cámaras con IA", "Botones de pánico virtuales", "Coordinación con autoridades"]
  },
  {
    title: "Mapeo de Incidentes",
    description: "Visualización geográfica de incidentes para una mejor comprensión de la seguridad urbana.",
    icon: <MapPin className="w-12 h-12" />,
    image: "/assets/mapa.jpg",
    benefits: ["Mapas de calor interactivos", "Filtros por tipo de incidente", "Actualizaciones en tiempo real"]
  },
  {
    title: "Alertas de Seguridad",
    description: "Sistema de notificaciones para mantenerte informado sobre incidentes relevantes en tu área.",
    icon: <Bell className="w-12 h-12" />,
    image: "/assets/alerta.png",
    benefits: ["Alertas personalizadas", "Notificaciones push", "Consejos de seguridad"]
  }
]

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

const ServiceSection: React.FC<{ service: typeof services[0], index: number }> = ({ service, index }) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUpVariants}
      className={`mb-24 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex flex-col md:flex items-center`}
    >
      <div className="md:w-1/2 mb-8 md:mb-0">
        <Image
          src={service.image}
          alt={service.title}
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
      <div className="md:w-1/2 md:px-8">
        <div className="flex items-center mb-4 text-primary">
          {service.icon}
          <h2 className="text-3xl font-bold ml-4">{service.title}</h2>
        </div>
        <p className="text-foreground mb-6">{service.description}</p>
        <ul className="space-y-2">
          {service.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <ChevronRight className="w-5 h-5 text-primary mt-1 mr-2" />
              <span className="text-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
        <Link href={`/servicios/${service.title.toLowerCase().replace(/ /g, '-')}`} className="inline-block mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">
          Más información
        </Link>
      </div>
    </motion.section>
  )
}

export default function ServiciosPage() {
  return (
    <div className="relative min-h-screen overflow-hidden pt-8">
      <AnimatedBackground />
      <div className="relative z-10">
        <motion.header 
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          className="bg-primary/80 text-primary-foreground py-24 px-4 mt-16"
        >
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestros Servicios de Seguridad Urbana</h1>
            <p className="text-xl max-w-2xl mx-auto">Descubre cómo SmartCity está transformando la seguridad de nuestra ciudad con tecnología innovadora para mejorar la calidad de vida de todos los ciudadanos.</p>
          </div>
        </motion.header>

        <main className="container mx-auto px-4 py-16">
          {services.map((service, index) => (
            <ServiceSection key={service.title} service={service} index={index} />
          ))}
        </main>

        <motion.section 
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          className="bg-muted/80 py-16"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">¿Listo para una ciudad más segura?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Únete a nosotros en la construcción de una comunidad más segura e inteligente. Tu participación es clave para nuestro éxito.</p>
            <Link href="/contacto" className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors">
              Contáctanos
            </Link>
          </div>
        </motion.section>

        <Footer />
      </div>
    </div>
  )
}

