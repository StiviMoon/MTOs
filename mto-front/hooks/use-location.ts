/**
 * Hook helper para obtener la ubicación actual
 */

import { useCurrentWeather } from "./use-weather"

export const useLocation = () => {
  const { data } = useCurrentWeather()

  return {
    location: data?.location,
    locationName: data?.location ? `${data.location.name}, ${data.location.country}` : "Yumbo, Colombia",
    isLoading: !data,
  }
}

