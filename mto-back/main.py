"""
Backend MTOs - FastAPI
Sistema de simulación meteorológica con API REST
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List
import json
import random

from sensors import WeatherSimulator
from statistics import DescriptiveStatistics, LinearRegressionPredictor, CorrelationAnalysis
from models import (
    CurrentWeatherResponse,
    ForecastResponse,
    AlertsResponse,
    PredictionsResponse,
    HistoricalResponse,
    AnalyticsResponse,
    StatisticsResponse,
    RegressionResponse,
    CorrelationMatrixResponse,
    Location
)

# Estado global
weather_state: Dict = {}
simulator = WeatherSimulator(base_temp=24.0, base_humidity=68.0)
active_connections: List[WebSocket] = []

# Ubicación por defecto
DEFAULT_LOCATION = Location(
    id="loc_001",
    name="Yumbo",
    country="Colombia",
    latitude=3.5570,
    longitude=-74.7812,
    timezone="America/Bogota",
    elevation=2500
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestiona el ciclo de vida de la aplicación"""
    # Inicialización
    print("🚀 Iniciando backend MTOs...")
    update_weather_state()
    
    # Iniciar tarea de actualización automática
    task = asyncio.create_task(periodic_update())
    
    yield
    
    # Limpieza
    print("🛑 Deteniendo backend MTOs...")
    task.cancel()


app = FastAPI(
    title="MTOs API",
    description="API de simulación meteorológica",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def update_weather_state():
    """Actualiza el estado global con nuevos datos simulados"""
    global weather_state
    
    current = simulator.generate_current_weather()
    weather_state = {
        "location": DEFAULT_LOCATION.dict(),
        "current": {
            "locationId": DEFAULT_LOCATION.id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            **current
        },
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


async def periodic_update():
    """Tarea periódica que actualiza los datos cada 30 segundos"""
    while True:
        try:
            await asyncio.sleep(30)  # Actualizar cada 30 segundos
            update_weather_state()
            
            # Notificar clientes WebSocket
            if active_connections:
                message = {
                    "type": "current_weather_update",
                    "locationId": DEFAULT_LOCATION.id,
                    "data": weather_state["current"],
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                }
                disconnected = []
                for connection in active_connections:
                    try:
                        await connection.send_json(message)
                    except:
                        disconnected.append(connection)
                
                # Remover conexiones desconectadas
                for conn in disconnected:
                    active_connections.remove(conn)
                    
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"Error en actualización periódica: {e}")


# ==================== ENDPOINTS ====================

@app.get("/")
async def root():
    """Endpoint raíz"""
    return {
        "message": "MTOs API - Sistema de Simulación Meteorológica",
        "version": "1.0.0",
        "endpoints": {
            "current": "/api/v1/locations/loc_001/current",
            "forecast": "/api/v1/locations/loc_001/forecast/daily",
            "alerts": "/api/v1/locations/loc_001/alerts",
            "predictions": "/api/v1/locations/loc_001/predictions",
            "historical": "/api/v1/locations/loc_001/historical",
            "analytics": "/api/v1/locations/loc_001/analytics",
            "statistics": "/api/v1/locations/loc_001/statistics?hours=168",
            "regression": "/api/v1/locations/loc_001/predictions/regression?hours=24&hours_ahead=24",
            "correlation": "/api/v1/locations/loc_001/correlation?hours=168"
        }
    }


@app.get("/api/v1/locations")
async def get_locations():
    """Obtener todas las ubicaciones disponibles"""
    return {
        "locations": [DEFAULT_LOCATION.dict()]
    }


@app.get("/api/v1/locations/{location_id}/current", response_model=CurrentWeatherResponse)
async def get_current_weather(location_id: str):
    """Obtener condiciones meteorológicas actuales"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    return CurrentWeatherResponse(**weather_state)


@app.get("/api/v1/locations/{location_id}/forecast/daily", response_model=ForecastResponse)
async def get_daily_forecast(location_id: str, days: int = 7):
    """Obtener pronóstico diario"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    forecast = simulator.generate_daily_forecast(days=days)
    
    return ForecastResponse(
        location=DEFAULT_LOCATION,
        forecast=forecast,
        lastUpdated=datetime.utcnow().isoformat() + "Z"
    )


@app.get("/api/v1/locations/{location_id}/forecast/hourly")
async def get_hourly_forecast(location_id: str, hours: int = 24):
    """Obtener pronóstico horario"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    forecast = simulator.generate_hourly_forecast(hours=hours)
    
    return {
        "location": DEFAULT_LOCATION.dict(),
        "forecast": forecast,
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/api/v1/locations/{location_id}/alerts", response_model=AlertsResponse)
async def get_alerts(location_id: str):
    """Obtener alertas meteorológicas activas"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    alerts = simulator.generate_alerts()
    
    return AlertsResponse(
        location=DEFAULT_LOCATION,
        alerts=alerts,
        lastUpdated=datetime.utcnow().isoformat() + "Z"
    )


@app.get("/api/v1/locations/{location_id}/predictions")
async def get_predictions(location_id: str, days: int = 7, model: str = "hybrid"):
    """Obtener predicciones avanzadas con modelos ML"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    predictions = simulator.generate_predictions(days=days)
    
    model_metrics = {
        "ml": {
            "accuracy": 94.2,
            "rmse": 1.2,
            "mae": 0.9,
            "lastUpdated": datetime.utcnow().isoformat() + "Z"
        },
        "statistical": {
            "accuracy": 91.5,
            "rmse": 1.5,
            "mae": 1.2,
            "lastUpdated": datetime.utcnow().isoformat() + "Z"
        },
        "hybrid": {
            "accuracy": 95.8,
            "rmse": 0.9,
            "mae": 0.7,
            "lastUpdated": datetime.utcnow().isoformat() + "Z"
        }
    }
    
    return {
        "location": DEFAULT_LOCATION.dict(),
        "predictions": predictions,
        "modelMetrics": model_metrics,
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/api/v1/locations/{location_id}/predictions/heatmap")
async def get_heatmap(location_id: str):
    """Obtener heatmap de temperatura para la próxima semana"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    # Generar heatmap simplificado
    hours = ["00h", "06h", "12h", "18h"]
    days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    heatmap = []
    
    for hour in hours:
        row = {"hour": hour}
        for day in days:
            temp = simulator.base_temp + random.uniform(-3, 5)
            row[day] = round(temp, 1)
        heatmap.append(row)
    
    return {
        "location": DEFAULT_LOCATION.dict(),
        "heatmap": heatmap,
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/api/v1/locations/{location_id}/historical", response_model=HistoricalResponse)
async def get_historical_data(
    location_id: str,
    startDate: str = None,
    endDate: str = None,
    interval: str = "hourly",
    hours: int = 24
):
    """Obtener datos históricos"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    data = simulator.generate_historical_data(hours=hours)
    
    return HistoricalResponse(
        location=DEFAULT_LOCATION,
        data=data,
        summary={
            "totalRecords": len(data),
            "dateRange": {
                "start": data[0]["timestamp"] if data else None,
                "end": data[-1]["timestamp"] if data else None
            }
        },
        lastUpdated=datetime.utcnow().isoformat() + "Z"
    )


@app.get("/api/v1/locations/{location_id}/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    location_id: str,
    period: str = "monthly",
    startDate: str = None,
    endDate: str = None
):
    """Obtener análisis histórico y estadísticas"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    analytics = simulator.generate_analytics(months=6)
    
    now = datetime.utcnow()
    start = (now - timedelta(days=180)).strftime("%Y-%m-%d")
    end = now.strftime("%Y-%m-%d")
    
    return AnalyticsResponse(
        location=DEFAULT_LOCATION,
        period=period,
        dateRange={"start": start, "end": end},
        temperature=analytics["temperature"],
        precipitation=analytics["precipitation"],
        wind=analytics["wind"],
        lastUpdated=datetime.utcnow().isoformat() + "Z"
    )


# ==================== ENDPOINTS PARA GRÁFICOS ====================

@app.get("/api/v1/locations/{location_id}/charts/temperature")
async def get_temperature_chart(location_id: str):
    """Datos para gráfico de temperatura (24h)"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    historical = simulator.generate_historical_data(hours=24)
    data = [
        {
            "time": point["time"],
            "temp": point["temperature"],
            "feels": point["feels"],
            "soil": point["soil"]
        }
        for point in historical
    ]
    
    return {
        "data": data,
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/api/v1/locations/{location_id}/charts/precipitation")
async def get_precipitation_chart(location_id: str):
    """Datos para gráfico de precipitación y humedad"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    historical = simulator.generate_historical_data(hours=24)
    data = [
        {
            "hour": point["hour"],
            "precipitation": point["precipitation"],
            "humidity": point["humidity"],
            "soilHumidity": point["soilHumidity"]
        }
        for point in historical
    ]
    
    return {
        "data": data,
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/api/v1/locations/{location_id}/charts/wind")
async def get_wind_chart(location_id: str):
    """Datos para gráfico de viento"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    historical = simulator.generate_historical_data(hours=24)
    data = [
        {
            "time": point["time"],
            "speed": point["windSpeed"],
            "gust": point["gust"],
            "direction": point["windDirection"]
        }
        for point in historical
    ]
    
    return {
        "data": data,
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/api/v1/locations/{location_id}/charts/pressure-solar")
async def get_pressure_solar_chart(location_id: str):
    """Datos para gráfico de presión y radiación solar"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    historical = simulator.generate_historical_data(hours=24)
    data = [
        {
            "time": point["time"],
            "pressure": point["pressure"],
            "solar": point["solarRadiation"],
            "uv": point["uvIndex"]
        }
        for point in historical
    ]
    
    return {
        "data": data,
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/api/v1/locations/{location_id}/charts/air-quality")
async def get_air_quality_chart(location_id: str):
    """Datos para gráfico de calidad del aire"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    historical = simulator.generate_historical_data(hours=24)
    data = [
        {
            "time": point["time"],
            "pm25": point["pm25"],
            "pm10": point["pm10"],
            "co2": point["co2"],
            "o3": point["o3"]
        }
        for point in historical
    ]
    
    return {
        "data": data,
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


@app.get("/api/v1/locations/{location_id}/charts/radar")
async def get_radar_chart(location_id: str):
    """Datos para gráfico radar (condiciones generales)"""
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    current = weather_state.get("current", {})
    temp = current.get("temperature", {}).get("air", 24)
    humidity = current.get("humidity", {}).get("relative", 68)
    wind = current.get("wind", {}).get("speed", 18)
    pressure = current.get("pressure", {}).get("value", 1015)
    uv = current.get("solar", {}).get("uvIndex", 8)
    aqi = current.get("airQuality", {}).get("aqi", 42)
    
    # Normalizar valores a escala 0-100
    data = [
        {"metric": "Temperatura", "value": min(100, int((temp / 35) * 100))},
        {"metric": "Humedad", "value": int(humidity)},
        {"metric": "Viento", "value": min(100, int((wind / 30) * 100))},
        {"metric": "Presión", "value": min(100, int(((pressure - 980) / 40) * 100))},
        {"metric": "UV", "value": min(100, int((uv / 11) * 100))},
        {"metric": "Calidad Aire", "value": min(100, int((100 - aqi) / 100 * 100))}
    ]
    
    return {
        "data": data,
        "lastUpdated": datetime.utcnow().isoformat() + "Z"
    }


# ==================== ESTADÍSTICAS Y REGRESIÓN ====================

@app.get("/api/v1/locations/{location_id}/statistics", response_model=StatisticsResponse)
async def get_statistics(
    location_id: str,
    hours: int = 168  # Por defecto 7 días (168 horas)
):
    """
    Obtener estadísticas descriptivas de los datos meteorológicos
    
    - **location_id**: ID de la ubicación
    - **hours**: Período histórico en horas (mínimo: 2, máximo: 720, default: 168 = 7 días)
    
    Retorna estadísticas descriptivas completas incluyendo:
    - Medidas de tendencia central (media, mediana, moda)
    - Medidas de dispersión (desviación estándar, varianza, rango)
    - Cuartiles y percentiles
    - Estadísticas avanzadas (asimetría, curtosis, intervalos de confianza)
    """
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    # Validar parámetros
    if hours < 2:
        raise HTTPException(status_code=400, detail="El período mínimo es de 2 horas")
    if hours > 720:
        raise HTTPException(status_code=400, detail="El período máximo es de 720 horas (30 días)")
    
    # Generar datos históricos
    historical_data = simulator.generate_historical_data(hours=hours)
    
    if not historical_data:
        raise HTTPException(status_code=400, detail="No hay datos históricos disponibles")
    
    # Calcular estadísticas
    stats = DescriptiveStatistics.calculate_weather_statistics(historical_data)
    
    # Convertir a formato de respuesta
    statistics_dict = {}
    for var_name, var_stats in stats.items():
        from models import VariableStatistics, ConfidenceInterval
        
        ci_data = var_stats.get("confidenceInterval95", {})
        ci = None
        if ci_data:
            ci = ConfidenceInterval(
                lower=ci_data.get("lower", 0),
                upper=ci_data.get("upper", 0),
                margin=ci_data.get("margin", 0)
            )
        
        statistics_dict[var_name] = VariableStatistics(
            count=var_stats.get("count", 0),
            mean=var_stats.get("mean", 0),
            median=var_stats.get("median", 0),
            mode=var_stats.get("mode", 0),
            stdDev=var_stats.get("stdDev", 0),
            variance=var_stats.get("variance", 0),
            min=var_stats.get("min", 0),
            max=var_stats.get("max", 0),
            range=var_stats.get("range", 0),
            q1=var_stats.get("q1", 0),
            q2=var_stats.get("q2", 0),
            q3=var_stats.get("q3", 0),
            iqr=var_stats.get("iqr", 0),
            p10=var_stats.get("p10", 0),
            p90=var_stats.get("p90", 0),
            p95=var_stats.get("p95", 0),
            p99=var_stats.get("p99", 0),
            coefficientOfVariation=var_stats.get("coefficientOfVariation", 0),
            skewness=var_stats.get("skewness"),
            kurtosis=var_stats.get("kurtosis"),
            standardError=var_stats.get("standardError"),
            confidenceInterval95=ci
        )
    
    now = datetime.utcnow()
    start_date = (now - timedelta(hours=hours)).strftime("%Y-%m-%d")
    end_date = now.strftime("%Y-%m-%d")
    
    return StatisticsResponse(
        location=DEFAULT_LOCATION,
        period=f"{hours}h",
        dateRange={"start": start_date, "end": end_date},
        statistics=statistics_dict,
        lastUpdated=datetime.utcnow().isoformat() + "Z"
    )


@app.get("/api/v1/locations/{location_id}/predictions/regression", response_model=RegressionResponse)
async def get_regression_predictions(
    location_id: str,
    hours: int = 24,
    hours_ahead: int = 24,
    variables: str = "temperature,humidity,windSpeed,pressure"
):
    """
    Obtener predicciones usando regresión lineal para múltiples variables
    
    - **location_id**: ID de la ubicación
    - **hours**: Datos históricos a usar para entrenar el modelo (mínimo: 2, máximo: 168, default: 24)
    - **hours_ahead**: Horas futuras a predecir (mínimo: 1, máximo: 72, default: 24)
    - **variables**: Variables a predecir separadas por coma (temperature, humidity, windSpeed, pressure, precipitation)
    
    Retorna predicciones con:
    - Valores predichos para cada hora futura
    - Intervalos de confianza al 95%
    - Métricas del modelo (R², RMSE, MAE, MSE)
    """
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    # Validar parámetros
    if hours < 2:
        raise HTTPException(status_code=400, detail="Se requieren al menos 2 horas de datos históricos")
    if hours > 168:
        raise HTTPException(status_code=400, detail="El máximo de horas históricas es 168 (7 días)")
    if hours_ahead < 1:
        raise HTTPException(status_code=400, detail="Debe predecir al menos 1 hora adelante")
    if hours_ahead > 72:
        raise HTTPException(status_code=400, detail="El máximo de horas a predecir es 72 (3 días)")
    
    # Generar datos históricos
    historical_data = simulator.generate_historical_data(hours=hours)
    
    if not historical_data or len(historical_data) < 2:
        raise HTTPException(status_code=400, detail="Datos insuficientes para realizar predicción")
    
    # Parsear variables y validar
    variable_list = [v.strip() for v in variables.split(",") if v.strip()]
    valid_variables = ["temperature", "humidity", "windSpeed", "pressure", "precipitation", "solarRadiation", "uvIndex"]
    invalid_vars = [v for v in variable_list if v not in valid_variables]
    if invalid_vars:
        raise HTTPException(
            status_code=400,
            detail=f"Variables inválidas: {', '.join(invalid_vars)}. Variables válidas: {', '.join(valid_variables)}"
        )
    
    if not variable_list:
        raise HTTPException(status_code=400, detail="Debe especificar al menos una variable")
    
    # Realizar predicciones para cada variable
    predictions = LinearRegressionPredictor.predict_multiple_variables(
        historical_data,
        variable_list,
        hours_ahead
    )
    
    # Convertir a formato de respuesta
    from models import VariableRegressionResult, RegressionModel, RegressionPrediction
    
    variables_dict = {}
    for var_name, pred_result in predictions.items():
        if "error" in pred_result:
            variables_dict[var_name] = VariableRegressionResult(
                variable=var_name,
                model=RegressionModel(
                    type="linear_regression",
                    coefficient=0,
                    intercept=0,
                    r2=0,
                    rmse=0,
                    mae=0,
                    mse=0
                ),
                predictions=[],
                dataPoints=0,
                hoursAhead=hours_ahead,
                error=pred_result.get("error")
            )
        else:
            model_data = pred_result.get("model", {})
            variables_dict[var_name] = VariableRegressionResult(
                variable=var_name,
                model=RegressionModel(
                    type=model_data.get("type", "linear_regression"),
                    coefficient=model_data.get("coefficient", 0),
                    intercept=model_data.get("intercept", 0),
                    r2=model_data.get("r2", 0),
                    rmse=model_data.get("rmse", 0),
                    mae=model_data.get("mae", 0),
                    mse=model_data.get("mse", 0)
                ),
                predictions=[
                    RegressionPrediction(**pred) for pred in pred_result.get("predictions", [])
                ],
                dataPoints=pred_result.get("dataPoints", 0),
                hoursAhead=pred_result.get("hoursAhead", hours_ahead)
            )
    
    return RegressionResponse(
        location=DEFAULT_LOCATION,
        variables=variables_dict,
        lastUpdated=datetime.utcnow().isoformat() + "Z"
    )


@app.get("/api/v1/locations/{location_id}/predictions/regression/{variable}", response_model=RegressionResponse)
async def get_single_variable_regression(
    location_id: str,
    variable: str,
    hours: int = 24,
    hours_ahead: int = 24
):
    """
    Obtener predicción de regresión lineal para una variable específica
    
    - **location_id**: ID de la ubicación
    - **variable**: Variable a predecir (temperature, humidity, windSpeed, pressure, precipitation, etc.)
    - **hours**: Datos históricos a usar (mínimo: 2, máximo: 168, default: 24)
    - **hours_ahead**: Horas futuras a predecir (mínimo: 1, máximo: 72, default: 24)
    """
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    # Validar variable
    valid_variables = ["temperature", "humidity", "windSpeed", "pressure", "precipitation", "solarRadiation", "uvIndex", "pm25", "pm10"]
    if variable not in valid_variables:
        raise HTTPException(
            status_code=400,
            detail=f"Variable inválida: {variable}. Variables válidas: {', '.join(valid_variables)}"
        )
    
    # Validar parámetros
    if hours < 2:
        raise HTTPException(status_code=400, detail="Se requieren al menos 2 horas de datos históricos")
    if hours > 168:
        raise HTTPException(status_code=400, detail="El máximo de horas históricas es 168 (7 días)")
    if hours_ahead < 1:
        raise HTTPException(status_code=400, detail="Debe predecir al menos 1 hora adelante")
    if hours_ahead > 72:
        raise HTTPException(status_code=400, detail="El máximo de horas a predecir es 72 (3 días)")
    
    # Generar datos históricos
    historical_data = simulator.generate_historical_data(hours=hours)
    
    if not historical_data or len(historical_data) < 2:
        raise HTTPException(status_code=400, detail="Datos insuficientes para realizar predicción")
    
    # Realizar predicción
    prediction = LinearRegressionPredictor.predict_future(
        historical_data,
        variable,
        hours_ahead
    )
    
    # Convertir a formato de respuesta
    from models import VariableRegressionResult, RegressionModel, RegressionPrediction
    
    if "error" in prediction:
        variables_dict = {
            variable: VariableRegressionResult(
                variable=variable,
                model=RegressionModel(
                    type="linear_regression",
                    coefficient=0,
                    intercept=0,
                    r2=0,
                    rmse=0,
                    mae=0,
                    mse=0
                ),
                predictions=[],
                dataPoints=0,
                hoursAhead=hours_ahead,
                error=prediction.get("error")
            )
        }
    else:
        model_data = prediction.get("model", {})
        variables_dict = {
            variable: VariableRegressionResult(
                variable=variable,
                model=RegressionModel(
                    type=model_data.get("type", "linear_regression"),
                    coefficient=model_data.get("coefficient", 0),
                    intercept=model_data.get("intercept", 0),
                    r2=model_data.get("r2", 0),
                    rmse=model_data.get("rmse", 0),
                    mae=model_data.get("mae", 0),
                    mse=model_data.get("mse", 0)
                ),
                predictions=[
                    RegressionPrediction(**pred) for pred in prediction.get("predictions", [])
                ],
                dataPoints=prediction.get("dataPoints", 0),
                hoursAhead=prediction.get("hoursAhead", hours_ahead)
            )
        }
    
    return RegressionResponse(
        location=DEFAULT_LOCATION,
        variables=variables_dict,
        lastUpdated=datetime.utcnow().isoformat() + "Z"
    )


@app.get("/api/v1/locations/{location_id}/correlation", response_model=CorrelationMatrixResponse)
async def get_correlation_matrix(
    location_id: str,
    hours: int = 168  # Por defecto 7 días
):
    """
    Obtener matriz de correlación entre variables meteorológicas
    
    - **location_id**: ID de la ubicación
    - **hours**: Período histórico en horas (mínimo: 2, máximo: 720, default: 168 = 7 días)
    
    Retorna una matriz de correlación de Pearson entre todas las variables meteorológicas.
    Los valores van de -1 a 1:
    - 1: Correlación positiva perfecta
    - 0: Sin correlación
    - -1: Correlación negativa perfecta
    """
    if location_id != DEFAULT_LOCATION.id:
        raise HTTPException(status_code=404, detail="Ubicación no encontrada")
    
    # Validar parámetros
    if hours < 2:
        raise HTTPException(status_code=400, detail="El período mínimo es de 2 horas")
    if hours > 720:
        raise HTTPException(status_code=400, detail="El período máximo es de 720 horas (30 días)")
    
    # Generar datos históricos
    historical_data = simulator.generate_historical_data(hours=hours)
    
    if not historical_data or len(historical_data) < 2:
        raise HTTPException(status_code=400, detail="Datos insuficientes para calcular correlación")
    
    # Calcular matriz de correlación
    correlation_result = CorrelationAnalysis.calculate_correlation_matrix(historical_data)
    
    if not correlation_result:
        raise HTTPException(status_code=400, detail="No se pudo calcular la matriz de correlación")
    
    return CorrelationMatrixResponse(
        location=DEFAULT_LOCATION,
        matrix=correlation_result.get("matrix", {}),
        variables=correlation_result.get("variables", []),
        dataPoints=correlation_result.get("dataPoints", 0),
        lastUpdated=datetime.utcnow().isoformat() + "Z"
    )


# ==================== WEBSOCKET ====================

@app.websocket("/ws/locations/{location_id}/realtime")
async def websocket_endpoint(websocket: WebSocket, location_id: str):
    """WebSocket para actualizaciones en tiempo real"""
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        # Enviar estado actual inmediatamente
        message = {
            "type": "current_weather_update",
            "locationId": location_id,
            "data": weather_state.get("current", {}),
            "timestamp": datetime.utcnow().isoformat() + "Z"
        }
        await websocket.send_json(message)
        
        # Mantener conexión abierta
        while True:
            await websocket.receive_text()
            
    except WebSocketDisconnect:
        active_connections.remove(websocket)
    except Exception as e:
        print(f"Error en WebSocket: {e}")
        if websocket in active_connections:
            active_connections.remove(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

