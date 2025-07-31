import React from 'react'
import {useQuery, useQueryClient} from '@tanstack/react-query'
import {Line} from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import {addHours, formatISO, subHours} from 'date-fns'
import {ru} from 'date-fns/locale'
import {Props} from '../../types'
import {aggregateDaily} from '../../utils/aggregateDaily'
import RangeSelector from './RangeSelector'
import Loader from '../../shared/Loader/Loader'
import styles from './TemperatureChart.module.css'
import ErrorNotification from '../../shared/ErrorNotification/ErrorNotification'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
)

// Сделаем константный тип для options, чтобы TypeScript знал точные типы
const RANGE_OPTIONS = [
  {label: '6 часов', hours: 6},
  {label: '12 часов', hours: 12},
  {label: '24 часа', hours: 24},
  {label: '3 дня', hours: 72},
  {label: '7 дней', hours: 168},
]

type RangeOption = (typeof RANGE_OPTIONS)[number]

const TemperatureChart: React.FC<Props> = ({latitude, longitude, cityName}) => {
  const [range, setRange] = React.useState<RangeOption>(RANGE_OPTIONS[2])
  const queryClient = useQueryClient()

  // fetch функция получает ключ, деструктурируем hours
  const fetchTemperature = async ({
    queryKey,
  }: {
    queryKey: readonly [string, number, number, number]
  }) => {
    const [, latitude, longitude, hours] = queryKey

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&forecast_hours=${hours}&timezone=Europe/Moscow`
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Ошибка API: ${response.statusText}`)
    return await response.json()
  }

  const query = useQuery({
    queryKey: ['temps', latitude, longitude, range.hours] as const,
    queryFn: fetchTemperature,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const isAggregate = range.hours > 24

  if (query.isLoading) return <Loader />

  if (query.isError)
    return (
      <ErrorNotification
        message={(query.error as Error).message}
        onClose={() =>
          queryClient.removeQueries({queryKey: ['temps', range.hours]})
        }
      />
    )

  const data = query.data!
  const {labels, temps} = isAggregate
    ? aggregateDaily(data)
    : {
        labels: data.hourly.time,
        temps: data.hourly.temperature_2m,
      }

  const chartData = {
    labels: labels.map(t => new Date(t)),
    datasets: [
      {
        label: 'Температура (°C)1',
        data: temps,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: isAggregate ? ('day' as const) : ('hour' as const),
          tooltipFormat: isAggregate ? 'dd MMM yyyy' : 'dd MMM yyyy, HH:mm',
          displayFormats: {
            hour: 'HH:mm',
            day: 'dd MMM',
          },
        },
        adapters: {
          date: {
            locale: ru,
          },
        },
        title: {
          display: true,
          text: 'Время',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Температура (°C)',
        },
      },
    },
    plugins: {
      legend: {display: false, position: 'top' as const},
      tooltip: {mode: 'index' as const, intersect: false},
    },
  }

  return (
    <div>
      <h3>{cityName}</h3>
      <RangeSelector
        options={RANGE_OPTIONS}
        selected={range}
        onSelect={setRange}
      />
      <div className={styles.chartContainer}>
        <Line key={range.hours} data={chartData} options={options} />
      </div>
    </div>
  )
}

export default TemperatureChart
