"use client"

import { Thermometer, Droplets, Wind, Gauge, Sun, Eye, CloudRain, Sprout, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useCurrentWeather } from "@/hooks/use-weather"

export function WeatherStatsGrid() {
  const { data, isLoading, error } = useCurrentWeather()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Error al cargar datos meteorológicos
      </div>
    )
  }

  const { current } = data
  const temp = current.temperature
  const humidity = current.humidity
  const wind = current.wind
  const pressure = current.pressure
  const precip = current.precipitation
  const solar = current.solar
  const airQuality = current.airQuality

  const weatherStats = [
    {
      title: "Temperatura del Aire",
      value: `${temp.air}°C`,
      subtitle: `Sensación térmica: ${temp.feelsLike}°C`,
      icon: Thermometer,
      color: "text-chart-1",
      trend: `${temp.change24h > 0 ? "+" : ""}${temp.change24h.toFixed(1)}°C desde ayer`,
      trendPositive: temp.change24h > 0,
    },
    {
      title: "Humedad Relativa",
      value: `${humidity.relative.toFixed(0)}%`,
      subtitle: `Punto de rocío: ${humidity.dewPoint.toFixed(1)}°C`,
      icon: Droplets,
      color: "text-chart-2",
      progress: Math.round(humidity.relative),
    },
    {
      title: "Velocidad del Viento",
      value: `${wind.speed.toFixed(0)} km/h`,
      subtitle: `Dirección: ${wind.directionName} • Ráfagas: ${wind.gust.toFixed(0)} km/h`,
      icon: Wind,
      color: "text-chart-3",
      badge: wind.speed < 15 ? "Suave" : wind.speed < 25 ? "Moderado" : "Fuerte",
    },
    {
      title: "Presión Atmosférica",
      value: `${pressure.value.toFixed(0)} hPa`,
      subtitle: `Tendencia: ${pressure.trend === "rising" ? "Subiendo" : pressure.trend === "falling" ? "Bajando" : "Estable"}`,
      icon: Gauge,
      color: "text-chart-4",
      badge: "Normal",
    },
    {
      title: "Precipitación",
      value: `${precip.current.toFixed(1)} mm`,
      subtitle: `Acumulado últimas 24h: ${precip.last24h.toFixed(1)} mm`,
      icon: CloudRain,
      color: "text-chart-2",
    },
    {
      title: "Radiación Solar",
      value: `${solar.radiation.toFixed(0)} W/m²`,
      subtitle: `Máximo hoy: ${solar.maxToday.toFixed(0)} W/m²`,
      icon: Sun,
      color: "text-chart-4",
      progress: Math.round((solar.radiation / solar.maxToday) * 100),
    },
    {
      title: "Índice UV",
      value: `${solar.uvIndex}`,
      subtitle: `${solar.uvLevel === "low" ? "Bajo" : solar.uvLevel === "moderate" ? "Moderado" : solar.uvLevel === "high" ? "Alto" : solar.uvLevel === "very_high" ? "Muy Alto" : "Extremo"} - ${solar.uvIndex >= 8 ? "Protección necesaria" : "Precaución"}`,
      icon: Sun,
      color: "text-chart-4",
      badge: solar.uvLevel === "low" ? "Bajo" : solar.uvLevel === "moderate" ? "Moderado" : solar.uvLevel === "high" ? "Alto" : solar.uvLevel === "very_high" ? "Muy Alto" : "Extremo",
    },
    {
      title: "Temperatura del Suelo",
      value: `${temp.soil.toFixed(0)}°C`,
      subtitle: `Humedad del suelo: ${humidity.soil.toFixed(0)}%`,
      icon: Sprout,
      color: "text-chart-3",
      progress: Math.round(humidity.soil),
    },
    {
      title: "Visibilidad",
      value: `${current.visibility.toFixed(1)} km`,
      subtitle: "Condiciones óptimas",
      icon: Eye,
      color: "text-chart-1",
    },
    {
      title: "Calidad del Aire",
      value: `AQI ${airQuality.aqi}`,
      subtitle: `PM2.5: ${airQuality.pm25.toFixed(0)} μg/m³ • ${airQuality.level === "good" ? "Buena" : airQuality.level === "moderate" ? "Moderada" : "Mala"}`,
      icon: Wind,
      color: "text-chart-3",
      badge: airQuality.level === "good" ? "Buena" : airQuality.level === "moderate" ? "Moderada" : "Mala",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {weatherStats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>

              {stat.trend && (
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className={`h-3 w-3 ${stat.trendPositive ? "text-chart-3" : "text-destructive"}`} />
                  <span className={`font-medium ${stat.trendPositive ? "text-chart-3" : "text-destructive"}`}>
                    {stat.trend}
                  </span>
                </div>
              )}

              {stat.progress !== undefined && (
                <div className="mt-2">
                  <Progress value={stat.progress} className="h-2" />
                </div>
              )}

              {stat.badge && (
                <Badge variant="secondary" className="mt-2">
                  {stat.badge}
                </Badge>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
