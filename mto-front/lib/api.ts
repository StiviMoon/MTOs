/**
 * Cliente API para comunicación con el backend MTOs
 */

import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error("API Error:", error.response.data)
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error("Network Error:", error.request)
      return Promise.reject(new Error("Error de conexión con el servidor"))
    } else {
      // Algo más causó el error
      console.error("Error:", error.message)
      return Promise.reject(error)
    }
  }
)

// Tipos de respuesta
export interface Location {
  id: string
  name: string
  country: string
  latitude: number
  longitude: number
  timezone: string
  elevation?: number
}

export interface CurrentWeather {
  locationId: string
  timestamp: string
  temperature: {
    air: number
    feelsLike: number
    soil: number
    trend: string
    change24h: number
  }
  humidity: {
    relative: number
    dewPoint: number
    soil: number
  }
  wind: {
    speed: number
    direction: number
    gust: number
    directionName: string
  }
  pressure: {
    value: number
    trend: string
  }
  precipitation: {
    current: number
    last24h: number
    probability: number
  }
  solar: {
    radiation: number
    maxToday: number
    uvIndex: number
    uvLevel: string
  }
  visibility: number
  airQuality: {
    aqi: number
    pm25: number
    pm10: number
    co2: number
    o3: number
    level: string
  }
  conditions: {
    icon: string
    description: string
    cloudCover: number
  }
}

export interface CurrentWeatherResponse {
  location: Location
  current: CurrentWeather
  lastUpdated: string
}

export interface ForecastDay {
  date: string
  dayOfWeek: string
  temperature: {
    high: number
    low: number
    morning: number
    afternoon: number
    evening: number
    night: number
  }
  conditions: {
    icon: string
    description: string
    cloudCover: number
  }
  precipitation: {
    probability: number
    amount: number
    type: string
  }
  wind: {
    speed: number
    direction: number
    directionName: string
    gust: number
  }
  humidity: number
  uvIndex: number
}

export interface ForecastResponse {
  location: Location
  forecast: ForecastDay[]
  lastUpdated: string
}

export interface HourlyForecast {
  datetime: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: number
  precipitation: {
    probability: number
    amount: number
  }
  conditions: {
    icon: string
    description: string
  }
  uvIndex: number
}

export interface Alert {
  id: string
  type: string
  severity: string
  title: string
  description: string
  startTime: string
  endTime: string
  affectedAreas: string[]
  recommendations: string[]
  icon: string
  color: string
  isActive: boolean
  createdAt: string
}

export interface AlertsResponse {
  location: Location
  alerts: Alert[]
  lastUpdated: string
}

export interface Prediction {
  date: string
  model: string
  temperature: {
    predicted: number
    min: number
    max: number
    confidence: number
  }
  precipitation: {
    probability: number
    amount: number
    confidence: number
  }
  historical: {
    average: number
    deviation: number
  }
}

export interface PredictionsResponse {
  location: Location
  predictions: Prediction[]
  modelMetrics: {
    ml: {
      accuracy: number
      rmse: number
      mae: number
      lastUpdated: string
    }
    statistical: {
      accuracy: number
      rmse: number
      mae: number
      lastUpdated: string
    }
    hybrid: {
      accuracy: number
      rmse: number
      mae: number
      lastUpdated: string
    }
  }
  lastUpdated: string
}

export interface HistoricalDataPoint {
  timestamp: string
  time?: string
  hour?: string
  temperature: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  precipitation: number
  solarRadiation?: number
  uvIndex?: number
  pm25?: number
  pm10?: number
  co2?: number
  o3?: number
  feels?: number
  soil?: number
  soilHumidity?: number
  gust?: number
}

export interface HistoricalResponse {
  location: Location
  data: HistoricalDataPoint[]
  summary: {
    totalRecords: number
    dateRange: {
      start: string
      end: string
    }
  }
  lastUpdated: string
}

export interface AnalyticsResponse {
  location: Location
  period: string
  dateRange: {
    start: string
    end: string
  }
  temperature: {
    average: number
    max: number
    min: number
    records: Array<{
      date: string
      avg: number
      max: number
      min: number
    }>
  }
  precipitation: {
    total: number
    daysWithRain: number
    records: Array<{
      date: string
      amount: number
      days: number
    }>
  }
  wind: {
    dominantDirection: string
    averageSpeed: number
    frequency: Array<{
      direction: string
      frequency: number
      avgSpeed: number
    }>
  }
  lastUpdated: string
}

// Estadísticas Descriptivas
export interface ConfidenceInterval {
  lower: number
  upper: number
  margin: number
}

export interface VariableStatistics {
  count: number
  mean: number
  median: number
  mode: number
  stdDev: number
  variance: number
  min: number
  max: number
  range: number
  q1: number
  q2: number
  q3: number
  iqr: number
  p10: number
  p90: number
  p95: number
  p99: number
  coefficientOfVariation: number
  skewness?: number
  kurtosis?: number
  standardError?: number
  confidenceInterval95?: ConfidenceInterval
}

export interface StatisticsResponse {
  location: Location
  period: string
  dateRange: { start: string; end: string }
  statistics: Record<string, VariableStatistics>
  lastUpdated: string
}

// Regresión Lineal
export interface RegressionModel {
  type: string
  coefficient: number
  intercept: number
  r2: number
  rmse: number
  mae: number
  mse: number
}

export interface RegressionPrediction {
  timestamp: string
  time: string
  datetime: string
  predicted: number
  lowerBound: number
  upperBound: number
  confidence: number
}

export interface VariableRegressionResult {
  variable: string
  model: RegressionModel
  predictions: RegressionPrediction[]
  dataPoints: number
  hoursAhead: number
  error?: string
}

export interface RegressionResponse {
  location: Location
  variables: Record<string, VariableRegressionResult>
  lastUpdated: string
}

// Matriz de Correlación
export interface CorrelationMatrixResponse {
  location: Location
  matrix: Record<string, Record<string, number>>
  variables: string[]
  dataPoints: number
  lastUpdated: string
}

// Funciones API
export const weatherApi = {
  // Obtener ubicaciones
  getLocations: async (): Promise<{ locations: Location[] }> => {
    const response = await apiClient.get("/locations")
    return response.data
  },

  // Obtener tiempo actual
  getCurrentWeather: async (locationId: string = "loc_001"): Promise<CurrentWeatherResponse> => {
    const response = await apiClient.get(`/locations/${locationId}/current`)
    return response.data
  },

  // Obtener pronóstico diario
  getDailyForecast: async (
    locationId: string = "loc_001",
    days: number = 7
  ): Promise<ForecastResponse> => {
    const response = await apiClient.get(`/locations/${locationId}/forecast/daily`, {
      params: { days },
    })
    return response.data
  },

  // Obtener pronóstico horario
  getHourlyForecast: async (
    locationId: string = "loc_001",
    hours: number = 24
  ): Promise<{ location: Location; forecast: HourlyForecast[]; lastUpdated: string }> => {
    const response = await apiClient.get(`/locations/${locationId}/forecast/hourly`, {
      params: { hours },
    })
    return response.data
  },

  // Obtener alertas
  getAlerts: async (locationId: string = "loc_001"): Promise<AlertsResponse> => {
    const response = await apiClient.get(`/locations/${locationId}/alerts`)
    return response.data
  },

  // Obtener predicciones
  getPredictions: async (
    locationId: string = "loc_001",
    days: number = 7,
    model: string = "hybrid"
  ): Promise<PredictionsResponse> => {
    const response = await apiClient.get(`/locations/${locationId}/predictions`, {
      params: { days, model },
    })
    return response.data
  },

  // Obtener heatmap
  getHeatmap: async (locationId: string = "loc_001"): Promise<{
    location: Location
    heatmap: Array<Record<string, any>>
    lastUpdated: string
  }> => {
    const response = await apiClient.get(`/locations/${locationId}/predictions/heatmap`)
    return response.data
  },

  // Obtener datos históricos
  getHistorical: async (
    locationId: string = "loc_001",
    hours: number = 24
  ): Promise<HistoricalResponse> => {
    const response = await apiClient.get(`/locations/${locationId}/historical`, {
      params: { hours },
    })
    return response.data
  },

  // Obtener análisis
  getAnalytics: async (
    locationId: string = "loc_001",
    period: string = "monthly"
  ): Promise<AnalyticsResponse> => {
    const response = await apiClient.get(`/locations/${locationId}/analytics`, {
      params: { period },
    })
    return response.data
  },

  // Obtener datos para gráficos
  getTemperatureChart: async (locationId: string = "loc_001"): Promise<{
    data: Array<{ time: string; temp: number; feels: number; soil: number }>
    lastUpdated: string
  }> => {
    const response = await apiClient.get(`/locations/${locationId}/charts/temperature`)
    return response.data
  },

  getPrecipitationChart: async (locationId: string = "loc_001"): Promise<{
    data: Array<{ hour: string; precipitation: number; humidity: number; soilHumidity: number }>
    lastUpdated: string
  }> => {
    const response = await apiClient.get(`/locations/${locationId}/charts/precipitation`)
    return response.data
  },

  getWindChart: async (locationId: string = "loc_001"): Promise<{
    data: Array<{ time: string; speed: number; gust: number; direction: number }>
    lastUpdated: string
  }> => {
    const response = await apiClient.get(`/locations/${locationId}/charts/wind`)
    return response.data
  },

  getPressureSolarChart: async (locationId: string = "loc_001"): Promise<{
    data: Array<{ time: string; pressure: number; solar: number; uv: number }>
    lastUpdated: string
  }> => {
    const response = await apiClient.get(`/locations/${locationId}/charts/pressure-solar`)
    return response.data
  },

  getAirQualityChart: async (locationId: string = "loc_001"): Promise<{
    data: Array<{ time: string; pm25: number; pm10: number; co2: number; o3: number }>
    lastUpdated: string
  }> => {
    const response = await apiClient.get(`/locations/${locationId}/charts/air-quality`)
    return response.data
  },

  getRadarChart: async (locationId: string = "loc_001"): Promise<{
    data: Array<{ metric: string; value: number }>
    lastUpdated: string
  }> => {
    const response = await apiClient.get(`/locations/${locationId}/charts/radar`)
    return response.data
  },

  // Obtener estadísticas descriptivas
  getStatistics: async (
    locationId: string = "loc_001",
    hours: number = 168
  ): Promise<StatisticsResponse> => {
    const response = await apiClient.get(`/locations/${locationId}/statistics`, {
      params: { hours },
    })
    return response.data
  },

  // Obtener predicciones de regresión (múltiples variables)
  getRegressionPredictions: async (
    locationId: string = "loc_001",
    hours: number = 24,
    hoursAhead: number = 24,
    variables: string = "temperature,humidity,windSpeed,pressure"
  ): Promise<RegressionResponse> => {
    const response = await apiClient.get(`/locations/${locationId}/predictions/regression`, {
      params: { hours, hours_ahead: hoursAhead, variables },
    })
    return response.data
  },

  // Obtener predicción de regresión para una variable específica
  getSingleVariableRegression: async (
    locationId: string = "loc_001",
    variable: string = "temperature",
    hours: number = 24,
    hoursAhead: number = 24
  ): Promise<RegressionResponse> => {
    const response = await apiClient.get(
      `/locations/${locationId}/predictions/regression/${variable}`,
      {
        params: { hours, hours_ahead: hoursAhead },
      }
    )
    return response.data
  },

  // Obtener matriz de correlación
  getCorrelationMatrix: async (
    locationId: string = "loc_001",
    hours: number = 168
  ): Promise<CorrelationMatrixResponse> => {
    const response = await apiClient.get(`/locations/${locationId}/correlation`, {
      params: { hours },
    })
    return response.data
  },
}

