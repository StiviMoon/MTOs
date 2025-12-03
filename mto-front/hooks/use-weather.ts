/**
 * Hooks personalizados para consumir datos meteorológicos
 * usando TanStack Query
 */

import { useQuery } from "@tanstack/react-query"
import { weatherApi } from "@/lib/api"
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  AlertsResponse,
  PredictionsResponse,
  HistoricalResponse,
  AnalyticsResponse,
  StatisticsResponse,
  RegressionResponse,
  CorrelationMatrixResponse,
} from "@/lib/api"

const DEFAULT_LOCATION_ID = "loc_001"

// Query Keys
export const weatherKeys = {
  all: ["weather"] as const,
  locations: () => [...weatherKeys.all, "locations"] as const,
  current: (locationId: string) => [...weatherKeys.all, "current", locationId] as const,
  dailyForecast: (locationId: string, days: number) =>
    [...weatherKeys.all, "forecast", "daily", locationId, days] as const,
  hourlyForecast: (locationId: string, hours: number) =>
    [...weatherKeys.all, "forecast", "hourly", locationId, hours] as const,
  alerts: (locationId: string) => [...weatherKeys.all, "alerts", locationId] as const,
  predictions: (locationId: string, days: number, model: string) =>
    [...weatherKeys.all, "predictions", locationId, days, model] as const,
  heatmap: (locationId: string) => [...weatherKeys.all, "heatmap", locationId] as const,
  historical: (locationId: string, hours: number) =>
    [...weatherKeys.all, "historical", locationId, hours] as const,
  analytics: (locationId: string, period: string) =>
    [...weatherKeys.all, "analytics", locationId, period] as const,
  temperatureChart: (locationId: string) =>
    [...weatherKeys.all, "charts", "temperature", locationId] as const,
  precipitationChart: (locationId: string) =>
    [...weatherKeys.all, "charts", "precipitation", locationId] as const,
  windChart: (locationId: string) => [...weatherKeys.all, "charts", "wind", locationId] as const,
  pressureSolarChart: (locationId: string) =>
    [...weatherKeys.all, "charts", "pressure-solar", locationId] as const,
  airQualityChart: (locationId: string) =>
    [...weatherKeys.all, "charts", "air-quality", locationId] as const,
  radarChart: (locationId: string) =>
    [...weatherKeys.all, "charts", "radar", locationId] as const,
}

/**
 * Hook para obtener tiempo actual
 */
export const useCurrentWeather = (locationId: string = DEFAULT_LOCATION_ID) => {
  return useQuery<CurrentWeatherResponse>({
    queryKey: weatherKeys.current(locationId),
    queryFn: () => weatherApi.getCurrentWeather(locationId),
    refetchInterval: 30 * 1000, // Refetch cada 30 segundos
  })
}

/**
 * Hook para obtener pronóstico diario
 */
export const useDailyForecast = (
  locationId: string = DEFAULT_LOCATION_ID,
  days: number = 7
) => {
  return useQuery<ForecastResponse>({
    queryKey: weatherKeys.dailyForecast(locationId, days),
    queryFn: () => weatherApi.getDailyForecast(locationId, days),
    refetchInterval: 6 * 60 * 60 * 1000, // Refetch cada 6 horas
  })
}

/**
 * Hook para obtener pronóstico horario
 */
export const useHourlyForecast = (
  locationId: string = DEFAULT_LOCATION_ID,
  hours: number = 24
) => {
  return useQuery({
    queryKey: weatherKeys.hourlyForecast(locationId, hours),
    queryFn: () => weatherApi.getHourlyForecast(locationId, hours),
    refetchInterval: 60 * 60 * 1000, // Refetch cada hora
  })
}

/**
 * Hook para obtener alertas
 */
export const useAlerts = (locationId: string = DEFAULT_LOCATION_ID) => {
  return useQuery<AlertsResponse>({
    queryKey: weatherKeys.alerts(locationId),
    queryFn: () => weatherApi.getAlerts(locationId),
    refetchInterval: 5 * 60 * 1000, // Refetch cada 5 minutos
  })
}

/**
 * Hook para obtener predicciones avanzadas
 */
export const usePredictions = (
  locationId: string = DEFAULT_LOCATION_ID,
  days: number = 7,
  model: string = "hybrid"
) => {
  return useQuery<PredictionsResponse>({
    queryKey: weatherKeys.predictions(locationId, days, model),
    queryFn: () => weatherApi.getPredictions(locationId, days, model),
    refetchInterval: 12 * 60 * 60 * 1000, // Refetch cada 12 horas
  })
}

/**
 * Hook para obtener heatmap
 */
export const useHeatmap = (locationId: string = DEFAULT_LOCATION_ID) => {
  return useQuery({
    queryKey: weatherKeys.heatmap(locationId),
    queryFn: () => weatherApi.getHeatmap(locationId),
    refetchInterval: 12 * 60 * 60 * 1000, // Refetch cada 12 horas
  })
}

/**
 * Hook para obtener datos históricos
 */
export const useHistorical = (
  locationId: string = DEFAULT_LOCATION_ID,
  hours: number = 24
) => {
  return useQuery<HistoricalResponse>({
    queryKey: weatherKeys.historical(locationId, hours),
    queryFn: () => weatherApi.getHistorical(locationId, hours),
    refetchInterval: 15 * 60 * 1000, // Refetch cada 15 minutos
  })
}

/**
 * Hook para obtener análisis histórico
 */
export const useAnalytics = (
  locationId: string = DEFAULT_LOCATION_ID,
  period: string = "monthly"
) => {
  return useQuery<AnalyticsResponse>({
    queryKey: weatherKeys.analytics(locationId, period),
    queryFn: () => weatherApi.getAnalytics(locationId, period),
  })
}

/**
 * Hook para obtener datos de gráfico de temperatura
 */
export const useTemperatureChart = (locationId: string = DEFAULT_LOCATION_ID) => {
  return useQuery({
    queryKey: weatherKeys.temperatureChart(locationId),
    queryFn: () => weatherApi.getTemperatureChart(locationId),
    refetchInterval: 15 * 60 * 1000, // Refetch cada 15 minutos
  })
}

/**
 * Hook para obtener datos de gráfico de precipitación
 */
export const usePrecipitationChart = (locationId: string = DEFAULT_LOCATION_ID) => {
  return useQuery({
    queryKey: weatherKeys.precipitationChart(locationId),
    queryFn: () => weatherApi.getPrecipitationChart(locationId),
    refetchInterval: 15 * 60 * 1000,
  })
}

/**
 * Hook para obtener datos de gráfico de viento
 */
export const useWindChart = (locationId: string = DEFAULT_LOCATION_ID) => {
  return useQuery({
    queryKey: weatherKeys.windChart(locationId),
    queryFn: () => weatherApi.getWindChart(locationId),
    refetchInterval: 15 * 60 * 1000,
  })
}

/**
 * Hook para obtener datos de gráfico de presión y radiación solar
 */
export const usePressureSolarChart = (locationId: string = DEFAULT_LOCATION_ID) => {
  return useQuery({
    queryKey: weatherKeys.pressureSolarChart(locationId),
    queryFn: () => weatherApi.getPressureSolarChart(locationId),
    refetchInterval: 15 * 60 * 1000,
  })
}

/**
 * Hook para obtener datos de gráfico de calidad del aire
 */
export const useAirQualityChart = (locationId: string = DEFAULT_LOCATION_ID) => {
  return useQuery({
    queryKey: weatherKeys.airQualityChart(locationId),
    queryFn: () => weatherApi.getAirQualityChart(locationId),
    refetchInterval: 15 * 60 * 1000,
  })
}

/**
 * Hook para obtener datos de gráfico radar
 */
export const useRadarChart = (locationId: string = DEFAULT_LOCATION_ID) => {
  return useQuery({
    queryKey: weatherKeys.radarChart(locationId),
    queryFn: () => weatherApi.getRadarChart(locationId),
    refetchInterval: 15 * 60 * 1000,
  })
}

// Estadísticas Descriptivas
export const useStatistics = (
  locationId: string = DEFAULT_LOCATION_ID,
  hours: number = 168
) => {
  return useQuery({
    queryKey: ["statistics", locationId, hours],
    queryFn: () => weatherApi.getStatistics(locationId, hours),
    refetchInterval: 300000, // Refetch every 5 minutes
  })
}

// Predicciones de Regresión (múltiples variables)
export const useRegressionPredictions = (
  locationId: string = DEFAULT_LOCATION_ID,
  hours: number = 24,
  hoursAhead: number = 24,
  variables: string = "temperature,humidity,windSpeed,pressure"
) => {
  return useQuery({
    queryKey: ["regressionPredictions", locationId, hours, hoursAhead, variables],
    queryFn: () => weatherApi.getRegressionPredictions(locationId, hours, hoursAhead, variables),
    refetchInterval: 300000, // Refetch every 5 minutes
  })
}

// Predicción de Regresión para una variable específica
export const useSingleVariableRegression = (
  locationId: string = DEFAULT_LOCATION_ID,
  variable: string = "temperature",
  hours: number = 24,
  hoursAhead: number = 24
) => {
  return useQuery({
    queryKey: ["singleVariableRegression", locationId, variable, hours, hoursAhead],
    queryFn: () => weatherApi.getSingleVariableRegression(locationId, variable, hours, hoursAhead),
    refetchInterval: 300000, // Refetch every 5 minutes
  })
}

// Matriz de Correlación
export const useCorrelationMatrix = (
  locationId: string = DEFAULT_LOCATION_ID,
  hours: number = 168
) => {
  return useQuery({
    queryKey: ["correlationMatrix", locationId, hours],
    queryFn: () => weatherApi.getCorrelationMatrix(locationId, hours),
    refetchInterval: 300000, // Refetch every 5 minutes
  })
}

