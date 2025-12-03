"use client"

import { MapPin, Sun, CloudDrizzle, CloudRain } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { useDailyForecast, useHourlyForecast } from "@/hooks/use-weather"
import { useLocation } from "@/hooks/use-location"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { format } from "date-fns"

const iconMap: Record<string, any> = {
  sun: Sun,
  "cloud-drizzle": CloudDrizzle,
  "cloud-rain": CloudRain,
  "partly-cloudy": Sun,
  cloud: CloudRain,
}

export function ForecastSection() {
  const { locationName } = useLocation()
  const { data: dailyData, isLoading: dailyLoading } = useDailyForecast()
  const { data: hourlyData, isLoading: hourlyLoading } = useHourlyForecast()

  const getLastUpdateText = () => {
    if (!dailyData?.lastUpdated) return "Cargando..."
    try {
      const date = new Date(dailyData.lastUpdated)
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    } catch {
      return "Reciente"
    }
  }

  return (
    <>
      <header className="border-b border-border/40 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-balance text-foreground">Pronóstico Extendido</h1>
            <p className="text-sm text-muted-foreground mt-1">Predicciones para los próximos 7 días</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 bg-background">
              <MapPin className="h-3 w-3" />
              {locationName}
            </Badge>
            <Button variant="outline" size="sm" className="bg-background">
              Última actualización: {getLastUpdateText()}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 w-full">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="daily">Pronóstico Diario</TabsTrigger>
            <TabsTrigger value="hourly">Pronóstico por Hora</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-6 mt-6">
            {dailyLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Card key={i} className="shadow-sm">
                    <CardHeader className="pb-3">
                      <Skeleton className="h-6 w-16 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-20 mb-4" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : dailyData?.forecast ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dailyData.forecast.map((forecast) => {
                  const Icon = iconMap[forecast.conditions.icon] || Sun
                  const date = new Date(forecast.date)
                  const dateStr = format(date, "d MMM", { locale: es })
                  return (
                    <Card key={forecast.date} className="shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{forecast.dayOfWeek}</CardTitle>
                            <CardDescription>{dateStr}</CardDescription>
                          </div>
                          <Icon className="h-8 w-8 text-chart-1" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Máxima</span>
                          <span className="text-2xl font-bold text-foreground">{forecast.temperature.high}°C</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Mínima</span>
                          <span className="text-lg font-medium text-muted-foreground">{forecast.temperature.low}°C</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <span className="text-xs text-muted-foreground">Lluvia</span>
                          <span className="text-xs font-medium text-chart-2">{forecast.precipitation.probability}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Humedad</span>
                          <span className="text-xs font-medium">{forecast.humidity}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Viento</span>
                          <span className="text-xs font-medium">{forecast.wind.speed} km/h</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No hay datos disponibles</div>
            )}
          </TabsContent>

          <TabsContent value="hourly" className="space-y-6 mt-6">
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Pronóstico por Hora - Hoy</CardTitle>
                <CardDescription>Temperatura y probabilidad de precipitación</CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                {hourlyLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : hourlyData?.forecast ? (
                  <ChartContainer
                    config={{
                      temp: {
                        label: "Temperatura (°C)",
                        color: "hsl(221, 83%, 53%)", // Azul vibrante
                      },
                      rain: {
                        label: "Lluvia (%)",
                        color: "hsl(199, 89%, 48%)", // Azul cielo
                      },
                    }}
                    className="h-[400px] w-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={hourlyData.forecast.map((f) => ({
                          hour: format(new Date(f.datetime), "HH:mm"),
                          temp: f.temperature,
                          rain: f.precipitation.probability,
                        }))}
                      >
                        <defs>
                          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="temp"
                          stroke="hsl(221, 83%, 53%)"
                          fill="url(#tempGrad)"
                          strokeWidth={3}
                        />
                        <Area
                          type="monotone"
                          dataKey="rain"
                          stroke="hsl(199, 89%, 48%)"
                          fill="url(#rainGrad)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">No hay datos disponibles</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
