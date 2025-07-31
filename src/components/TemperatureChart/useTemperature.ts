import {useQuery} from '@tanstack/react-query'

export function useTemperature(
  latitude: number,
  longitude: number,
  hours: number,
) {
  return useQuery({
    queryKey: ['temps', latitude, longitude, hours] as const,
    queryFn: async () => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_hours=${hours}&timezone=Europe/Moscow`
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Ошибка API: ${response.statusText}`)
      return response.json()
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}
