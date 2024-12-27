"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from 'lucide-react'
import IncidentDetails from '@/components/dashboard/IncidentDetails'
import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('@/components/dashboard/HeatMap'), {
  ssr: false,
  loading: () => <p>Cargando mapa...</p>
})

interface Incident {
  id: number
  title: string
  description: string
  alarm_level: string
  incident_date: string
  incident_time: string
  latitude: number
  longitude: number
  address: string
  status?: string
}

export default function MyIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchIncidents = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .eq('user_id', user.id)
          .order('incident_date', { ascending: false })

        if (error) {
          console.error('Error fetching incidents:', error)
        } else {
          setIncidents(data || [])
        }
      }
    }

    fetchIncidents()
  }, [supabase])

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-500'
      case 'en proceso':
        return 'bg-blue-500'
      case 'resuelto':
        return 'bg-green-500'
      default:
        return 'bg-green-500' // Default color is now green
    }
  }

  const getStatusText = (status: string | undefined) => {
    return status || 'Reportado' // Default text is now "Reportado"
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mis Incidentes</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lista de Incidentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>{new Date(incident.incident_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={incident.alarm_level === 'alto' ? 'destructive' : incident.alarm_level === 'moderado' ? 'secondary' : 'default'}>
                        {incident.alarm_level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-white text-xs ${getStatusColor(incident.status)}`}>
                        {getStatusText(incident.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedIncident(incident)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mapa de Incidentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <DynamicMap />
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedIncident && (
        <IncidentDetails incident={selectedIncident} />
      )}
    </div>
  )
}

