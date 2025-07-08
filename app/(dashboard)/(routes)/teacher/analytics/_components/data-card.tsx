import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DataCardProps {
  value: number
  label: string
}

export const DataCard = ({ value, label }: DataCardProps) => {
  return (
    // --- START OF CHANGE: Updated card styling ---
    <Card className="bg-sky-100/70 border-sky-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-sky-800">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-sky-900">{value}</div>
      </CardContent>
    </Card>
    // --- END OF CHANGE ---
  )
}
