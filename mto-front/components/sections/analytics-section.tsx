"use client"

import { MapPin, TrendingUp, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart, ComposedChart, Area } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useLocation } from "@/hooks/use-location"
import { useAnalytics, useStatistics, useCorrelationMatrix } from "@/hooks/use-weather"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const monthlyTempData = [
  { month: "Ene", avgTemp: 26, maxTemp: 32, minTemp: 20 },
  { month: "Feb", avgTemp: 25, maxTemp: 30, minTemp: 19 },
  { month: "Mar", avgTemp: 23, maxTemp: 28, minTemp: 17 },
  { month: "Abr", avgTemp: 20, maxTemp: 25, minTemp: 14 },
  { month: "May", avgTemp: 17, maxTemp: 22, minTemp: 11 },
  { month: "Jun", avgTemp: 14, maxTemp: 19, minTemp: 8 },
]

const precipitationMonthly = [
  { month: "Ene", precipitation: 120, days: 8 },
  { month: "Feb", precipitation: 100, days: 7 },
  { month: "Mar", precipitation: 150, days: 10 },
  { month: "Abr", precipitation: 80, days: 6 },
  { month: "May", precipitation: 60, days: 5 },
  { month: "Jun", precipitation: 40, days: 3 },
]

const windRoseData = [
  { direction: "N", frequency: 12, avgSpeed: 15 },
  { direction: "NE", frequency: 8, avgSpeed: 18 },
  { direction: "E", frequency: 15, avgSpeed: 12 },
  { direction: "SE", frequency: 18, avgSpeed: 20 },
  { direction: "S", frequency: 10, avgSpeed: 16 },
  { direction: "SO", frequency: 14, avgSpeed: 22 },
  { direction: "O", frequency: 16, avgSpeed: 19 },
  { direction: "NO", frequency: 7, avgSpeed: 14 },
]

export function AnalyticsSection() {
  const { locationName } = useLocation()
  const { data: analyticsData, isLoading } = useAnalytics()

  const getLastUpdateText = () => {
    if (!analyticsData?.lastUpdated) return "Cargando..."
    try {
      const date = new Date(analyticsData.lastUpdated)
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
            <h1 className="text-2xl font-semibold text-balance text-foreground">Análisis Histórico</h1>
            <p className="text-sm text-muted-foreground mt-1">Tendencias y estadísticas meteorológicas</p>
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
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader>
                  <Skeleton className="h-4 w-32 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : analyticsData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Temperatura Promedio</CardTitle>
                <Activity className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{analyticsData.temperature.average.toFixed(1)}°C</div>
                <p className="text-xs text-muted-foreground mt-1">Últimos 6 meses</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3 font-medium">+1.2°C vs año anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Precipitación Total</CardTitle>
                <Activity className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{analyticsData.precipitation.total.toFixed(0)} mm</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Últimos 6 meses • {analyticsData.precipitation.daysWithRain} días
                </p>
                <Badge variant="secondary" className="mt-2">
                  Normal
                </Badge>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Viento Dominante</CardTitle>
                <Activity className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{analyticsData.wind.dominantDirection}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Velocidad promedio: {analyticsData.wind.averageSpeed.toFixed(1)} km/h
                </p>
                <p className="text-xs text-muted-foreground">
                  Frecuencia:{" "}
                  {analyticsData.wind.frequency.find((f) => f.direction === analyticsData.wind.dominantDirection)
                    ?.frequency.toFixed(0) || "18"}
                  %
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <Tabs defaultValue="temperature" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="temperature">Temperatura</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitación</TabsTrigger>
            <TabsTrigger value="wind">Viento</TabsTrigger>
            <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
            <TabsTrigger value="correlation">Correlación</TabsTrigger>
          </TabsList>

          <TabsContent value="temperature" className="space-y-6 mt-6 w-full">
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Análisis de Temperatura Mensual</CardTitle>
                <CardDescription>Promedios, máximas y mínimas de los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <ChartContainer
                  config={{
                    avgTemp: {
                      label: "Promedio",
                      color: "hsl(221, 83%, 53%)", // Azul vibrante
                    },
                    maxTemp: {
                      label: "Máxima",
                      color: "hsl(14, 90%, 53%)", // Naranja vibrante
                    },
                    minTemp: {
                      label: "Mínima",
                      color: "hsl(199, 89%, 48%)", // Azul cielo
                    },
                  }}
                  className="h-[450px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={
                        analyticsData?.temperature.records
                          ? analyticsData.temperature.records.map((r) => ({
                              month: r.date.split("-")[1] === "01" ? "Ene" : r.date.split("-")[1] === "02" ? "Feb" : r.date.split("-")[1] === "03" ? "Mar" : r.date.split("-")[1] === "04" ? "Abr" : r.date.split("-")[1] === "05" ? "May" : "Jun",
                              avgTemp: r.avg,
                              maxTemp: r.max,
                              minTemp: r.min,
                            }))
                          : []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="maxTemp"
                        stroke="hsl(14, 90%, 53%)"
                        fill="hsl(14, 90%, 53%)"
                        fillOpacity={0.2}
                        strokeWidth={3}
                      />
                      <Area
                        type="monotone"
                        dataKey="minTemp"
                        stroke="hsl(199, 89%, 48%)"
                        fill="hsl(199, 89%, 48%)"
                        fillOpacity={0.2}
                        strokeWidth={3}
                      />
                      <Line
                        type="monotone"
                        dataKey="avgTemp"
                        stroke="hsl(221, 83%, 53%)"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "hsl(221, 83%, 53%)" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="precipitation" className="space-y-6 mt-6 w-full">
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Análisis de Precipitación Mensual</CardTitle>
                <CardDescription>Acumulado en mm y días con lluvia</CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <ChartContainer
                  config={{
                    precipitation: {
                      label: "Precipitación (mm)",
                      color: "hsl(199, 89%, 48%)", // Azul cielo
                    },
                    days: {
                      label: "Días con lluvia",
                      color: "hsl(142, 76%, 36%)", // Verde esmeralda
                    },
                  }}
                  className="h-[450px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={
                        analyticsData?.precipitation.records
                          ? analyticsData.precipitation.records.map((r) => ({
                              month: r.date.split("-")[1] === "01" ? "Ene" : r.date.split("-")[1] === "02" ? "Feb" : r.date.split("-")[1] === "03" ? "Mar" : r.date.split("-")[1] === "04" ? "Abr" : r.date.split("-")[1] === "05" ? "May" : "Jun",
                              precipitation: r.amount,
                              days: r.days,
                            }))
                          : []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar yAxisId="left" dataKey="precipitation" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="days"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "hsl(142, 76%, 36%)" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wind" className="space-y-6 mt-6 w-full">
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Rosa de los Vientos</CardTitle>
                <CardDescription>Frecuencia y velocidad promedio por dirección</CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <ChartContainer
                  config={{
                    frequency: {
                      label: "Frecuencia (%)",
                      color: "hsl(195, 85%, 41%)", // Azul turquesa
                    },
                    avgSpeed: {
                      label: "Velocidad (km/h)",
                      color: "hsl(221, 83%, 53%)", // Azul vibrante
                    },
                  }}
                  className="h-[450px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        analyticsData?.wind.frequency
                          ? analyticsData.wind.frequency.map((f) => ({
                              direction: f.direction,
                              frequency: f.frequency,
                              avgSpeed: f.avgSpeed,
                            }))
                          : []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="direction" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="frequency" fill="hsl(195, 85%, 41%)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="avgSpeed" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Estadísticas Descriptivas */}
          <TabsContent value="statistics" className="space-y-6 mt-6 w-full">
            <StatisticsContent />
          </TabsContent>

          {/* Matriz de Correlación */}
          <TabsContent value="correlation" className="space-y-6 mt-6 w-full">
            <CorrelationMatrixContent />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

// Componente para mostrar estadísticas descriptivas
function StatisticsContent() {
  const { data: statisticsData, isLoading } = useStatistics(undefined, 168)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    )
  }

  if (!statisticsData) {
    return <div className="text-center py-8 text-muted-foreground">No hay datos disponibles</div>
  }

  const stats = statisticsData.statistics

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Estadísticas Descriptivas - Últimos 7 días</CardTitle>
          <CardDescription>
            Análisis estadístico completo de las variables meteorológicas
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(stats).map(([varName, varStats]) => (
          <Card key={varName} className="shadow-sm w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base capitalize">{varName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 w-full">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Media:</span>
                  <span className="ml-2 font-medium">{varStats.mean.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mediana:</span>
                  <span className="ml-2 font-medium">{varStats.median.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Desv. Est.:</span>
                  <span className="ml-2 font-medium">{varStats.stdDev.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Mín:</span>
                  <span className="ml-2 font-medium">{varStats.min.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Máx:</span>
                  <span className="ml-2 font-medium">{varStats.max.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Q1:</span>
                  <span className="ml-2 font-medium">{varStats.q1.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Q3:</span>
                  <span className="ml-2 font-medium">{varStats.q3.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">IQR:</span>
                  <span className="ml-2 font-medium">{varStats.iqr.toFixed(2)}</span>
                </div>
              </div>
              {varStats.confidenceInterval95 && (
                <div className="pt-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    IC 95%: [{varStats.confidenceInterval95.lower.toFixed(2)},{" "}
                    {varStats.confidenceInterval95.upper.toFixed(2)}]
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Componente para mostrar matriz de correlación
function CorrelationMatrixContent() {
  const { data: correlationData, isLoading } = useCorrelationMatrix(undefined, 168)

  if (isLoading) {
    return <Skeleton className="h-[500px] w-full" />
  }

  if (!correlationData) {
    return <div className="text-center py-8 text-muted-foreground">No hay datos disponibles</div>
  }

  const { matrix, variables } = correlationData

  // Función para obtener color según el valor de correlación
  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value)
    if (absValue > 0.7) return "bg-chart-1/20 border-chart-1/40"
    if (absValue > 0.4) return "bg-chart-2/20 border-chart-2/40"
    if (absValue > 0.2) return "bg-chart-3/20 border-chart-3/40"
    return "bg-muted/20 border-muted/40"
  }

  return (
    <Card className="shadow-sm w-full">
      <CardHeader>
        <CardTitle>Matriz de Correlación - Últimos 7 días</CardTitle>
        <CardDescription>
          Correlación entre variables meteorológicas (valores entre -1 y 1)
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-sm font-medium text-muted-foreground border-b border-border/30">
                    Variable
                  </th>
                  {variables.map((varName) => (
                    <th
                      key={varName}
                      className="p-2 text-center text-xs font-medium text-muted-foreground border-b border-border/30 capitalize"
                    >
                      {varName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {variables.map((var1) => (
                  <tr key={var1}>
                    <td className="p-2 text-sm font-medium capitalize border-r border-border/30">
                      {var1}
                    </td>
                    {variables.map((var2) => {
                      const value = matrix[var1]?.[var2] ?? 0
                      const isDiagonal = var1 === var2
                      return (
                        <td
                          key={`${var1}-${var2}`}
                          className={`p-2 text-center text-sm border border-border/30 ${
                            isDiagonal
                              ? "bg-muted/30 font-bold"
                              : getCorrelationColor(value)
                          }`}
                        >
                          {isDiagonal ? "1.00" : value.toFixed(2)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 p-3 bg-muted/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Interpretación:</strong> Valores cercanos a 1 indican correlación positiva fuerte,
            valores cercanos a -1 indican correlación negativa fuerte, valores cercanos a 0 indican poca
            o ninguna correlación.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
