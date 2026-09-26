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

  // Extract place name (e.g. "Tokyo", "Chennai", "London", etc.)
  const placeName = currentLocation?.name?.split(',')?.[0]?.trim() || 'Your Area'

  // Handle city search from the Navbar search bar
  const handleCitySearch = async (searchTerm) => {
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=1&language=en&format=json`
      ).then((r) => r.json())

      if (res.results && res.results.length > 0) {
        const item = res.results[0]
        setCurrentLocation({
          name: `${item.name}, ${item.country || ''}`,
          lat: parseFloat(item.latitude.toFixed(4)),
          lng: parseFloat(item.longitude.toFixed(4)),
        })
      }
    } catch {
      // Graceful fallback
    }
  }

  return (
    <div className="app-shell">
      <Navbar onSearch={handleCitySearch} />

      <main className="app-main-content">
        <div className="content-container">
          {/* Big Welcome Banner */}
          <div className="welcome-banner">
            <h1 className="welcome-headline">
              Welcome to <span className="welcome-place-name">{placeName}</span>
            </h1>
            <p className="welcome-subline">
              Explore regional wildlife, museum art connections, and the solar light of the day.
            </p>
          </div>

          {/* Main Flow: Wide Weather Card -> Species Card Below -> Artwork Card Below */}
          <section className="dashboard-content-flow">
            {/* 1. Wide Weather & Solar Card (wider than longer) */}
            <SolarCard
              currentLocation={currentLocation}
              onLocationChange={setCurrentLocation}
              onDataSync={setSolarAndWeather}
            />

            {/* 2. Top 3 Species Card directly below Weather Card */}
            <SpeciesCard
              location={currentLocation}
              weather={solarAndWeather.weather}
              solarInfo={solarAndWeather.solarInfo}
              onSpeciesLoaded={setTopSpecies}
            />

            {/* 3. Art Institute of Chicago Component below Species Card */}
            <ArtworkCard
              species={topSpecies}
              location={currentLocation}
              solarInfo={solarAndWeather.solarInfo}
              weather={solarAndWeather.weather}
            />
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
