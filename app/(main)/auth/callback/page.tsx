'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useTheme } from 'next-themes'
import Footer from '@/components/Footer'

export default function AuthCallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profileComplete, setProfileComplete] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { theme } = useTheme()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          setProfileComplete(!!profile)
        } else {
          throw new Error('No se pudo obtener la sesión del usuario')
        }
      } catch (err) {
        console.error('Error during auth callback:', err)
        setError('Hubo un error al verificar tu cuenta. Por favor, intenta nuevamente.')
      } finally {
        setLoading(false)
      }
    }

    handleCallback()
  }, [supabase, router])

  const handleContinue = () => {
    if (profileComplete) {
      router.push('/dashboard')
    } else {
      router.push('/complete-profile')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="ml-2 text-lg font-semibold">Verificando tu cuenta...</p>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <Card className={`w-full max-w-md shadow-lg ${theme === 'dark' ? 'border border-gray-700' : ''}`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-primary">
              {error ? 'Error de Verificación' : 'Cuenta Verificada'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {error ? (
              <>
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <p className="text-center text-red-500 mb-4">{error}</p>
                <Button onClick={() => router.push('/login')} className="w-full">
                  Volver al Inicio de Sesión
                </Button>
              </>
            ) : (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <p className="text-center mb-6 text-foreground">
                  ¡Gracias por verificar tu cuenta! Tu cuenta ha sido activada exitosamente.
                </p>
                <Button
                  onClick={handleContinue}
                  className="w-full"
                >
                  {profileComplete ? 'Ir al Dashboard' : 'Completar Perfil'}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  )
}
