'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Label, CartesianGrid } from 'recharts'
import { useState, useEffect } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartProps {
  data: {
    name: string
    total: number
  }[]
}

export const Chart = ({ data }: ChartProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 890)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const truncateText = (text: string, maxLength: number = 15) => {
    if (text.length <= maxLength) {
      return text
    }
    return `${text.substring(0, maxLength)}...`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Enrollments</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={350} minWidth={500}>
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: isMobile ? 100 : 20,
              }}
            >
              {/* --- START OF CHANGE: Added CartesianGrid for background lines --- */}
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              {/* --- END OF CHANGE --- */}
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                interval={0}
                angle={isMobile ? -90 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                dx={isMobile ? -5 : 0}
                dy={isMobile ? 0 : 5}
                tickFormatter={(value) => truncateText(value)}
              />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false}>
                <Label
                  value="Number of Enrollments"
                  angle={-90}
                  position="insideLeft"
                  style={{ textAnchor: 'middle' }}
                />
              </YAxis>
              <Bar dataKey="total" fill="#011f9f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
