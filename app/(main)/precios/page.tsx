'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import { useInView } from 'react-intersection-observer'

const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackground'), { ssr: false })

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  buttonText: string;
  recommended?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Plan Ciudadano",
    price: "Gratis",
    description: "Para ciudadanos comprometidos con la seguridad de su comunidad",
    features: [
      { name: "Reporte de incidentes básico", included: true },
      { name: "Visualización de mapa de incidentes", included: true },
      { name: "Notificaciones de alertas locales", included: true },
      { name: "Acceso a consejos de seguridad", included: true },
      { name: "Análisis avanzados", included: false },
      { name: "Integración con sistemas de emergencia", included: false },
    ],
    buttonText: "Registrarse Gratis",
  },
  {
    name: "Plan Empresarial",
    price: "Desde $99/mes",
    description: "Para empresas que desean mejorar la seguridad en sus áreas de operación",
    features: [
      { name: "Todas las características del plan ciudadano", included: true },
      { name: "Dashboard personalizado de seguridad", included: true },
      { name: "Reportes analíticos mensuales", included: true },
      { name: "Integración con sistemas de seguridad privada", included: true },
      { name: "Asesoría en seguridad urbana", included: true },
      { name: "API para integración de datos", included: true },
    ],
    buttonText: "Contactar Ventas",
  },
  {
    name: "Plan Gubernamental",
    price: "Personalizado",
    description: "Solución integral para gobiernos locales y nacionales",
    features: [
      { name: "Todas las características del plan empresarial", included: true },
      { name: "Sistema de gestión de incidentes a gran escala", included: true },
      { name: "Integración con servicios de emergencia", included: true },
      { name: "Análisis predictivo de criminalidad", included: true },
      { name: "Plataforma de colaboración interinstitucional", included: true },
      { name: "Soporte técnico dedicado 24/7", included: true },
    ],
    buttonText: "Solicitar Demo",
    recommended: true,
  },
]

const PricingCard: React.FC<{ plan: PricingPlan }> = ({ plan }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeInUpVariants}
      className={`bg-card text-card-foreground p-6 rounded-lg shadow-lg relative ${
        plan.recommended ? 'border-2 border-primary pt-10' : ''
      }`}
    >
      {plan.recommended && (
        <span className="bg-primary text-primary-foreground text-sm font-bold py-1 px-3 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Recomendado
        </span>
      )}
      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
      <p className="text-3xl font-bold mb-4">{plan.price}</p>
      <p className="text-sm mb-6">{plan.description}</p>
      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            {feature.included ? (
              <Check className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <X className="w-5 h-5 text-red-500 mr-2" />
            )}
            <span className={feature.included ? '' : 'text-muted-foreground'}>{feature.name}</span>
          </li>
        ))}
      </ul>
      <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors">
        {plan.buttonText}
      </button>
    </motion.div>
  )
}

const PreciosPage: React.FC = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-background/80 pt-8">
      <AnimatedBackground />
      <div className="relative z-10">
        <header className="bg-primary/80 text-primary-foreground py-24 px-4 mt-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Nuestros Planes</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Elige el plan perfecto para ti y sé parte de la revolución en seguridad urbana inteligente
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>

          <section className="mt-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">¿Por qué elegir SmartCity?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Seguridad Colaborativa</h3>
                <p>Nuestra plataforma fomenta la colaboración entre ciudadanos, empresas y gobierno para crear comunidades más seguras.</p>
              </div>
              <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Datos en Tiempo Real</h3>
                <p>Accede a información actualizada sobre incidentes y alertas de seguridad, permitiéndote tomar decisiones informadas.</p>
              </div>
              <div className="bg-card text-card-foreground p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Tecnología Avanzada</h3>
                <p>Utilizamos inteligencia artificial y análisis de datos para predecir y prevenir incidentes, mejorando la seguridad urbana.</p>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default PreciosPage

