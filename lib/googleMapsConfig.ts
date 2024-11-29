export const GOOGLE_MAPS_LIBRARIES: ("places" | "visualization")[] = ["places", "visualization"];

export const GOOGLE_MAPS_OPTIONS = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  libraries: GOOGLE_MAPS_LIBRARIES,
  id: 'google-map-script',
};

