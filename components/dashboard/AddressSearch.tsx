"use client"

import { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { useGoogleMapsLoader } from '@/hooks/useGoolgleMapsLoader'

interface AddressSearchProps {
  onAddressSelect: (lat: number, lng: number, address: string) => void
}

export default function AddressSearch({ onAddressSelect }: AddressSearchProps) {
  const [searchValue, setSearchValue] = useState('')
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { isLoaded, loadError } = useGoogleMapsLoader()

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return

    autoCompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "co" },
      fields: ["address_components", "geometry", "formatted_address"],
      types: ["address"]
    })

    autoCompleteRef.current.addListener("place_changed", async function () {
      const place = await autoCompleteRef.current?.getPlace()
      if (place?.geometry?.location) {
        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()
        const address = place.formatted_address || ''
        onAddressSelect(lat, lng, address)
      }
    })
  }, [isLoaded, onAddressSelect])

  if (loadError) {
    return <div>Error al cargar el buscador de direcciones</div>
  }

  if (!isLoaded) {
    return <div>Cargando buscador de direcciones...</div>
  }

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Buscar dirección"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  )
}

