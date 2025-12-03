"use client"

import { useState, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Zap, Menu, X, Home, BarChart3, Map, AlertTriangle, Settings, Calendar, TrendingUp, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OverviewSection } from "./sections/overview-section"
import { ForecastSection } from "./sections/forecast-section"
import { AnalyticsSection } from "./sections/analytics-section"
import { MapsSection } from "./sections/maps-section"
import { AlertsSection } from "./sections/alerts-section"
import { SettingsSection } from "./sections/settings-section"
import { PredictionsSection } from "./sections/predictions-section"
import { AboutSection } from "./sections/about-section"

const navItems = [
  { id: "overview", label: "Vista General", icon: Home },
  { id: "forecast", label: "Pronóstico", icon: Calendar },
  { id: "predictions", label: "Predicciones", icon: TrendingUp },
  { id: "analytics", label: "Análisis", icon: BarChart3 },
  { id: "maps", label: "Mapas", icon: Map },
  { id: "alerts", label: "Alertas", icon: AlertTriangle },
  { id: "about", label: "Acerca del Proyecto", icon: Info },
  { id: "settings", label: "Configuración", icon: Settings },
] as const

export function WeatherDashboard() {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Determinar la sección activa basada en la URL o usar 'overview' por defecto
  const activeSection = useMemo(() => {
    if (!pathname || pathname === '/') return 'overview'
    const section = pathname.split('/').filter(Boolean).pop() || 'overview'
    return navItems.some(item => item.id === section) ? section : 'overview'
  }, [pathname])

  const handleSectionChange = (sectionId: string) => {
    if (sectionId === 'overview') {
      router.push('/')
    } else {
      router.push(`/${sectionId}`)
    }
  }

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const renderSection = useMemo(() => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />
      case "forecast":
        return <ForecastSection />
      case "predictions":
        return <PredictionsSection />
      case "analytics":
        return <AnalyticsSection />
      case "maps":
        return <MapsSection />
      case "alerts":
        return <AlertsSection />
      case "about":
        return <AboutSection />
      case "settings":
        return <SettingsSection />
      default:
        return <OverviewSection />
    }
  }, [activeSection])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`bg-sidebar border-r border-sidebar-border/50 transition-all duration-300 flex flex-col ${
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        }`}
      >
        <div className="p-4 border-b border-sidebar-border/50 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">MTOs</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSidebar}
            className="text-sidebar-foreground hover:bg-sidebar-accent cursor-pointer"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border/50">
          {sidebarOpen ? (
            <div className="bg-chart-4/10 border border-chart-4/20 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-chart-4" />
                <span className="text-xs font-semibold text-sidebar-foreground">Alerta Activa</span>
              </div>
              <p className="text-xs text-sidebar-foreground/70">Lluvia intensa esperada en 2h</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <AlertTriangle className="h-5 w-5 text-chart-4" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{renderSection}</main>
    </div>
  )
}
