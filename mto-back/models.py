"""
Modelos Pydantic para validación de datos
"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class Location(BaseModel):
    id: str
    name: str
    country: str
    latitude: float
    longitude: float
    timezone: str
    elevation: Optional[int] = None


class Temperature(BaseModel):
    air: float
    feelsLike: float
    soil: float
    trend: str
    change24h: float


class Humidity(BaseModel):
    relative: float
    dewPoint: float
    soil: float


class Wind(BaseModel):
    speed: float
    direction: int
    gust: float
    directionName: str


class Pressure(BaseModel):
    value: float
    trend: str


class Precipitation(BaseModel):
    current: float
    last24h: float
    probability: float


class Solar(BaseModel):
    radiation: float
    maxToday: float
    uvIndex: int
    uvLevel: str


class AirQuality(BaseModel):
    aqi: int
    pm25: float
    pm10: float
    co2: int
    o3: float
    level: str


class Conditions(BaseModel):
    icon: str
    description: str
    cloudCover: float


class CurrentWeather(BaseModel):
    locationId: str
    timestamp: str
    temperature: Temperature
    humidity: Humidity
    wind: Wind
    pressure: Pressure
    precipitation: Precipitation
    solar: Solar
    visibility: float
    airQuality: AirQuality
    conditions: Conditions


class CurrentWeatherResponse(BaseModel):
    location: Location
    current: CurrentWeather
    lastUpdated: str


class ForecastDay(BaseModel):
    date: str
    dayOfWeek: str
    temperature: Dict[str, float]
    conditions: Dict[str, Any]
    precipitation: Dict[str, Any]
    wind: Dict[str, Any]
    humidity: float
    uvIndex: int


class ForecastResponse(BaseModel):
    location: Location
    forecast: List[ForecastDay]
    lastUpdated: str


class Alert(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    description: str
    startTime: str
    endTime: str
    affectedAreas: List[str]
    recommendations: List[str]
    icon: str
    color: str
    isActive: bool
    createdAt: str


class AlertsResponse(BaseModel):
    location: Location
    alerts: List[Alert]
    lastUpdated: str


class Prediction(BaseModel):
    date: str
    model: str
    temperature: Dict[str, Any]
    precipitation: Dict[str, Any]
    historical: Dict[str, float]


class PredictionsResponse(BaseModel):
    location: Location
    predictions: List[Prediction]
    modelMetrics: Dict[str, Any]
    lastUpdated: str


class HistoricalDataPoint(BaseModel):
    timestamp: str
    time: Optional[str] = None
    hour: Optional[str] = None
    temperature: float
    humidity: float
    windSpeed: float
    windDirection: int
    pressure: float
    precipitation: float
    solarRadiation: Optional[float] = None
    uvIndex: Optional[int] = None
    pm25: Optional[float] = None
    pm10: Optional[float] = None
    co2: Optional[int] = None
    o3: Optional[float] = None
    feels: Optional[float] = None
    soil: Optional[float] = None
    soilHumidity: Optional[float] = None
    gust: Optional[float] = None


class HistoricalResponse(BaseModel):
    location: Location
    data: List[HistoricalDataPoint]
    summary: Dict[str, Any]
    lastUpdated: str


class AnalyticsResponse(BaseModel):
    location: Location
    period: str
    dateRange: Dict[str, str]
    temperature: Dict[str, Any]
    precipitation: Dict[str, Any]
    wind: Dict[str, Any]
    lastUpdated: str


class ConfidenceInterval(BaseModel):
    lower: float
    upper: float
    margin: float


class VariableStatistics(BaseModel):
    count: int
    mean: float
    median: float
    mode: float
    stdDev: float
    variance: float
    min: float
    max: float
    range: float
    q1: float
    q2: float
    q3: float
    iqr: float
    p10: float
    p90: float
    p95: float
    p99: float
    coefficientOfVariation: float
    skewness: Optional[float] = None
    kurtosis: Optional[float] = None
    standardError: Optional[float] = None
    confidenceInterval95: Optional[ConfidenceInterval] = None


class StatisticsResponse(BaseModel):
    location: Location
    period: str
    dateRange: Dict[str, str]
    statistics: Dict[str, VariableStatistics]
    lastUpdated: str


class RegressionModel(BaseModel):
    type: str
    coefficient: float
    intercept: float
    r2: float
    rmse: float
    mae: float
    mse: float


class RegressionPrediction(BaseModel):
    timestamp: str
    time: str
    datetime: str
    predicted: float
    lowerBound: float
    upperBound: float
    confidence: int


class VariableRegressionResult(BaseModel):
    variable: str
    model: RegressionModel
    predictions: List[RegressionPrediction]
    dataPoints: int
    hoursAhead: int
    error: Optional[str] = None


class RegressionResponse(BaseModel):
    location: Location
    variables: Dict[str, VariableRegressionResult]
    lastUpdated: str


class CorrelationMatrixResponse(BaseModel):
    location: Location
    matrix: Dict[str, Dict[str, float]]
    variables: List[str]
    dataPoints: int
    lastUpdated: str

