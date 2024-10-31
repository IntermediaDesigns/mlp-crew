import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function DetailHeader({ title, backTo, backLabel }) {
  return (
    <div className="border-b">
      <div className="container flex flex-col gap-4 py-4">
        <Button
          variant="ghost"
          asChild
          className="w-fit gap-2 pl-0 text-muted-foreground"
        >
          <Link to={backTo}>
            <ChevronLeft className="h-4 w-4" />
            Back to {backLabel}
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      </div>
    </div>
  )
}