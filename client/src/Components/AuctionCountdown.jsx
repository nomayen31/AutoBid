import React, { useState, useEffect } from 'react'
import { Clock, Zap } from 'lucide-react'

// Example: Auction for McLaren 720S Coupe
const TARGET_DATE = new Date()
TARGET_DATE.setDate(TARGET_DATE.getDate() + 2)
TARGET_DATE.setHours(14, 0, 0, 0) // 2:00 PM

// Utility function
const calculateTimeRemaining = (targetDate) => {
  const now = new Date().getTime()
  const distance = targetDate.getTime() - now

  if (distance < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, hasStarted: true }
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds, hasStarted: false }
}

// Time Segment Component
const TimeSegment = ({ value, label }) => (
  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-xl shadow-lg m-1 w-20 sm:w-28 md:w-36 transition-transform duration-300 hover:scale-105">
    <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono tracking-tight">
      {String(value).padStart(2, '0')}
    </div>
    <div className="text-xs sm:text-sm text-gray-400 uppercase mt-1 font-semibold">
      {label}
    </div>
  </div>
)

const AuctionCountdown = () => {
  const [time, setTime] = useState(calculateTimeRemaining(TARGET_DATE))
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeRemaining(TARGET_DATE))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLiveAuctionClick = () => {
    setModalMessage('Redirecting to the McLaren 720S Live Auction...')
    setShowModal(true)
    setTimeout(() => {
      setShowModal(false)
      setModalMessage('')
    }, 2000)
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 rounded-t-4xl">
      {/* Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <p className="text-lg font-semibold text-gray-800">{modalMessage}</p>
          </div>
        </div>
      )}

      {/* Countdown Card */}
      <div className="w-full max-w-4xl bg-gradient-to-b from-gray-900 to-gray-800 backdrop-blur-sm p-8 sm:p-10 rounded-t-3xl shadow-2xl border border-gray-700 text-center">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex items-center justify-center tracking-wide">
            <Clock className="w-8 h-8 mr-3 text-amber-400" />
            McLaren 720S Coupe Auction Countdown
          </h1>
          <p className="text-base text-gray-400 font-medium">
            Auction Lot #302 • Bidding Starts <span className="text-amber-400">Oct 16, 2:00 PM</span> • Live from Dhaka Showroom
          </p>
        </header>

        {/* Timer */}
        <div className="flex justify-center flex-wrap mb-10">
          {time.hasStarted ? (
            <div className="text-center p-6 bg-green-600 rounded-xl shadow-inner shadow-green-800">
              <p className="text-3xl sm:text-4xl font-bold text-white uppercase tracking-wider">
                Auction is LIVE!
              </p>
            </div>
          ) : (
            <>
              <TimeSegment value={time.days} label="Days" />
              <TimeSegment value={time.hours} label="Hours" />
              <TimeSegment value={time.minutes} label="Minutes" />
              <TimeSegment value={time.seconds} label="Seconds" />
            </>
          )}
        </div>

        {/* Live Auction Button */}
        <div>
          <button
            onClick={handleLiveAuctionClick}
            disabled={!time.hasStarted}
            className={`inline-flex items-center px-10 py-4 text-lg font-bold uppercase tracking-wide rounded-full shadow-lg transition-all duration-300 ${
              time.hasStarted
                ? 'bg-amber-400 hover:bg-amber-300 text-black ring-4 ring-amber-300/60 animate-pulse'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-70'
            }`}
          >
            <Zap className="w-6 h-6 mr-3" />
            {time.hasStarted ? 'Join Live Auction Now' : 'Awaiting Auction Start'}
          </button>

          {!time.hasStarted && (
            <p className="text-sm text-gray-500 mt-3">
              This button will activate once the auction goes live.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuctionCountdown
