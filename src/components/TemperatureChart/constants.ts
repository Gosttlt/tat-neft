export const RANGE_OPTIONS = [
  {label: '6 часов', hours: 6},
  {label: '12 часов', hours: 12},
  {label: '24 часа', hours: 24},
  {label: '3 дня', hours: 72},
  {label: '7 дней', hours: 168},
]
export type RangeOption = (typeof RANGE_OPTIONS)[number]
