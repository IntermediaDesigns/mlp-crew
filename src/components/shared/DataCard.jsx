import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DataCard({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}