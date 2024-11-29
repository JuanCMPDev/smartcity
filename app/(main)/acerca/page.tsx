'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Shield, AlertTriangle } from 'lucide-react'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import { useInView } from 'react-intersection-observer'
import { ApexOptions } from 'apexcharts'

const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackground'), { ssr: false })
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  isFuture?: boolean;
}

const timelineEvents: TimelineEvent[] = [
  { year: 2020, title: "Fundación", description: "SmartCity nace con la visión de mejorar la seguridad urbana a través de la tecnología." },
  { year: 2021, title: "Lanzamiento de la Plataforma", description: "Implementación del sistema de reporte de incidentes en tiempo real." },
  { year: 2022, title: "Expansión de Servicios", description: "Integración de análisis de datos y mapeo de incidentes para una mejor prevención." },
  { year: 2023, title: "Reconocimiento Nacional", description: "Premio a la Innovación en Seguridad Urbana por nuestras soluciones tecnológicas." },
  { year: 2024, title: "Presente", description: "Implementación de IA en la predicción y prevención de incidentes urbanos." },
  { year: 2025, title: "Visión Futura", description: "Ciudades 100% seguras y conectadas en toda la región.", isFuture: true },
]

const progressData: { series: ApexAxisChartSeries, options: ApexOptions } = {
  series: [{
    name: 'Incidentes Reportados',
    data: [500, 1200, 2800, 5000, 8000, 12000]
  }],
  options: {
    chart: { type: 'bar', height: 350 },
    plotOptions: { bar: { borderRadius: 4, horizontal: true } },
    dataLabels: { enabled: false },
    xaxis: { categories: ['2020', '2021', '2022', '2023', '2024', '2025 (Proyección)'] },
    colors: ['#3B82F6'],
    theme: { mode: 'dark' }
  }
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ children, className = "" }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUpVariants}
      className={`mb-20 ${className}`}
    >
      {children}
    </motion.section>
  )
}

const AcercaPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-background/80 pt-8">
      <AnimatedBackground />
      <div className="relative z-10">
        <Section className="bg-primary/80 text-primary-foreground py-24 px-4 mt-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">Nuestra Historia</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90">Descubre cómo SmartCity está transformando la seguridad urbana, un reporte a la vez.</p>
          </div>
        </Section>

        <main className="container mx-auto px-4 py-16">
          <Section>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">Nuestra Trayectoria</h2>
            <div className="relative">
              {timelineEvents.map((event, index) => (
                <div 
                  key={event.year}
                  className={`flex flex-col md:flex-row items-center mb-12 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    <h3 className={`text-2xl md:text-3xl font-bold mb-2 ${event.isFuture ? 'text-primary' : 'text-foreground'}`}>{event.title}</h3>
                    <p className="text-foreground/90 text-lg">{event.description}</p>
                  </div>
                  <div className="mx-auto md:mx-0 my-4 md:my-0 w-20 h-20 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl z-10">
                    {event.year}
                  </div>
                  <div className="w-full md:w-5/12"></div>
                </div>
              ))}
              <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-primary -translate-x-1/2 hidden md:block"></div>
            </div>
          </Section>

          <Section>
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-primary">Nuestro Impacto</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-primary">Progreso de Implementación</h3>
                <Chart
                  options={progressData.options}
                  series={progressData.series}
                  type="bar"
                  height={350}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
                  <Calendar className="w-16 h-16 text-primary mb-4" />
                  <h4 className="text-2xl font-bold mb-2 text-foreground">4 Años</h4>
                  <p className="text-lg text-foreground/90">Mejorando la seguridad urbana</p>
                </div>
                <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
                  <Users className="w-16 h-16 text-primary mb-4" />
                  <h4 className="text-2xl font-bold mb-2 text-foreground">1M+</h4>
                  <p className="text-lg text-foreground/90">Usuarios activos</p>
                </div>
                <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
                  <Shield className="w-16 h-16 text-primary mb-4" />
                  <h4 className="text-2xl font-bold mb-2 text-foreground">25%</h4>
                  <p className="text-lg text-foreground/90">Reducción en tasas de criminalidad</p>
                </div>
                <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
                  <AlertTriangle className="w-16 h-16 text-primary mb-4" />
                  <h4 className="text-2xl font-bold mb-2 text-foreground">40%</h4>
                  <p className="text-lg text-foreground/90">Mejora en tiempos de respuesta</p>
                </div>
              </div>
            </div>
          </Section>

          <Section className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-primary">Nuestra Visión</h2>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-foreground/90">
              En SmartCity, aspiramos a crear un futuro donde cada ciudadano se sienta seguro y empoderado para contribuir 
              a la seguridad de su comunidad. Nuestra meta es hacer de las ciudades lugares más seguros y conectados, 
              mejorando la calidad de vida de millones de personas en todo el país.
            </p>
            <div className="bg-card text-card-foreground p-8 rounded-lg shadow-lg inline-block">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Próximo Hito: 2025</h3>
              <p className="text-lg md:text-xl text-foreground/90">
                Implementación completa de nuestro sistema de seguridad inteligente en 20 grandes ciudades, 
                sirviendo como modelo para una transformación en seguridad urbana a nivel nacional.
              </p>
            </div>
          </Section>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default AcercaPage

