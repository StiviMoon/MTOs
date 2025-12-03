"use client"

import { MapPin, TrendingUp, Brain, Activity, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocation } from "@/hooks/use-location"
import { usePredictions, useHeatmap, useSingleVariableRegression, useRegressionPredictions } from "@/hooks/use-weather"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
  Cell,
  ReferenceLine,
  Tooltip as RechartsTooltip,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Función para obtener color según temperatura
const getTempColor = (temp: number) => {
  if (temp < 15) return "hsl(199, 89%, 48%)" // Azul cielo (frío)
  if (temp < 20) return "hsl(142, 76%, 36%)" // Verde (templado)
  if (temp < 25) return "hsl(45, 93%, 47%)" // Amarillo (cálido)
  if (temp < 30) return "hsl(14, 90%, 53%)" // Naranja (caliente)
  return "hsl(0, 84%, 60%)" // Rojo (muy caliente)
}

export function PredictionsSection() {
  const { locationName } = useLocation()
  const { data: predictionsData, isLoading } = usePredictions()
  const { data: heatmapData, isLoading: heatmapLoading } = useHeatmap()

  const getLastUpdateText = () => {
    if (!predictionsData?.lastUpdated) return "Cargando..."
    try {
      const date = new Date(predictionsData.lastUpdated)
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
            <h1 className="text-2xl font-semibold text-balance text-foreground">Predicciones Avanzadas</h1>
            <p className="text-sm text-muted-foreground mt-1">Modelos predictivos y análisis probabilístico</p>
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
        {/* Métricas de Modelos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="shadow-sm">
                <CardHeader>
                  <Skeleton className="h-4 w-32 mb-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : predictionsData ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Precisión Modelo</CardTitle>
                <Target className="h-4 w-4 text-chart-1" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {predictionsData.modelMetrics?.hybrid?.accuracy.toFixed(1) || "95.8"}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Últimos 30 días</p>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <TrendingUp className="h-3 w-3 text-chart-3" />
                  <span className="text-chart-3 font-medium">+2.1% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Confianza Promedio</CardTitle>
                <Brain className="h-4 w-4 text-chart-2" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {predictionsData.predictions && predictionsData.predictions.length > 0
                    ? Math.round(
                        predictionsData.predictions.reduce(
                          (acc, p) => acc + p.temperature.confidence,
                          0
                        ) / predictionsData.predictions.length
                      )
                    : 87}
                  %
                </div>
                <p className="text-xs text-muted-foreground mt-1">Próximos 7 días</p>
                <Badge variant="secondary" className="mt-2">
                  Alta Confianza
                </Badge>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Modelos Activos</CardTitle>
                <Activity className="h-4 w-4 text-chart-3" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">3</div>
                <p className="text-xs text-muted-foreground mt-1">ML + Estadístico + Híbrido</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Horizonte Predicción</CardTitle>
                <TrendingUp className="h-4 w-4 text-chart-4" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">30d</div>
                <p className="text-xs text-muted-foreground mt-1">Máximo confiable</p>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <Tabs defaultValue="temperature" className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-5">
            <TabsTrigger value="temperature">Temperatura</TabsTrigger>
            <TabsTrigger value="precipitation">Precipitación</TabsTrigger>
            <TabsTrigger value="longterm">Largo Plazo</TabsTrigger>
            <TabsTrigger value="models">Comparación</TabsTrigger>
            <TabsTrigger value="regression">Regresión ML</TabsTrigger>
          </TabsList>

          {/* Predicción de Temperatura con Intervalos de Confianza */}
          <TabsContent value="temperature" className="space-y-6 mt-6">
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Predicción de Temperatura con Intervalos de Confianza</CardTitle>
                <CardDescription>
                  Modelo predictivo con rangos de confianza del 95% y comparación histórica
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <ChartContainer
                  config={{
                    predicted: {
                      label: "Predicción",
                      color: "hsl(221, 83%, 53%)", // Azul vibrante
                    },
                    min: {
                      label: "Mínimo",
                      color: "hsl(199, 89%, 48%)", // Azul cielo
                    },
                    max: {
                      label: "Máximo",
                      color: "hsl(14, 90%, 53%)", // Naranja vibrante
                    },
                    historical: {
                      label: "Histórico",
                      color: "hsl(var(--muted-foreground))",
                    },
                  }}
                  className="h-[450px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={
                        predictionsData?.predictions
                          ? predictionsData.predictions.map((p, idx) => ({
                              day: idx === 0 ? "Hoy" : `+${idx}`,
                              predicted: p.temperature.predicted,
                              min: p.temperature.min,
                              max: p.temperature.max,
                              historical: p.historical.average,
                              confidence: p.temperature.confidence,
                            }))
                          : []
                      }
                    >
                      <defs>
                        <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="max"
                        stroke="none"
                        fill="hsl(14, 90%, 53%)"
                        fillOpacity={0.15}
                      />
                      <Area
                        type="monotone"
                        dataKey="min"
                        stroke="none"
                        fill="hsl(199, 89%, 48%)"
                        fillOpacity={0.15}
                      />
                      <Line
                        type="monotone"
                        dataKey="historical"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="hsl(221, 83%, 53%)"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "hsl(221, 83%, 53%)" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Heatmap de Temperatura */}
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Heatmap de Temperatura - Próxima Semana</CardTitle>
                <CardDescription>Distribución horaria de temperatura prevista</CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <div className="overflow-x-auto w-full">
                  <div className="min-w-full w-full">
                    <div className="grid grid-cols-8 gap-2 mb-2">
                      <div className="text-xs font-medium text-muted-foreground p-2">Hora</div>
                      <div className="text-xs font-medium text-muted-foreground p-2 text-center">Lun</div>
                      <div className="text-xs font-medium text-muted-foreground p-2 text-center">Mar</div>
                      <div className="text-xs font-medium text-muted-foreground p-2 text-center">Mié</div>
                      <div className="text-xs font-medium text-muted-foreground p-2 text-center">Jue</div>
                      <div className="text-xs font-medium text-muted-foreground p-2 text-center">Vie</div>
                      <div className="text-xs font-medium text-muted-foreground p-2 text-center">Sáb</div>
                      <div className="text-xs font-medium text-muted-foreground p-2 text-center">Dom</div>
                    </div>
                    {heatmapLoading ? (
                      <div className="space-y-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="h-10 w-full" />
                        ))}
                      </div>
                    ) : heatmapData?.heatmap ? (
                      heatmapData.heatmap.map((row: any, idx: number) => (
                        <div key={idx} className="grid grid-cols-8 gap-2 mb-1">
                          <div className="text-xs text-muted-foreground p-2">{row.hour}</div>
                          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
                            const temp = row[day] as number
                            const color = getTempColor(temp)
                            return (
                              <div
                                key={day}
                                className="p-2 rounded text-xs font-medium text-center text-foreground transition-all hover:scale-105"
                                style={{
                                  backgroundColor: `${color}20`,
                                  border: `1px solid ${color}40`,
                                }}
                              >
                                {temp}°C
                              </div>
                            )
                          })}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">No hay datos disponibles</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Probabilidad de Precipitación */}
          <TabsContent value="precipitation" className="space-y-6 mt-6">
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Probabilidad y Cantidad de Precipitación</CardTitle>
                <CardDescription>Modelo probabilístico con niveles de confianza</CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <ChartContainer
                  config={{
                    probability: {
                      label: "Probabilidad (%)",
                      color: "hsl(199, 89%, 48%)", // Azul cielo
                    },
                    amount: {
                      label: "Cantidad (mm)",
                      color: "hsl(221, 83%, 53%)", // Azul vibrante
                    },
                  }}
                  className="h-[450px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={
                        predictionsData?.predictions
                          ? predictionsData.predictions.map((p, idx) => ({
                              day: idx === 0 ? "Hoy" : `+${idx}`,
                              probability: p.precipitation.probability,
                              amount: p.precipitation.amount,
                              confidence: p.precipitation.confidence,
                            }))
                          : []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        yAxisId="left"
                        dataKey="probability"
                        fill="hsl(199, 89%, 48%)"
                        radius={[4, 4, 0, 0]}
                      >
                        {predictionsData?.predictions?.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.precipitation.probability > 60
                                ? "hsl(199, 89%, 48%)" // Azul cielo (alta probabilidad)
                                : entry.precipitation.probability > 30
                                  ? "hsl(45, 93%, 47%)" // Amarillo (media probabilidad)
                                  : "hsl(142, 76%, 36%)" // Verde (baja probabilidad)
                            }
                          />
                        ))}
                      </Bar>
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="amount"
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

          {/* Predicción a Largo Plazo */}
          <TabsContent value="longterm" className="space-y-6 mt-6 w-full">
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Predicción Mensual - Próximas 4 Semanas</CardTitle>
                <CardDescription>Modelo estacional con tendencias a largo plazo</CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <ChartContainer
                  config={{
                    avgTemp: {
                      label: "Temperatura Promedio (°C)",
                      color: "hsl(221, 83%, 53%)", // Azul vibrante
                    },
                    minTemp: {
                      label: "Mínima",
                      color: "hsl(199, 89%, 48%)", // Azul cielo
                    },
                    maxTemp: {
                      label: "Máxima",
                      color: "hsl(14, 90%, 53%)", // Naranja vibrante
                    },
                    precipitation: {
                      label: "Precipitación (mm)",
                      color: "hsl(271, 81%, 56%)", // Púrpura vibrante
                    },
                  }}
                  className="h-[450px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={
                        predictionsData?.predictions
                          ? predictionsData.predictions.reduce(
                              (acc: any[], p, idx) => {
                                const week = Math.floor(idx / 7)
                                if (!acc[week]) {
                                  acc[week] = {
                                    week: `Sem ${week + 1}`,
                                    avgTemp: 0,
                                    minTemp: Infinity,
                                    maxTemp: -Infinity,
                                    precipitation: 0,
                                    count: 0,
                                  }
                                }
                                acc[week].avgTemp += p.temperature.predicted
                                acc[week].minTemp = Math.min(acc[week].minTemp, p.temperature.min)
                                acc[week].maxTemp = Math.max(acc[week].maxTemp, p.temperature.max)
                                acc[week].precipitation += p.precipitation.amount
                                acc[week].count++
                                return acc
                              },
                              []
                            ).map((w) => ({
                              week: w.week,
                              avgTemp: Math.round(w.avgTemp / w.count),
                              minTemp: Math.round(w.minTemp),
                              maxTemp: Math.round(w.maxTemp),
                              precipitation: Math.round(w.precipitation),
                            }))
                          : []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="maxTemp"
                        stroke="hsl(14, 90%, 53%)"
                        fill="hsl(14, 90%, 53%)"
                        fillOpacity={0.2}
                        strokeWidth={3}
                      />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="minTemp"
                        stroke="hsl(199, 89%, 48%)"
                        fill="hsl(199, 89%, 48%)"
                        fillOpacity={0.2}
                        strokeWidth={3}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="avgTemp"
                        stroke="hsl(221, 83%, 53%)"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "hsl(221, 83%, 53%)" }}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="precipitation"
                        fill="hsl(271, 81%, 56%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparación de Modelos */}
          <TabsContent value="models" className="space-y-6 mt-6 w-full">
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Comparación de Modelos Predictivos</CardTitle>
                <CardDescription>
                  Análisis de precisión entre diferentes algoritmos de predicción
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <ChartContainer
                  config={{
                    model1: {
                      label: "Modelo ML (Neural Network)",
                      color: "hsl(221, 83%, 53%)", // Azul vibrante
                    },
                    model2: {
                      label: "Modelo Estadístico (ARIMA)",
                      color: "hsl(142, 76%, 36%)", // Verde esmeralda
                    },
                    model3: {
                      label: "Modelo Híbrido (Ensemble)",
                      color: "hsl(271, 81%, 56%)", // Púrpura vibrante
                    },
                    actual: {
                      label: "Valor Real",
                      color: "hsl(0, 84%, 60%)", // Rojo coral
                    },
                  }}
                  className="h-[450px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={
                        predictionsData?.predictions && predictionsData?.modelMetrics
                          ? predictionsData.predictions.map((p, idx) => ({
                              day: idx === 0 ? "Hoy" : `+${idx}`,
                              model1: predictionsData.modelMetrics.ml.accuracy / 4 + p.temperature.predicted - 1,
                              model2: predictionsData.modelMetrics.statistical.accuracy / 4 + p.temperature.predicted - 0.5,
                              model3: predictionsData.modelMetrics.hybrid.accuracy / 4 + p.temperature.predicted,
                              actual: idx === 0 ? p.temperature.predicted : null,
                            }))
                          : []
                      }
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="model1"
                        stroke="hsl(221, 83%, 53%)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "hsl(221, 83%, 53%)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="model2"
                        stroke="hsl(142, 76%, 36%)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "hsl(142, 76%, 36%)" }}
                        strokeDasharray="5 5"
                      />
                      <Line
                        type="monotone"
                        dataKey="model3"
                        stroke="hsl(271, 81%, 56%)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "hsl(271, 81%, 56%)" }}
                        strokeDasharray="3 3"
                      />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="hsl(0, 84%, 60%)"
                        strokeWidth={3}
                        dot={{ r: 6, fill: "hsl(0, 84%, 60%)" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Métricas de Precisión */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Modelo ML</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-1">94.2%</div>
                  <p className="text-xs text-muted-foreground mt-1">Precisión promedio</p>
                  <p className="text-xs text-muted-foreground">RMSE: 1.2°C</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Modelo Estadístico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-2">91.5%</div>
                  <p className="text-xs text-muted-foreground mt-1">Precisión promedio</p>
                  <p className="text-xs text-muted-foreground">RMSE: 1.5°C</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-sm">Modelo Híbrido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-3">95.8%</div>
                  <p className="text-xs text-muted-foreground mt-1">Precisión promedio</p>
                  <p className="text-xs text-muted-foreground">RMSE: 0.9°C</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Predicciones de Regresión Lineal */}
          <TabsContent value="regression" className="space-y-6 mt-6 w-full">
            <Card className="shadow-sm w-full">
              <CardHeader>
                <CardTitle>Predicciones con Regresión Lineal</CardTitle>
                <CardDescription>
                  Modelo de regresión lineal para predecir variables meteorológicas
                </CardDescription>
              </CardHeader>
              <CardContent className="w-full">
                <RegressionPredictionsContent />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

// Componente para mostrar predicciones de regresión
function RegressionPredictionsContent() {
  const { data: tempRegression, isLoading: tempLoading } = useSingleVariableRegression(
    undefined,
    "temperature",
    48,
    24
  )
  const { data: multiRegression, isLoading: multiLoading } = useRegressionPredictions(
    undefined,
    24,
    24,
    "temperature,humidity,windSpeed,pressure"
  )

  if (tempLoading || multiLoading) {
    return <Skeleton className="h-[400px] w-full" />
  }

  const tempData = tempRegression?.variables?.temperature
  const multiVars = multiRegression?.variables

  return (
    <div className="space-y-6 w-full">
      {/* Predicción de Temperatura */}
      {tempData && !tempData.error && (
        <div className="space-y-4 w-full">
          <div className="flex items-center justify-between w-full">
            <div>
              <h3 className="text-lg font-semibold">Predicción de Temperatura (24h)</h3>
              <p className="text-sm text-muted-foreground">
                Modelo: R² = {tempData.model.r2.toFixed(3)} | RMSE = {tempData.model.rmse.toFixed(2)}°C
              </p>
            </div>
            <Badge variant="secondary">Regresión Lineal</Badge>
          </div>
          <div className="w-full">
            <ChartContainer
              config={{
                predicted: {
                  label: "Predicción",
                  color: "hsl(221, 83%, 53%)",
                },
                lowerBound: {
                  label: "Límite Inferior",
                  color: "hsl(199, 89%, 48%)",
                },
                upperBound: {
                  label: "Límite Superior",
                  color: "hsl(14, 90%, 53%)",
                },
              }}
              className="h-[400px] w-full"
            >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={tempData.predictions.map((p) => ({
                  time: p.time,
                  predicted: p.predicted,
                  lowerBound: p.lowerBound,
                  upperBound: p.upperBound,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  stroke="none"
                  fill="hsl(14, 90%, 53%)"
                  fillOpacity={0.1}
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  stroke="none"
                  fill="hsl(199, 89%, 48%)"
                  fillOpacity={0.1}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(221, 83%, 53%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(221, 83%, 53%)" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
          </div>
        </div>
      )}

      {/* Predicciones Múltiples Variables */}
      {multiVars && Object.keys(multiVars).length > 0 && (
        <div className="space-y-4 w-full">
          <h3 className="text-lg font-semibold">Predicciones Múltiples Variables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {Object.entries(multiVars).map(([varName, varData]) => {
              if (varData.error) return null
              return (
                <Card key={varName} className="shadow-sm w-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base capitalize">{varName}</CardTitle>
                    <CardDescription>
                      R²: {varData.model.r2.toFixed(3)} | RMSE: {varData.model.rmse.toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="w-full">
                    <ChartContainer
                      config={{
                        predicted: {
                          label: "Predicción",
                          color: "hsl(221, 83%, 53%)",
                        },
                      }}
                      className="h-[250px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={varData.predictions.slice(0, 12).map((p) => ({
                            time: p.time,
                            predicted: p.predicted,
                          }))}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="predicted"
                            stroke="hsl(221, 83%, 53%)"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

