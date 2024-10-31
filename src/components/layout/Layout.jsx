import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative flex min-h-screen flex-col bg-[url('/mlp.jpg')] bg-cover bg-center bg-fixed">
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      
      {/* Content */}
      <div className="relative flex min-h-screen flex-col">
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 flex">
          <Sidebar 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} 
          />
          <main className="flex-1 pt-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
