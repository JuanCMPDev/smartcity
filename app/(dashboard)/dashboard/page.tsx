"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { MapPin, Briefcase, GraduationCap, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface Profile {
  full_name: string
  city: string
  occupation: string
  education: string
  avatar_url: string
}

const incidentData = [
  { month: 'Ene', incidentes: 65 },
  { month: 'Feb', incidentes: 59 },
  { month: 'Mar', incidentes: 80 },
  { month: 'Abr', incidentes: 81 },
  { month: 'May', incidentes: 56 },
  { month: 'Jun', incidentes: 55 },
  { month: 'Jul', incidentes: 40 },
]

const statusData = [
  { name: 'Resueltos', value: 400 },
  { name: 'En Progreso', value: 300 },
  { name: 'Pendientes', value: 200 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
        } else {
          setProfile(data)
        }
      }
    }

    fetchProfile()
  }, [supabase])

  if (!profile) {
    return <div>Cargando perfil...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              <AvatarFallback>{profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{profile.full_name}</h2>
              <p className="text-muted-foreground flex items-center">
                <MapPin className="mr-1 h-4 w-4" /> {profile.city}
              </p>
              <p className="text-muted-foreground flex items-center">
                <Briefcase className="mr-1 h-4 w-4" /> {profile.occupation}
              </p>
              <p className="text-muted-foreground flex items-center">
                <GraduationCap className="mr-1 h-4 w-4" /> {profile.education}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Incidentes</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500" />
              <p className="mt-2 text-2xl font-bold">152</p>
              <p className="text-sm text-muted-foreground">Reportados</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto text-green-500" />
              <p className="mt-2 text-2xl font-bold">98</p>
              <p className="text-sm text-muted-foreground">Resueltos</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto text-blue-500" />
              <p className="mt-2 text-2xl font-bold">54</p>
              <p className="text-sm text-muted-foreground">En Progreso</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incidentes Reportados por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incidentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="incidentes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de Incidentes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

