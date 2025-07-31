import React, {useMemo} from 'react'
import {useQueryClient} from '@tanstack/react-query'
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
import {ru} from 'date-fns/locale'
import {Props} from '../../types'
import {aggregateDaily} from '../../utils/aggregateDaily'
import RangeSelector from './RangeSelector'
import Loader from '../../shared/Loader/Loader'
import styles from './TemperatureChart.module.css'
import ErrorNotification from '../../shared/ErrorNotification/ErrorNotification'
import {RANGE_OPTIONS, RangeOption} from './constants'
import {useTemperature} from './useTemperature'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
)

const TemperatureChart: React.FC<Props> = ({latitude, longitude, cityName}) => {
  const [range, setRange] = React.useState<RangeOption>(RANGE_OPTIONS[2])
  const queryClient = useQueryClient()

  const query = useTemperature(latitude, longitude, range.hours)

  const isAggregate = range.hours > 24

  const data = query.data

  let labels: string[] = []
  let temps: number[] = []

  if (data && data.hourly) {
    if (isAggregate) {
      const aggregated = aggregateDaily(data)
      labels = aggregated.labels
      temps = aggregated.temps
    } else {
      labels = data.hourly.time
      temps = data.hourly.temperature_2m
    }
  }

  const chartData = useMemo(
    () => ({
      labels: labels.map(t => new Date(t)),
      datasets: [
        {
          label: 'Температура (°C)',
          data: temps,
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0,
          pointRadius: 3,
          pointHoverRadius: 6,
        },
      ],
    }),
    [labels, temps],
  )

  const options = useMemo(
    () => ({
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
    }),
    [isAggregate],
  )

  return (
    <div>
      <h3>{cityName}</h3>
      <RangeSelector
        options={RANGE_OPTIONS}
        selected={range}
        onSelect={setRange}
      />
      <div className={styles.chartContainer}>
        {query.isLoading ? (
          <Loader />
        ) : query.isError ? (
          <ErrorNotification
            message={(query.error as Error).message}
            onClose={() =>
              queryClient.removeQueries({
                queryKey: ['temps', latitude, longitude, range.hours] as const,
              })
            }
          />
        ) : labels.length && temps.length ? (
          <Line key={range.hours} data={chartData} options={options} />
        ) : (
          <div>Нет данных для отображения</div>
        )}
      </div>
    </div>
  )
}

export default TemperatureChart
