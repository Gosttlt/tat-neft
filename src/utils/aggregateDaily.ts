import {ApiResponse} from '../types'
import {format, parseISO} from 'date-fns'

export function aggregateDaily(data: ApiResponse) {
  const dailyMap: Record<string, {sum: number; count: number}> = {}

  data.hourly.time.forEach((timeStr, idx) => {
    const day = format(parseISO(timeStr), 'yyyy-MM-dd')
    if (!dailyMap[day]) dailyMap[day] = {sum: 0, count: 0}
    dailyMap[day].sum += data.hourly.temperature_2m[idx]
    dailyMap[day].count++
  })
  const labels = Object.keys(dailyMap)
  const temps = labels.map(day => dailyMap[day].sum / dailyMap[day].count)

  return {labels, temps}
}
