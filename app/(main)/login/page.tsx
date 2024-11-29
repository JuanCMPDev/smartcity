'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/Icons"
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Footer from '@/components/Footer'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const AnimatedBackground = dynamic(() => import('@/components/AnimatedBackground'), { ssr: false })

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Inicio de sesión exitoso')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Error al iniciar sesión: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider })
      if (error) throw error
    } catch (error) {
      toast.error('Error al iniciar sesión con ' + provider + ': ' + (error as Error).message)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-background/80 pt-8">
      <AnimatedBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUpVariants}
          className="w-full max-w-md"
        >
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-8">
            <div className="flex flex-col space-y-1.5 text-center mb-6">
              <h2 className="text-3xl font-bold">Bienvenido a SmartCity</h2>
              <p className="text-sm text-muted-foreground">
                Inicia sesión para acceder a tu cuenta
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="tu@ejemplo.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={() => handleSocialLogin('google')}>
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" onClick={() => handleSocialLogin('github')}>
                <Icons.gitHub className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{' '}
              <Link href="/registro" className="font-medium text-primary hover:underline">
                Regístrate
              </Link>
            </p>
          </div>
        </motion.div>     
      </div>
      <Footer/>
    </div>
  )
}

