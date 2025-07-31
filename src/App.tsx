import TemperatureChart from './components/TemperatureChart/TemperatureChart'
import './App.css'

const cities = [
  {cityName: 'Амстердам', latitude: 52.3676, longitude: 4.9041},
  {cityName: 'Нью-Йорк', latitude: 40.7128, longitude: -74.006},
  {cityName: 'Токио', latitude: 35.6762, longitude: 139.6503},
]

const App = () => {
  return (
    <div className='wrapper'>
      {cities.map(({cityName, latitude, longitude}) => (
        <div
          key={cityName}
          style={{
            flex: '1 1 300px',
            minWidth: '424px',
            maxWidth: '33%',
          }}
        >
          <TemperatureChart
            cityName={cityName}
            latitude={latitude}
            longitude={longitude}
          />
        </div>
      ))}
    </div>
  )
}

export default App
