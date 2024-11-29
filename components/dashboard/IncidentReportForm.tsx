"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import HeatMap from './HeatMap'
import AddressSearch from './AddressSearch'

const commonCrimes = [
  "Hurto",
  "Robo",
  "Asalto",
  "Vandalismo",
  "Agresión",
  "Fraude",
  "Acoso",
  "Extorsión",
  "Tráfico de drogas",
  "Otro"
]

export default function IncidentReportForm() {
  const [crimeType, setCrimeType] = useState('')
  const [otherCrimeType, setOtherCrimeType] = useState('')
  const [description, setDescription] = useState('')
  const [alarmLevel, setAlarmLevel] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [address, setAddress] = useState('')
  const [incidentDate, setIncidentDate] = useState('')
  const [incidentTime, setIncidentTime] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat.toString())
    setLongitude(lng.toString())
  }

  const handleAddressSelect = (lat: number, lng: number, selectedAddress: string) => {
    setLatitude(lat.toString())
    setLongitude(lng.toString())
    setAddress(selectedAddress)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No se encontró usuario autenticado')

      const title = crimeType === 'Otro' ? otherCrimeType : crimeType

      const { error } = await supabase
        .from('incidents')
        .insert([
          { 
            user_id: user.id,
            title, 
            description, 
            alarm_level: alarmLevel,
            severity: alarmLevel === 'leve' ? 1 : alarmLevel === 'moderado' ? 2 : 3,
            latitude: parseFloat(latitude), 
            longitude: parseFloat(longitude),
            address,
            incident_date: incidentDate,
            incident_time: incidentTime
          }
        ])

      if (error) throw error

      toast.success('Incidente reportado con éxito')
      setCrimeType('')
      setOtherCrimeType('')
      setDescription('')
      setAlarmLevel('')
      setLatitude('')
      setLongitude('')
      setAddress('')
      setIncidentDate('')
      setIncidentTime('')
    } catch (error) {
      toast.error('Error al reportar el incidente: ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={crimeType} onValueChange={setCrimeType}>
        <SelectTrigger>
          <SelectValue placeholder="Tipo de delito" />
        </SelectTrigger>
        <SelectContent>
          {commonCrimes.map((crime) => (
            <SelectItem key={crime} value={crime}>{crime}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {crimeType === 'Otro' && (
        <Input
          placeholder="Especifique el tipo de delito"
          value={otherCrimeType}
          onChange={(e) => setOtherCrimeType(e.target.value)}
          required
        />
      )}
      <Textarea
        placeholder="Descripción del incidente"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <Select value={alarmLevel} onValueChange={setAlarmLevel}>
        <SelectTrigger>
          <SelectValue placeholder="Nivel de alarma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="leve">Leve (sospechas)</SelectItem>
          <SelectItem value="moderado">Moderado (crímenes no recurrentes)</SelectItem>
          <SelectItem value="alto">Alto (crímenes violentos)</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="date"
        placeholder="Fecha del incidente"
        value={incidentDate}
        onChange={(e) => setIncidentDate(e.target.value)}
        required
      />
      <Input
        type="time"
        placeholder="Hora del incidente"
        value={incidentTime}
        onChange={(e) => setIncidentTime(e.target.value)}
        required
      />
      <AddressSearch onAddressSelect={handleAddressSelect} />
      <div className="h-[400px] w-full">
        <HeatMap onLocationSelect={handleLocationSelect} />
      </div>
      <Input
        type="text"
        placeholder="Dirección"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <Input
        type="number"
        step="any"
        placeholder="Latitud"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        required
      />
      <Input
        type="number"
        step="any"
        placeholder="Longitud"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Reportando...' : 'Reportar Incidente'}
      </Button>
    </form>
  )
}

