import { useState } from 'react'
import Navbar from './components/Navbar'
import SolarCard from './components/SolarCard'
import SpeciesCard from './components/SpeciesCard'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  const [currentLocation, setCurrentLocation] = useState({
    name: 'Chennai, India',
    lat: 13.0827,
    lng: 80.2707,
  })

  const [solarAndWeather, setSolarAndWeather] = useState({
    weather: { temp: 34, condition: 'Clear Sky' },
    solarInfo: {
      sunrise: '5:56 AM',
      sunset: '6:03 PM',
      isNight: false,
      sunProgressPercent: 73,
    },
  })

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container" style={{ paddingTop: 110, paddingBottom: 64, minHeight: 'calc(100vh - 120px)' }}>
        {/* Responsive 2-column layout: Left (SolarCard), Right (SpeciesCard) */}
        <section className="dashboard-grid">
          <div className="dashboard-col-left">
            <SolarCard
              currentLocation={currentLocation}
              onLocationChange={setCurrentLocation}
              onDataSync={setSolarAndWeather}
            />
          </div>

          <div className="dashboard-col-right">
            <SpeciesCard
              location={currentLocation}
              weather={solarAndWeather.weather}
              solarInfo={solarAndWeather.solarInfo}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
