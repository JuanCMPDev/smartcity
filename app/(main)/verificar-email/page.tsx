'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from 'lucide-react'
import { useTheme } from 'next-themes'
import Footer from '@/components/Footer'
import { toast } from 'sonner'

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function VerificarEmail() {
  const [email, setEmail] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()
  const supabase = createClient()
  const { theme } = useTheme()

  useEffect(() => {
    const checkEmailVerification = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user.email_confirmed_at) {
          toast.success('Email verificado. Redirigiendo al dashboard...')
          router.push('/completar-perfil')
        } else if (session?.user.email) {
          setEmail(session.user.email)
        }
      } catch (error) {
        console.error('Error al verificar el email:', error)
        toast.error('Hubo un error al verificar tu email. Por favor, intenta de nuevo.')
      } finally {
        setIsChecking(false)
      }
    }

    checkEmailVerification()
  }, [supabase, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            className="text-center"
          >
            <Mail className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-lg font-semibold">Verificando tu email...</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80 pt-8">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          className="w-full max-w-md"
        >
          <Card className={`${theme === 'dark' ? 'border border-gray-700' : ''}`}>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-primary">Verifica tu correo electrónico</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6"
              >
                <Mail className="w-32 h-32 text-primary" />
              </motion.div>
              <p className="text-center mb-6 text-foreground">
                {email 
                  ? `Hemos enviado un enlace de verificación a ${email}. Por favor, verifica tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.`
                  : 'Por favor, verifica tu correo electrónico para activar tu cuenta.'}
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Si no encuentras el correo, revisa tu carpeta de spam o solicita un nuevo enlace de verificación.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  )
}

