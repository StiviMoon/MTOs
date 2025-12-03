"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WeatherStatsGrid } from "@/components/weather/weather-stats-grid"
import { WeatherChartsGrid } from "@/components/weather/weather-charts-grid"
import { WeatherAlertsCard } from "@/components/weather/weather-alerts-card"
import { useCurrentWeather } from "@/hooks/use-weather"
import { useWeatherWebSocket } from "@/hooks/use-websocket"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function OverviewSection() {
  const { data } = useCurrentWeather()
  const { isConnected, error: wsError } = useWeatherWebSocket()

  const getLastUpdateText = () => {
    if (!data?.lastUpdated) return "Cargando..."
    try {
      const date = new Date(data.lastUpdated)
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    } catch {
      return "Reciente"
    }
  }

  return (
    <>
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-balance text-foreground">Sistema de Análisis Meteorológico</h1>
            <p className="text-sm text-muted-foreground mt-1">Monitoreo en tiempo real y pronósticos avanzados</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 bg-background">
              <MapPin className="h-3 w-3" />
              {data?.location.name || "Yumbo"}, {data?.location.country || "Colombia"}
            </Badge>
            <Button variant="outline" size="sm" className="bg-background">
              {isConnected ? "🟢 " : "🔴 "}Última actualización: {getLastUpdateText()}
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        <WeatherStatsGrid />
        <WeatherChartsGrid />
        <WeatherAlertsCard />
      </div>
    </>
  )
}
