import { useState, useEffect } from 'react'
import { useJsApiLoader } from '@react-google-maps/api'
import { GOOGLE_MAPS_OPTIONS } from '@/lib/googleMapsConfig'

export function useGoogleMapsLoader() {
  const [isLoaderInitialized, setIsLoaderInitialized] = useState(false)
  const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_OPTIONS)

  useEffect(() => {
    if (isLoaded && !isLoaderInitialized) {
      setIsLoaderInitialized(true)
    }
  }, [isLoaded, isLoaderInitialized])

  return { isLoaded: isLoaded && isLoaderInitialized, loadError }
}

