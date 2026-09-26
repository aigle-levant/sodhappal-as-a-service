import Navbar from './components/Navbar'
import SolarCard from './components/SolarCard'
import Footer from './components/Footer'
import './App.css'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="container" style={{ paddingTop: 120, paddingBottom: 64, minHeight: 'calc(100vh - 120px)' }}>
        {/* Live Animated Solar & Weather Card (sunrise-sunset.org API) */}
        <section style={{ display: 'flex', justifyContent: 'flex-start', textAlign: 'left' }}>
          <SolarCard />
        </section>
      </main>

      <Footer />
    </div>
  )
}
