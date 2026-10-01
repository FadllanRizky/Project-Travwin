import { Routes, Route, useLocation } from 'react-router-dom'
import AnimatedBackground from './components/background/AnimatedBackground.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SearchResults from './pages/SearchResults.jsx'
import FlightResults from './pages/FlightResults.jsx'
import HotelResults from './pages/HotelResults.jsx'
import Checkout from './pages/Checkout.jsx'
import Payment from './pages/Payment.jsx'
import MyBookings from './pages/MyBookings.jsx'
import AuthPage from './pages/AuthPage.jsx'

export default function App() {
  const location = useLocation()
  const isAuth = location.pathname === '/auth'

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/flights" element={<FlightResults />} />
          <Route path="/search/hotels" element={<HotelResults />} />
          <Route path="/search/:product" element={<SearchResults />} />
          <Route path="/checkout/:product" element={<Checkout />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      {!isAuth && <Footer />}
    </div>
  )
}