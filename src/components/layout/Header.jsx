import { Menu } from 'lucide-react'
import { Button } from '../ui/button'
import { ThemeToggle } from '../theme/ThemeToggle'

export function Header({ setIsSidebarOpen }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Button
          variant="ghost"
          className="mr-2 px-2 md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">MLP Crew</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
