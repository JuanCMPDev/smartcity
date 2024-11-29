'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/Icons"
import Link from 'next/link'
import Footer from '@/components/Footer'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'
import { Eye, EyeOff } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'sonner'

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

export default function RegistroPage() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Evaluar la fortaleza de la contraseña
    let strength = 0
    if (password.length > 8) strength++
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++
    if (password.match(/\d/)) strength++
    if (password.match(/[^a-zA-Z\d]/)) strength++
    setPasswordStrength(strength)
  }, [password])

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones')
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      })

      if (error) throw error

      if (data.user && !data.user.identities?.length) {
        // El usuario ya existe pero no está confirmado
        toast.error('Este correo electrónico ya está registrado pero no confirmado. Por favor, verifica tu bandeja de entrada.')
      } else {
        // Registro exitoso
        toast.success('Registro exitoso. Por favor, verifica tu correo electrónico.')
        router.push('/verificar-email')
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`)
        setError(error.message)
      } else {
        toast.error('Ocurrió un error desconocido')
        setError('Ocurrió un error desconocido')
      }
    }
  }

  return (
    <>
      <div className="flex flex-col min-h-screen pt-8">
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUpVariants}
            className="w-full max-w-md"
          >
            <div className={`bg-card text-card-foreground rounded-lg shadow-lg p-8 ${theme === 'dark' ? 'border border-gray-700' : ''}`}>
              <div className="flex flex-col space-y-1.5 text-center mb-6">
                <h2 className="text-3xl font-bold text-primary">Crea tu cuenta en SmartCity</h2>
                <p className="text-sm text-muted-foreground">
                  Regístrate para acceder a todas las funciones
                </p>
              </div>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Tu nombre" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
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
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                    </button>
                  </div>
                  <div className="mt-1">
                    <div className="flex justify-between text-xs">
                      <span>Débil</span>
                      <span>Fuerte</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    required 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {password !== confirmPassword && confirmPassword !== '' && (
                    <p className="text-red-500 text-xs">Las contraseñas no coinciden</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Acepto los términos y condiciones
                  </label>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" className="w-full" disabled={!termsAccepted || password !== confirmPassword}>
                  Registrarse
                </Button>
              </form>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    O regístrate con
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
                  <Icons.google className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button variant="outline" onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}>
                  <Icons.gitHub className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
              <p className="mt-6 text-center text-sm text-muted-foreground">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </motion.div>     
        </div>
        <Footer />
      </div>
    </>
  )
}

