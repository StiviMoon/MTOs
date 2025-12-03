# Ejemplos de Respuestas API - MTOs

## Ejemplos de Respuestas JSON Reales

### 1. GET `/locations/:locationId/current`

```json
{
  "location": {
    "id": "loc_001",
    "name": "Buenos Aires",
    "country": "Argentina",
    "latitude": -34.6037,
    "longitude": -58.3816,
    "timezone": "America/Argentina/Buenos_Aires",
    "elevation": 25
  },
  "current": {
    "locationId": "loc_001",
    "timestamp": "2024-01-15T14:30:00Z",
    "temperature": {
      "air": 24.5,
      "feelsLike": 22.3,
      "soil": 22.0,
      "trend": "up",
      "change24h": 2.1
    },
    "humidity": {
      "relative": 68,
      "dewPoint": 18.2,
      "soil": 45
    },
    "wind": {
      "speed": 18,
      "direction": 315,
      "gust": 25,
      "directionName": "NO"
    },
    "pressure": {
      "value": 1015.2,
      "trend": "stable"
    },
    "precipitation": {
      "current": 2.5,
      "last24h": 12.0,
      "probability": 15
    },
    "solar": {
      "radiation": 850,
      "maxToday": 950,
      "uvIndex": 8,
      "uvLevel": "very_high"
    },
    "visibility": 10,
    "airQuality": {
      "aqi": 42,
      "pm25": 12,
      "pm10": 25,
      "co2": 410,
      "o3": 45,
      "level": "good"
    },
    "conditions": {
      "icon": "partly-cloudy",
      "description": "Parcialmente nublado",
      "cloudCover": 45
    }
  },
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### 2. GET `/locations/:locationId/forecast/daily`

```json
{
  "location": {
    "id": "loc_001",
    "name": "Buenos Aires",
    "country": "Argentina"
  },
  "forecast": [
    {
      "date": "2024-01-15",
      "dayOfWeek": "Lun",
      "temperature": {
        "high": 28,
        "low": 18,
        "morning": 20,
        "afternoon": 27,
        "evening": 23,
        "night": 19
      },
      "conditions": {
        "icon": "sun",
        "description": "Soleado",
        "cloudCover": 20
      },
      "precipitation": {
        "probability": 10,
        "amount": 0,
        "type": "rain"
      },
      "wind": {
        "speed": 15,
        "direction": 315,
        "directionName": "NO",
        "gust": 20
      },
      "humidity": 65,
      "uvIndex": 8
    },
    {
      "date": "2024-01-16",
      "dayOfWeek": "Mar",
      "temperature": {
        "high": 26,
        "low": 17,
        "morning": 19,
        "afternoon": 25,
        "evening": 21,
        "night": 18
      },
      "conditions": {
        "icon": "cloud-drizzle",
        "description": "Lluvia ligera",
        "cloudCover": 70
      },
      "precipitation": {
        "probability": 30,
        "amount": 5,
        "type": "rain"
      },
      "wind": {
        "speed": 18,
        "direction": 180,
        "directionName": "S",
        "gust": 25
      },
      "humidity": 72,
      "uvIndex": 6
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### 3. GET `/locations/:locationId/forecast/hourly`

```json
{
  "location": {
    "id": "loc_001",
    "name": "Buenos Aires"
  },
  "forecast": [
    {
      "datetime": "2024-01-15T08:00:00Z",
      "temperature": 20,
      "feelsLike": 19,
      "humidity": 75,
      "windSpeed": 12,
      "windDirection": 310,
      "precipitation": {
        "probability": 0,
        "amount": 0
      },
      "conditions": {
        "icon": "partly-cloudy",
        "description": "Parcialmente nublado"
      },
      "uvIndex": 2
    },
    {
      "datetime": "2024-01-15T10:00:00Z",
      "temperature": 23,
      "feelsLike": 22,
      "humidity": 70,
      "windSpeed": 14,
      "windDirection": 315,
      "precipitation": {
        "probability": 0,
        "amount": 0
      },
      "conditions": {
        "icon": "sun",
        "description": "Soleado"
      },
      "uvIndex": 4
    },
    {
      "datetime": "2024-01-15T12:00:00Z",
      "temperature": 26,
      "feelsLike": 25,
      "humidity": 65,
      "windSpeed": 16,
      "windDirection": 320,
      "precipitation": {
        "probability": 10,
        "amount": 0.5
      },
      "conditions": {
        "icon": "cloud",
        "description": "Nublado"
      },
      "uvIndex": 7
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### 4. GET `/locations/:locationId/alerts`

```json
{
  "location": {
    "id": "loc_001",
    "name": "Buenos Aires"
  },
  "alerts": [
    {
      "id": "alert_001",
      "type": "rain",
      "severity": "warning",
      "title": "Lluvia Intensa",
      "description": "Se esperan precipitaciones intensas con acumulados de hasta 30mm/h en el área metropolitana.",
      "startTime": "2024-01-15T15:00:00Z",
      "endTime": "2024-01-15T17:00:00Z",
      "affectedAreas": [
        "CABA",
        "Gran Buenos Aires Norte",
        "Gran Buenos Aires Oeste"
      ],
      "recommendations": [
        "Evite circular por zonas bajas propensas a inundaciones",
        "Tenga precaución al conducir",
        "Manténgase informado sobre las condiciones"
      ],
      "icon": "cloud-rain",
      "color": "chart-2",
      "isActive": true,
      "createdAt": "2024-01-15T14:00:00Z"
    },
    {
      "id": "alert_002",
      "type": "wind",
      "severity": "watch",
      "title": "Vientos Fuertes",
      "description": "Vientos del sudeste con ráfagas de hasta 60-70 km/h durante la tarde.",
      "startTime": "2024-01-15T14:00:00Z",
      "endTime": "2024-01-15T20:00:00Z",
      "affectedAreas": [
        "Costa Atlántica",
        "CABA",
        "Gran Buenos Aires"
      ],
      "recommendations": [
        "Asegure objetos que puedan ser movidos por el viento",
        "Evite actividades al aire libre"
      ],
      "icon": "wind",
      "color": "chart-3",
      "isActive": true,
      "createdAt": "2024-01-15T13:30:00Z"
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### 5. GET `/locations/:locationId/predictions?days=7&model=hybrid`

```json
{
  "location": {
    "id": "loc_001",
    "name": "Buenos Aires"
  },
  "predictions": [
    {
      "date": "2024-01-15",
      "model": "hybrid",
      "temperature": {
        "predicted": 25,
        "min": 23,
        "max": 27,
        "confidence": 95
      },
      "precipitation": {
        "probability": 15,
        "amount": 2,
        "confidence": 95
      },
      "historical": {
        "average": 24,
        "deviation": 2.5
      }
    },
    {
      "date": "2024-01-16",
      "model": "hybrid",
      "temperature": {
        "predicted": 26,
        "min": 24,
        "max": 28,
        "confidence": 92
      },
      "precipitation": {
        "probability": 45,
        "amount": 8,
        "confidence": 92
      },
      "historical": {
        "average": 25,
        "deviation": 2.8
      }
    }
  ],
  "modelMetrics": {
    "ml": {
      "accuracy": 94.2,
      "rmse": 1.2,
      "mae": 0.9,
      "lastUpdated": "2024-01-15T12:00:00Z"
    },
    "statistical": {
      "accuracy": 91.5,
      "rmse": 1.5,
      "mae": 1.2,
      "lastUpdated": "2024-01-15T12:00:00Z"
    },
    "hybrid": {
      "accuracy": 95.8,
      "rmse": 0.9,
      "mae": 0.7,
      "lastUpdated": "2024-01-15T12:00:00Z"
    }
  },
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### 6. GET `/locations/:locationId/charts/temperature`

```json
{
  "data": [
    {
      "time": "00:00",
      "temp": 18.5,
      "feels": 16.2,
      "soil": 20.0
    },
    {
      "time": "03:00",
      "temp": 16.8,
      "feels": 14.5,
      "soil": 19.2
    },
    {
      "time": "06:00",
      "temp": 15.2,
      "feels": 13.0,
      "soil": 18.5
    },
    {
      "time": "09:00",
      "temp": 20.1,
      "feels": 19.0,
      "soil": 21.0
    },
    {
      "time": "12:00",
      "temp": 25.3,
      "feels": 24.1,
      "soil": 24.2
    },
    {
      "time": "15:00",
      "temp": 28.0,
      "feels": 27.2,
      "soil": 26.0
    },
    {
      "time": "18:00",
      "temp": 24.5,
      "feels": 23.3,
      "soil": 23.5
    },
    {
      "time": "21:00",
      "temp": 20.8,
      "feels": 19.5,
      "soil": 21.2
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### 7. GET `/locations/:locationId/analytics?period=monthly&startDate=2024-01-01&endDate=2024-06-30`

```json
{
  "location": {
    "id": "loc_001",
    "name": "Buenos Aires"
  },
  "period": "monthly",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-06-30"
  },
  "temperature": {
    "average": 21.8,
    "max": 32,
    "min": 8,
    "records": [
      {
        "date": "2024-01",
        "avg": 26.0,
        "max": 32.0,
        "min": 20.0
      },
      {
        "date": "2024-02",
        "avg": 25.2,
        "max": 30.0,
        "min": 19.0
      },
      {
        "date": "2024-03",
        "avg": 23.1,
        "max": 28.0,
        "min": 17.0
      },
      {
        "date": "2024-04",
        "avg": 20.0,
        "max": 25.0,
        "min": 14.0
      },
      {
        "date": "2024-05",
        "avg": 17.2,
        "max": 22.0,
        "min": 11.0
      },
      {
        "date": "2024-06",
        "avg": 14.5,
        "max": 19.0,
        "min": 8.0
      }
    ]
  },
  "precipitation": {
    "total": 550,
    "daysWithRain": 39,
    "records": [
      {
        "date": "2024-01",
        "amount": 120,
        "days": 8
      },
      {
        "date": "2024-02",
        "amount": 100,
        "days": 7
      },
      {
        "date": "2024-03",
        "amount": 150,
        "days": 10
      },
      {
        "date": "2024-04",
        "amount": 80,
        "days": 6
      },
      {
        "date": "2024-05",
        "amount": 60,
        "days": 5
      },
      {
        "date": "2024-06",
        "amount": 40,
        "days": 3
      }
    ]
  },
  "wind": {
    "dominantDirection": "SE",
    "averageSpeed": 18.2,
    "frequency": [
      {
        "direction": "N",
        "frequency": 12,
        "avgSpeed": 15.0
      },
      {
        "direction": "NE",
        "frequency": 8,
        "avgSpeed": 18.0
      },
      {
        "direction": "E",
        "frequency": 15,
        "avgSpeed": 12.0
      },
      {
        "direction": "SE",
        "frequency": 18,
        "avgSpeed": 20.0
      },
      {
        "direction": "S",
        "frequency": 10,
        "avgSpeed": 16.0
      },
      {
        "direction": "SO",
        "frequency": 14,
        "avgSpeed": 22.0
      },
      {
        "direction": "O",
        "frequency": 16,
        "avgSpeed": 19.0
      },
      {
        "direction": "NO",
        "frequency": 7,
        "avgSpeed": 14.0
      }
    ]
  },
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### 8. WebSocket Message - Real-time Update

```json
{
  "type": "current_weather_update",
  "locationId": "loc_001",
  "data": {
    "temperature": {
      "air": 24.7,
      "feelsLike": 22.5,
      "soil": 22.2
    },
    "humidity": {
      "relative": 68,
      "dewPoint": 18.3,
      "soil": 45
    },
    "wind": {
      "speed": 18,
      "direction": 315,
      "gust": 25,
      "directionName": "NO"
    },
    "pressure": {
      "value": 1015.3,
      "trend": "stable"
    },
    "precipitation": {
      "current": 2.5,
      "last24h": 12.0,
      "probability": 15
    },
    "solar": {
      "radiation": 850,
      "maxToday": 950,
      "uvIndex": 8,
      "uvLevel": "very_high"
    },
    "visibility": 10,
    "airQuality": {
      "aqi": 42,
      "pm25": 12,
      "pm10": 25,
      "co2": 410,
      "o3": 45,
      "level": "good"
    },
    "conditions": {
      "icon": "partly-cloudy",
      "description": "Parcialmente nublado",
      "cloudCover": 45
    }
  },
  "timestamp": "2024-01-15T14:31:00Z"
}
```

### 9. Error Response

```json
{
  "error": {
    "code": "LOCATION_NOT_FOUND",
    "message": "La ubicación solicitada no existe",
    "details": {
      "locationId": "loc_999"
    }
  },
  "timestamp": "2024-01-15T14:30:00Z"
}
```

### 10. GET `/locations/:locationId/predictions/heatmap`

```json
{
  "location": {
    "id": "loc_001",
    "name": "Buenos Aires"
  },
  "heatmap": [
    {
      "hour": "00h",
      "monday": 18.2,
      "tuesday": 19.1,
      "wednesday": 17.8,
      "thursday": 20.0,
      "friday": 18.5,
      "saturday": 19.3,
      "sunday": 18.0
    },
    {
      "hour": "06h",
      "monday": 20.1,
      "tuesday": 21.2,
      "wednesday": 19.5,
      "thursday": 22.0,
      "friday": 20.3,
      "saturday": 21.5,
      "sunday": 20.2
    },
    {
      "hour": "12h",
      "monday": 25.3,
      "tuesday": 26.1,
      "wednesday": 24.8,
      "thursday": 27.2,
      "friday": 25.5,
      "saturday": 26.3,
      "sunday": 25.0
    },
    {
      "hour": "18h",
      "monday": 23.5,
      "tuesday": 24.2,
      "wednesday": 22.8,
      "thursday": 25.0,
      "friday": 23.8,
      "saturday": 24.5,
      "sunday": 23.2
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

---

## Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error en la solicitud (validación)
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - No autorizado
- `404 Not Found` - Recurso no encontrado
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Error del servidor
- `503 Service Unavailable` - Servicio temporalmente no disponible

---

## Headers Importantes

### Request Headers
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
Accept: application/json
```

### Response Headers
```
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
Cache-Control: public, max-age=60
Last-Modified: Mon, 15 Jan 2024 14:30:00 GMT
```

