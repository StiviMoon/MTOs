"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useTemperatureChart,
  usePrecipitationChart,
  useWindChart,
  usePressureSolarChart,
  useAirQualityChart,
  useRadarChart,
} from "@/hooks/use-weather"

export function WeatherChartsGrid() {
  const { data: tempData, isLoading: tempLoading } = useTemperatureChart()
  const { data: precipData, isLoading: precipLoading } = usePrecipitationChart()
  const { data: windData, isLoading: windLoading } = useWindChart()
  const { data: pressureData, isLoading: pressureLoading } = usePressureSolarChart()
  const { data: airQualityData, isLoading: airQualityLoading } = useAirQualityChart()
  const { data: radarData, isLoading: radarLoading } = useRadarChart()

  const isLoading = tempLoading || precipLoading || windLoading || pressureLoading || airQualityLoading || radarLoading

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const temperatureData = tempData?.data || []
  const precipitationAndHumidityData = precipData?.data || []
  const windChartData = windData?.data || []
  const pressureAndSolarData = pressureData?.data || []
  const airQualityChartData = airQualityData?.data || []
  const radarChartData = radarData?.data || []
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Temperature Chart */}
      <Card className="shadow-sm w-full">
        <CardHeader>
          <CardTitle>Temperatura - Aire y Suelo</CardTitle>
          <CardDescription>Temperatura del aire, sensación térmica y temperatura del suelo</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <ChartContainer
            config={{
              temp: {
                label: "Aire",
                color: "hsl(221, 83%, 53%)", // Azul vibrante
              },
              feels: {
                label: "Sensación",
                color: "hsl(0, 84%, 60%)", // Rojo coral
              },
              soil: {
                label: "Suelo",
                color: "hsl(142, 76%, 36%)", // Verde esmeralda
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData.length > 0 ? temperatureData : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="temp"
                  stroke="hsl(221, 83%, 53%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(221, 83%, 53%)" }}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="feels"
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(0, 84%, 60%)" }}
                  strokeDasharray="5 5"
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="soil"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(142, 76%, 36%)" }}
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Precipitation and Humidity Chart */}
      <Card className="shadow-sm w-full">
        <CardHeader>
          <CardTitle>Precipitación y Humedad</CardTitle>
          <CardDescription>Lluvia acumulada, humedad del aire y del suelo</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <ChartContainer
            config={{
              precipitation: {
                label: "Precipitación (mm)",
                color: "hsl(199, 89%, 48%)", // Azul cielo
              },
              humidity: {
                label: "Humedad Aire (%)",
                color: "hsl(271, 81%, 56%)", // Púrpura vibrante
              },
              soilHumidity: {
                label: "Humedad Suelo (%)",
                color: "hsl(45, 93%, 47%)", // Amarillo dorado
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={precipitationAndHumidityData.length > 0 ? precipitationAndHumidityData : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="precipitation"
                  fill="hsl(199, 89%, 48%)"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="hsl(271, 81%, 56%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(271, 81%, 56%)" }}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="soilHumidity"
                  stroke="hsl(45, 93%, 47%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(45, 93%, 47%)" }}
                  strokeDasharray="5 5"
                  isAnimationActive={true}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Wind Speed Chart */}
      <Card className="shadow-sm w-full">
        <CardHeader>
          <CardTitle>Velocidad y Dirección del Viento</CardTitle>
          <CardDescription>Velocidad promedio, ráfagas máximas y dirección</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <ChartContainer
            config={{
              speed: {
                label: "Velocidad (km/h)",
                color: "hsl(195, 85%, 41%)", // Azul turquesa
              },
              gust: {
                label: "Ráfagas (km/h)",
                color: "hsl(14, 90%, 53%)", // Naranja vibrante
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={windChartData.length > 0 ? windChartData : []}>
                <defs>
                  <linearGradient id="gustGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(14, 90%, 53%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(14, 90%, 53%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="gust"
                  stroke="hsl(14, 90%, 53%)"
                  fill="url(#gustGradient)"
                  strokeWidth={3}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Line
                  type="monotone"
                  dataKey="speed"
                  stroke="hsl(195, 85%, 41%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(195, 85%, 41%)" }}
                  isAnimationActive={true}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Pressure, Solar Radiation, UV Chart */}
      <Card className="shadow-sm w-full">
        <CardHeader>
          <CardTitle>Presión, Radiación Solar e Índice UV</CardTitle>
          <CardDescription>Presión atmosférica, radiación solar y nivel UV</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <ChartContainer
            config={{
              pressure: {
                label: "Presión (hPa)",
                color: "hsl(262, 83%, 58%)", // Púrpura intenso
              },
              solar: {
                label: "Radiación (W/m²)",
                color: "hsl(38, 92%, 50%)", // Amarillo sol
              },
              uv: {
                label: "Índice UV",
                color: "hsl(340, 75%, 55%)", // Rosa fucsia
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={pressureAndSolarData.length > 0 ? pressureAndSolarData : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="pressure"
                  stroke="hsl(262, 83%, 58%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(262, 83%, 58%)" }}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="solar"
                  stroke="hsl(38, 92%, 50%)"
                  fill="hsl(38, 92%, 50%)"
                  fillOpacity={0.3}
                  strokeWidth={3}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="uv"
                  stroke="hsl(340, 75%, 55%)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "hsl(340, 75%, 55%)" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Air Quality Chart */}
      <Card className="shadow-sm w-full">
        <CardHeader>
          <CardTitle>Calidad del Aire</CardTitle>
          <CardDescription>PM2.5, PM10, CO₂ y O₃ en tiempo real</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <ChartContainer
            config={{
              pm25: {
                label: "PM2.5 (μg/m³)",
                color: "hsl(0, 72%, 51%)", // Rojo intenso
              },
              pm10: {
                label: "PM10 (μg/m³)",
                color: "hsl(25, 95%, 53%)", // Naranja brillante
              },
              co2: {
                label: "CO₂ (ppm)",
                color: "hsl(173, 80%, 40%)", // Verde azulado
              },
              o3: {
                label: "O₃ (ppb)",
                color: "hsl(280, 100%, 70%)", // Púrpura claro
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={airQualityChartData.length > 0 ? airQualityChartData : []}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="pm25" stroke="hsl(0, 72%, 51%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(0, 72%, 51%)" }} />
                <Line type="monotone" dataKey="pm10" stroke="hsl(25, 95%, 53%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(25, 95%, 53%)" }} />
                <Line type="monotone" dataKey="co2" stroke="hsl(173, 80%, 40%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(173, 80%, 40%)" }} />
                <Line type="monotone" dataKey="o3" stroke="hsl(280, 100%, 70%)" strokeWidth={3} dot={{ r: 4, fill: "hsl(280, 100%, 70%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Radar Chart - Overall Conditions */}
      <Card className="shadow-sm w-full">
        <CardHeader>
          <CardTitle>Condiciones Generales</CardTitle>
          <CardDescription>Vista radar de todas las variables meteorológicas</CardDescription>
        </CardHeader>
        <CardContent className="w-full">
          <ChartContainer
            config={{
              value: {
                label: "Valor",
                color: "hsl(201, 96%, 32%)", // Azul profundo
              },
            }}
            className="h-[350px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarChartData.length > 0 ? radarChartData : []}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Radar
                  name="Condiciones"
                  dataKey="value"
                  stroke="hsl(201, 96%, 32%)"
                  fill="hsl(201, 96%, 32%)"
                  fillOpacity={0.4}
                  strokeWidth={3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
