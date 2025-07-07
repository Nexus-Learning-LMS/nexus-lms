'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  unlocksAt: Date
}

export const CountdownTimer = ({ unlocksAt }: CountdownTimerProps) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(unlocksAt) - +new Date()
    let timeLeft = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearTimeout(timer)
  })

  return (
    <div className="text-center text-lg font-semibold text-white mt-2">
      <p>
        Unlocks in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </p>
    </div>
  )
}
