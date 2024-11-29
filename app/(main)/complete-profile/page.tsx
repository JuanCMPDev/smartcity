'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { User, Phone, MapPin, Briefcase, GraduationCap, Calendar, FileText } from 'lucide-react'

export default function CompletarPerfil() {
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [city, setCity] = useState('')
  const [occupation, setOccupation] = useState('')
  const [education, setEducation] = useState<string>('')
  const [birthdate, setBirthdate] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profile) {
          setFullName(profile.full_name || '')
          setPhoneNumber(profile.phone_number || '')
          setCity(profile.city || '')
          setOccupation(profile.occupation || '')
          setEducation(profile.education || '')
          setBirthdate(profile.birthdate || '')
          setBio(profile.bio || '')
        }
      }
    }

    checkUserStatus()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No se encontró usuario autenticado')

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          phone_number: phoneNumber,
          city: city,
          occupation: occupation,
          education: education,
          birthdate: birthdate,
          bio: bio,
          updated_at: new Date(),
        })

      if (error) throw error

      toast.success('Perfil completado exitosamente')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Error al completar el perfil: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-8 flex flex-col bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-8 bg-primary bg-clip-text text-transparent">
            Completa tu Perfil
          </h1>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-lg font-medium flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Nombre Completo
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="text-lg"
                  placeholder="Ingresa tu nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-lg font-medium flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Número de Teléfono
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="text-lg"
                  placeholder="Ingresa tu número de teléfono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-lg font-medium flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Ciudad
                </Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Selecciona tu ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bogota">Bogotá</SelectItem>
                    <SelectItem value="medellin">Medellín</SelectItem>
                    <SelectItem value="cali">Cali</SelectItem>
                    <SelectItem value="barranquilla">Barranquilla</SelectItem>
                    <SelectItem value="cartagena">Cartagena</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation" className="text-lg font-medium flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Ocupación
                </Label>
                <Input
                  id="occupation"
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="text-lg"
                  placeholder="Ingresa tu ocupación actual"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education" className="text-lg font-medium flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Educación
                </Label>
                <Select value={education} onValueChange={setEducation}>
                  <SelectTrigger className="text-lg">
                    <SelectValue placeholder="Selecciona tu nivel educativo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primaria">Primaria</SelectItem>
                    <SelectItem value="secundaria">Secundaria</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="tecnologo">Tecnólogo</SelectItem>
                    <SelectItem value="pregrado">Pregrado Universitario</SelectItem>
                    <SelectItem value="especializacion">Especialización</SelectItem>
                    <SelectItem value="maestria">Maestría</SelectItem>
                    <SelectItem value="doctorado">Doctorado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthdate" className="text-lg font-medium flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Fecha de Nacimiento
                </Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-lg font-medium flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Biografía
              </Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="text-lg"
                placeholder="Cuéntanos un poco sobre ti"
                rows={4}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full text-lg h-12" 
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Perfil'}
            </Button>
          </form>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}

