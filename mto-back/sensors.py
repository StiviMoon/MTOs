"""
Simulador de Sensores Meteorológicos
Genera valores realistas para todas las variables meteorológicas
"""

import random
import math
from datetime import datetime, timedelta
from typing import Dict, List
import numpy as np


class WeatherSimulator:
    """Simulador de datos meteorológicos realistas"""
    
    def __init__(self, base_temp: float = 24.0, base_humidity: float = 68.0):
        self.base_temp = base_temp
        self.base_humidity = base_humidity
        self.start_time = datetime.now()
        
    def _get_time_factor(self) -> float:
        """Factor temporal para variaciones diurnas"""
        now = datetime.now()
        hour = now.hour
        # Simula variación diurna: más frío de noche, más cálido al mediodía
        return math.sin((hour - 6) * math.pi / 12) if 6 <= hour <= 18 else -0.3
    
    def generate_current_weather(self) -> Dict:
        """Genera datos meteorológicos actuales completos"""
        time_factor = self._get_time_factor()
        hour = datetime.now().hour
        
        # Temperatura con variación diurna
        temp_variation = time_factor * 8 + random.uniform(-2, 2)
        air_temp = self.base_temp + temp_variation
        feels_like = air_temp - random.uniform(1, 3)
        soil_temp = air_temp + random.uniform(-2, 2)
        
        # Humedad (inversamente relacionada con temperatura)
        humidity = max(40, min(95, self.base_humidity - (temp_variation * 2) + random.uniform(-5, 5)))
        dew_point = air_temp - ((100 - humidity) / 5)
        soil_humidity = random.uniform(40, 50)
        
        # Viento (más fuerte durante el día)
        wind_speed = max(5, min(30, 12 + time_factor * 8 + random.uniform(-3, 3)))
        wind_direction = random.randint(0, 360)
        wind_gust = wind_speed * random.uniform(1.3, 1.8)
        direction_names = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]
        direction_name = direction_names[wind_direction // 45]
        
        # Presión atmosférica (variación lenta)
        pressure = 1013 + random.uniform(-5, 5)
        pressure_trend = random.choice(["rising", "falling", "stable"])
        
        # Precipitación (probabilidad baja durante el día)
        precip_prob = random.uniform(0, 30) if 6 <= hour <= 18 else random.uniform(0, 50)
        current_precip = random.uniform(0, 3) if precip_prob > 20 else 0
        last24h_precip = random.uniform(5, 15)
        
        # Radiación solar (solo durante el día)
        if 6 <= hour <= 18:
            solar_max = 1000
            solar_current = max(0, solar_max * (1 - abs(hour - 12) / 6) + random.uniform(-100, 100))
            uv_index = max(0, min(11, int((solar_current / 100) * 0.8)))
            uv_level = "low" if uv_index < 3 else "moderate" if uv_index < 6 else "high" if uv_index < 8 else "very_high" if uv_index < 10 else "extreme"
        else:
            solar_current = 0
            solar_max = 950
            uv_index = 0
            uv_level = "low"
        
        # Calidad del aire
        aqi = random.randint(30, 60)
        pm25 = random.uniform(10, 25)
        pm10 = random.uniform(20, 35)
        co2 = random.randint(400, 450)
        o3 = random.uniform(40, 60)
        air_level = "good" if aqi < 50 else "moderate" if aqi < 100 else "unhealthy"
        
        # Condiciones
        cloud_cover = random.uniform(20, 60)
        if cloud_cover < 30:
            icon = "sun"
            description = "Soleado"
        elif cloud_cover < 60:
            icon = "partly-cloudy"
            description = "Parcialmente nublado"
        else:
            icon = "cloud"
            description = "Nublado"
        
        # Tendencia de temperatura
        temp_change = random.uniform(-1, 3)
        temp_trend = "up" if temp_change > 1 else "down" if temp_change < -1 else "stable"
        
        return {
            "temperature": {
                "air": round(air_temp, 1),
                "feelsLike": round(feels_like, 1),
                "soil": round(soil_temp, 1),
                "trend": temp_trend,
                "change24h": round(temp_change, 1)
            },
            "humidity": {
                "relative": round(humidity, 1),
                "dewPoint": round(dew_point, 1),
                "soil": round(soil_humidity, 1)
            },
            "wind": {
                "speed": round(wind_speed, 1),
                "direction": wind_direction,
                "gust": round(wind_gust, 1),
                "directionName": direction_name
            },
            "pressure": {
                "value": round(pressure, 1),
                "trend": pressure_trend
            },
            "precipitation": {
                "current": round(current_precip, 1),
                "last24h": round(last24h_precip, 1),
                "probability": round(precip_prob, 1)
            },
            "solar": {
                "radiation": round(solar_current, 0),
                "maxToday": round(solar_max, 0),
                "uvIndex": uv_index,
                "uvLevel": uv_level
            },
            "visibility": round(random.uniform(8, 12), 1),
            "airQuality": {
                "aqi": aqi,
                "pm25": round(pm25, 1),
                "pm10": round(pm10, 1),
                "co2": co2,
                "o3": round(o3, 1),
                "level": air_level
            },
            "conditions": {
                "icon": icon,
                "description": description,
                "cloudCover": round(cloud_cover, 1)
            }
        }
    
    def generate_historical_data(self, hours: int = 24) -> List[Dict]:
        """Genera datos históricos para las últimas N horas"""
        data = []
        now = datetime.now()
        
        for i in range(hours, 0, -1):
            timestamp = now - timedelta(hours=i)
            hour = timestamp.hour
            
            # Simula variación histórica
            time_factor = math.sin((hour - 6) * math.pi / 12) if 6 <= hour <= 18 else -0.3
            temp = self.base_temp + time_factor * 8 + random.uniform(-2, 2)
            humidity = max(40, min(95, self.base_humidity - (time_factor * 2) + random.uniform(-5, 5)))
            wind_speed = max(5, min(30, 12 + time_factor * 8 + random.uniform(-3, 3)))
            pressure = 1013 + random.uniform(-5, 5)
            precip = random.uniform(0, 2) if random.random() > 0.7 else 0
            solar = max(0, 1000 * (1 - abs(hour - 12) / 6) + random.uniform(-100, 100)) if 6 <= hour <= 18 else 0
            uv = max(0, min(11, int((solar / 100) * 0.8))) if 6 <= hour <= 18 else 0
            
            data.append({
                "timestamp": timestamp.isoformat() + "Z",
                "time": timestamp.strftime("%H:%M"),
                "hour": timestamp.strftime("%Hh"),
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "windSpeed": round(wind_speed, 1),
                "windDirection": random.randint(0, 360),
                "pressure": round(pressure, 1),
                "precipitation": round(precip, 1),
                "solarRadiation": round(solar, 0),
                "uvIndex": uv,
                "pm25": round(random.uniform(10, 25), 1),
                "pm10": round(random.uniform(20, 35), 1),
                "co2": random.randint(400, 450),
                "o3": round(random.uniform(40, 60), 1),
                "feels": round(temp - random.uniform(1, 3), 1),
                "soil": round(temp + random.uniform(-2, 2), 1),
                "soilHumidity": round(random.uniform(40, 50), 1),
                "gust": round(wind_speed * random.uniform(1.3, 1.8), 1)
            })
        
        return data
    
    def generate_daily_forecast(self, days: int = 7) -> List[Dict]:
        """Genera pronóstico diario para N días"""
        forecast = []
        now = datetime.now()
        days_of_week = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
        
        for i in range(days):
            date = now + timedelta(days=i)
            day_name = days_of_week[date.weekday()]
            
            # Variación diaria
            temp_high = self.base_temp + random.uniform(2, 6)
            temp_low = temp_high - random.uniform(8, 12)
            
            # Condiciones
            cloud_cover = random.uniform(20, 70)
            if cloud_cover < 30:
                icon = "sun"
                description = "Soleado"
            elif cloud_cover < 60:
                icon = "cloud-drizzle"
                description = "Lluvia ligera"
            else:
                icon = "cloud-rain"
                description = "Lluvia"
            
            precip_prob = random.uniform(0, 60)
            precip_amount = random.uniform(0, 15) if precip_prob > 30 else 0
            
            forecast.append({
                "date": date.strftime("%Y-%m-%d"),
                "dayOfWeek": day_name,
                "temperature": {
                    "high": round(temp_high, 0),
                    "low": round(temp_low, 0),
                    "morning": round(temp_low + 3, 0),
                    "afternoon": round(temp_high, 0),
                    "evening": round(temp_high - 3, 0),
                    "night": round(temp_low + 1, 0)
                },
                "conditions": {
                    "icon": icon,
                    "description": description,
                    "cloudCover": round(cloud_cover, 1)
                },
                "precipitation": {
                    "probability": round(precip_prob, 0),
                    "amount": round(precip_amount, 1),
                    "type": "rain"
                },
                "wind": {
                    "speed": round(random.uniform(12, 20), 0),
                    "direction": random.randint(0, 360),
                    "directionName": ["N", "NE", "E", "SE", "S", "SO", "O", "NO"][random.randint(0, 7)],
                    "gust": round(random.uniform(18, 25), 0)
                },
                "humidity": round(random.uniform(60, 80), 0),
                "uvIndex": random.randint(5, 9)
            })
        
        return forecast
    
    def generate_hourly_forecast(self, hours: int = 24) -> List[Dict]:
        """Genera pronóstico horario para N horas"""
        forecast = []
        now = datetime.now()
        
        for i in range(hours):
            dt = now + timedelta(hours=i)
            hour = dt.hour
            
            time_factor = math.sin((hour - 6) * math.pi / 12) if 6 <= hour <= 18 else -0.3
            temp = self.base_temp + time_factor * 8 + random.uniform(-2, 2)
            feels = temp - random.uniform(1, 3)
            humidity = max(40, min(95, self.base_humidity - (time_factor * 2) + random.uniform(-5, 5)))
            wind_speed = max(5, min(30, 12 + time_factor * 8 + random.uniform(-3, 3)))
            
            precip_prob = random.uniform(0, 30) if 6 <= hour <= 18 else random.uniform(0, 50)
            precip_amount = random.uniform(0, 5) if precip_prob > 20 else 0
            
            cloud_cover = random.uniform(20, 60)
            if cloud_cover < 30:
                icon = "partly-cloudy"
                description = "Parcialmente nublado"
            else:
                icon = "cloud"
                description = "Nublado"
            
            uv = max(0, min(11, int((hour - 6) * 0.8))) if 6 <= hour <= 18 else 0
            
            forecast.append({
                "datetime": dt.isoformat() + "Z",
                "temperature": round(temp, 1),
                "feelsLike": round(feels, 1),
                "humidity": round(humidity, 1),
                "windSpeed": round(wind_speed, 1),
                "windDirection": random.randint(0, 360),
                "precipitation": {
                    "probability": round(precip_prob, 0),
                    "amount": round(precip_amount, 1)
                },
                "conditions": {
                    "icon": icon,
                    "description": description
                },
                "uvIndex": uv
            })
        
        return forecast
    
    def generate_alerts(self) -> List[Dict]:
        """Genera alertas meteorológicas simuladas"""
        alerts = []
        now = datetime.now()
        
        # Alerta de lluvia (30% probabilidad)
        if random.random() < 0.3:
            start = now + timedelta(hours=random.randint(1, 3))
            alerts.append({
                "id": "alert_001",
                "type": "rain",
                "severity": "warning",
                "title": "Lluvia Intensa",
                "description": "Se esperan precipitaciones intensas con acumulados de hasta 30mm/h en el área metropolitana.",
                "startTime": start.isoformat() + "Z",
                "endTime": (start + timedelta(hours=2)).isoformat() + "Z",
                "affectedAreas": ["CABA", "Gran Buenos Aires Norte", "Gran Buenos Aires Oeste"],
                "recommendations": [
                    "Evite circular por zonas bajas propensas a inundaciones",
                    "Tenga precaución al conducir"
                ],
                "icon": "cloud-rain",
                "color": "chart-2",
                "isActive": True,
                "createdAt": now.isoformat() + "Z"
            })
        
        # Alerta de viento (20% probabilidad)
        if random.random() < 0.2:
            start = now + timedelta(hours=random.randint(2, 4))
            alerts.append({
                "id": "alert_002",
                "type": "wind",
                "severity": "watch",
                "title": "Vientos Fuertes",
                "description": "Vientos del sudeste con ráfagas de hasta 60-70 km/h durante la tarde.",
                "startTime": start.isoformat() + "Z",
                "endTime": (start + timedelta(hours=6)).isoformat() + "Z",
                "affectedAreas": ["Costa Atlántica", "CABA", "Gran Buenos Aires"],
                "recommendations": [
                    "Asegure objetos que puedan ser movidos por el viento",
                    "Evite actividades al aire libre"
                ],
                "icon": "wind",
                "color": "chart-3",
                "isActive": True,
                "createdAt": now.isoformat() + "Z"
            })
        
        # Alerta UV (siempre activa durante el día)
        if 12 <= now.hour <= 16:
            alerts.append({
                "id": "alert_003",
                "type": "uv",
                "severity": "info",
                "title": "Radiación UV Alta",
                "description": "Índice UV extremadamente alto. Riesgo elevado de daño solar.",
                "startTime": now.replace(hour=12, minute=0).isoformat() + "Z",
                "endTime": now.replace(hour=16, minute=0).isoformat() + "Z",
                "affectedAreas": ["Todo el territorio"],
                "recommendations": [
                    "Use protector solar FPS 50+",
                    "Busque sombra entre 12:00 y 16:00",
                    "Use ropa protectora"
                ],
                "icon": "sun",
                "color": "chart-4",
                "isActive": True,
                "createdAt": now.isoformat() + "Z"
            })
        
        return alerts
    
    def generate_predictions(self, days: int = 7) -> List[Dict]:
        """Genera predicciones con intervalos de confianza"""
        predictions = []
        now = datetime.now()
        
        for i in range(days):
            date = now + timedelta(days=i)
            base_temp = self.base_temp + random.uniform(-2, 4)
            
            # Confianza disminuye con el tiempo
            confidence = max(70, 95 - (i * 3))
            
            predictions.append({
                "date": date.strftime("%Y-%m-%d"),
                "model": "hybrid",
                "temperature": {
                    "predicted": round(base_temp, 1),
                    "min": round(base_temp - 2, 1),
                    "max": round(base_temp + 2, 1),
                    "confidence": round(confidence, 0)
                },
                "precipitation": {
                    "probability": round(random.uniform(0, 60), 0),
                    "amount": round(random.uniform(0, 20), 1),
                    "confidence": round(confidence, 0)
                },
                "historical": {
                    "average": round(base_temp - 1, 1),
                    "deviation": round(2.5, 1)
                }
            })
        
        return predictions
    
    def generate_analytics(self, months: int = 6) -> Dict:
        """Genera datos de análisis histórico"""
        now = datetime.now()
        records = []
        
        for i in range(months, 0, -1):
            month_date = now - timedelta(days=30 * i)
            month_name = month_date.strftime("%b")
            
            avg_temp = self.base_temp - (i * 2) + random.uniform(-2, 2)
            max_temp = avg_temp + random.uniform(5, 8)
            min_temp = avg_temp - random.uniform(8, 12)
            
            precip = random.uniform(40, 150)
            days_rain = random.randint(3, 10)
            
            records.append({
                "date": month_date.strftime("%Y-%m"),
                "month": month_name,
                "avg": round(avg_temp, 1),
                "max": round(max_temp, 1),
                "min": round(min_temp, 1),
                "precipitation": round(precip, 1),
                "days": days_rain
            })
        
        # Rosa de vientos
        directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]
        wind_frequency = []
        for direction in directions:
            wind_frequency.append({
                "direction": direction,
                "frequency": round(random.uniform(5, 20), 1),
                "avgSpeed": round(random.uniform(12, 22), 1)
            })
        
        return {
            "temperature": {
                "average": round(sum(r["avg"] for r in records) / len(records), 1),
                "max": round(max(r["max"] for r in records), 1),
                "min": round(min(r["min"] for r in records), 1),
                "records": records
            },
            "precipitation": {
                "total": round(sum(r["precipitation"] for r in records), 1),
                "daysWithRain": sum(r["days"] for r in records),
                "records": [{"date": r["date"], "amount": r["precipitation"], "days": r["days"]} for r in records]
            },
            "wind": {
                "dominantDirection": "SE",
                "averageSpeed": round(sum(w["avgSpeed"] for w in wind_frequency) / len(wind_frequency), 1),
                "frequency": wind_frequency
            }
        }

