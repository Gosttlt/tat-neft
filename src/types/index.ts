export type Props = {
  latitude: number
  longitude: number
  cityName: string
}

export type ApiResponse = {
  hourly: {
    time: string[]
    temperature_2m: number[]
  }
}

export type RangeOption = {
  label: string
  hours: number
}
