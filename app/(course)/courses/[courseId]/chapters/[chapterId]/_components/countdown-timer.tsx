'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  unlocksAt: Date
}

export const CountdownTimer = ({ unlocksAt }: CountdownTimerProps) => {
  const [isClient, setIsClient] = useState(false)

  // This effect runs only on the client, after the initial render
  useEffect(() => {
    setIsClient(true)
  }, [])

  const calculateTimeLeft = () => {
    const difference = +new Date(unlocksAt) - +new Date()
    let timeLeft = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    if (!isClient) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [isClient])

  if (!isClient) {
    return null
  }

  return (
    <div className="text-center text-lg font-semibold text-white mt-2">
      <p>
        Unlocks in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </p>
    </div>
  )
}
