"use client"

import { useState, useEffect, useCallback } from 'react'
import { GoogleMap, HeatmapLayer, Marker } from '@react-google-maps/api'
import { createClient } from '@/lib/supabase/client'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useGoogleMapsLoader } from '@/hooks/useGoolgleMapsLoader'

const containerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 4.6097,
  lng: -74.0817
}

interface Incident {
  latitude: number
  longitude: number
  alarm_level: string
}

interface HeatMapProps {
  onLocationSelect?: (lat: number, lng: number) => void
}

export default function HeatMap({ onLocationSelect }: HeatMapProps) {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [error, setError] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const supabase = createClient()

  const { isLoaded, loadError } = useGoogleMapsLoader()

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat()
      const lng = e.latLng.lng()
      setSelectedLocation({ lat, lng })
      if (onLocationSelect) {
        onLocationSelect(lat, lng)
      }
    }
  }, [onLocationSelect])

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('latitude, longitude, alarm_level')
        
        if (error) throw error

        setIncidents(data || [])
      } catch (error) {
        console.error('Error fetching incidents:', error)
        setError('Error al cargar los incidentes. Por favor, intenta de nuevo más tarde.')
      }
    }

    if (isLoaded) {
      fetchIncidents()
    }
  }, [supabase, isLoaded])

  if (loadError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error al cargar el mapa</AlertTitle>
        <AlertDescription>No se pudo cargar el mapa de Google. Por favor, verifica tu conexión e intenta de nuevo.</AlertDescription>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!isLoaded) return <div>Cargando mapa...</div>

  const heatmapData = incidents.map(incident => ({
    location: new google.maps.LatLng(incident.latitude, incident.longitude),
    weight: incident.alarm_level === 'alto' ? 3 : incident.alarm_level === 'moderado' ? 2 : 1
  }))

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onClick={onMapClick}
    >
      <HeatmapLayer
        data={heatmapData}
        options={{
          radius: 20,
          opacity: 0.6
        }}
      />
      {selectedLocation && (
        <Marker position={selectedLocation} />
      )}
    </GoogleMap>
  )
}

