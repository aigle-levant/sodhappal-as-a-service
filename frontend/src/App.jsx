import { useState } from 'react'
import Navbar from './components/Navbar'
import SolarCard from './components/SolarCard'
import SpeciesCard from './components/SpeciesCard'
import ArtworkCard from './components/ArtworkCard'
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

  const [topSpecies, setTopSpecies] = useState([])

  return (
    <div className="app-shell">
      <Navbar />

      <main className="container" style={{ paddingTop: 110, paddingBottom: 64, minHeight: 'calc(100vh - 120px)' }}>
        {/* Responsive 2-column layout: Left (SolarCard), Right (SpeciesCard + ArtworkCard) */}
        <section className="dashboard-grid">
          {/* Left Column: Solar & Weather Card */}
          <div className="dashboard-col-left">
            <SolarCard
              currentLocation={currentLocation}
              onLocationChange={setCurrentLocation}
              onDataSync={setSolarAndWeather}
            />
          </div>

          {/* Right Column: SpeciesCard & ArtworkCard */}
          <div className="dashboard-col-right">
            <SpeciesCard
              location={currentLocation}
              weather={solarAndWeather.weather}
              solarInfo={solarAndWeather.solarInfo}
              onSpeciesLoaded={setTopSpecies}
            />

            {/* Art Institute of Chicago Component (Below Species Component) */}
            <ArtworkCard
              species={topSpecies}
              location={currentLocation}
              solarInfo={solarAndWeather.solarInfo}
              weather={solarAndWeather.weather}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
