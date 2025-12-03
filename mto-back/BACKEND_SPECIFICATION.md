# Especificación Técnica del Backend - MTOs

## 📋 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Estructura de APIs](#estructura-de-apis)
3. [Modelos de Datos](#modelos-de-datos)
4. [Endpoints Detallados](#endpoints-detallados)
5. [Frecuencias de Actualización](#frecuencias-de-actualización)
6. [Tecnologías Recomendadas](#tecnologías-recomendadas)

---

## 🏗️ Arquitectura General

### Stack Recomendado
- **Runtime**: Node.js + Express.js o NestJS
- **Base de Datos**: PostgreSQL (datos históricos) + Redis (caché y tiempo real)
- **ORM**: Prisma o TypeORM
- **Autenticación**: JWT
- **WebSockets**: Socket.io (para actualizaciones en tiempo real)
- **Validación**: Zod o Joi
- **Documentación**: Swagger/OpenAPI

### Estructura de Capas
```
Backend/
├── controllers/     # Controladores de rutas
├── services/        # Lógica de negocio
├── repositories/    # Acceso a datos
├── models/          # Modelos de base de datos
├── dto/             # Data Transfer Objects
├── middleware/      # Autenticación, validación, etc.
├── utils/           # Utilidades
└── websocket/       # WebSocket handlers
```

---

## 🔌 Estructura de APIs

### Base URL
```
https://api.mtos.com/v1
```

### Autenticación
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 📊 Modelos de Datos

### 1. Location (Ubicación)
```typescript
{
  id: string;
  name: string;              // "Buenos Aires"
  country: string;           // "Argentina"
  latitude: number;          // -34.6037
  longitude: number;         // -58.3816
  timezone: string;          // "America/Argentina/Buenos_Aires"
  elevation: number;         // metros sobre el nivel del mar
}
```

### 2. Current Weather (Tiempo Actual)
```typescript
{
  locationId: string;
  timestamp: string;          // ISO 8601
  temperature: {
    air: number;             // °C
    feelsLike: number;       // °C
    soil: number;            // °C
    trend: "up" | "down" | "stable";
    change24h: number;        // diferencia en °C
  };
  humidity: {
    relative: number;        // %
    dewPoint: number;       // °C
    soil: number;           // %
  };
  wind: {
    speed: number;           // km/h
    direction: number;       // grados (0-360)
    gust: number;            // km/h
    directionName: string;   // "NO", "SE", etc.
  };
  pressure: {
    value: number;           // hPa
    trend: "rising" | "falling" | "stable";
  };
  precipitation: {
    current: number;         // mm
    last24h: number;         // mm
    probability: number;    // %
  };
  solar: {
    radiation: number;       // W/m²
    maxToday: number;        // W/m²
    uvIndex: number;         // 0-11
    uvLevel: "low" | "moderate" | "high" | "very_high" | "extreme";
  };
  visibility: number;        // km
  airQuality: {
    aqi: number;             // Air Quality Index
    pm25: number;            // μg/m³
    pm10: number;            // μg/m³
    co2: number;             // ppm
    o3: number;              // ppb
    level: "good" | "moderate" | "unhealthy" | "very_unhealthy" | "hazardous";
  };
  conditions: {
    icon: string;            // código de icono
    description: string;      // "Parcialmente nublado"
    cloudCover: number;       // %
  };
}
```

### 3. Historical Data (Datos Históricos)
```typescript
{
  locationId: string;
  timestamp: string;          // ISO 8601
  temperature: number;       // °C
  humidity: number;         // %
  windSpeed: number;         // km/h
  windDirection: number;     // grados
  pressure: number;          // hPa
  precipitation: number;     // mm
  solarRadiation: number;    // W/m²
  uvIndex: number;
  airQuality: {
    pm25: number;
    pm10: number;
    co2: number;
    o3: number;
  };
}
```

### 4. Forecast (Pronóstico)
```typescript
{
  locationId: string;
  date: string;              // YYYY-MM-DD
  dayOfWeek: string;         // "Lun", "Mar", etc.
  temperature: {
    high: number;            // °C
    low: number;             // °C
    morning: number;          // °C
    afternoon: number;       // °C
    evening: number;         // °C
    night: number;           // °C
  };
  conditions: {
    icon: string;
    description: string;
    cloudCover: number;       // %
  };
  precipitation: {
    probability: number;     // %
    amount: number;          // mm
    type: "rain" | "snow" | "sleet" | "hail";
  };
  wind: {
    speed: number;           // km/h
    direction: number;        // grados
    directionName: string;
    gust: number;            // km/h
  };
  humidity: number;          // %
  uvIndex: number;
}
```

### 5. Hourly Forecast (Pronóstico Horario)
```typescript
{
  locationId: string;
  datetime: string;           // ISO 8601
  temperature: number;        // °C
  feelsLike: number;          // °C
  humidity: number;          // %
  windSpeed: number;          // km/h
  windDirection: number;      // grados
  precipitation: {
    probability: number;      // %
    amount: number;          // mm
  };
  conditions: {
    icon: string;
    description: string;
  };
  uvIndex: number;
}
```

### 6. Alert (Alerta)
```typescript
{
  id: string;
  locationId: string;
  type: "rain" | "wind" | "uv" | "temperature" | "air_quality" | "storm";
  severity: "info" | "watch" | "warning" | "advisory";
  title: string;
  description: string;
  startTime: string;          // ISO 8601
  endTime: string;            // ISO 8601
  affectedAreas: string[];     // ["CABA", "Gran Buenos Aires"]
  recommendations: string[];
  icon: string;
  color: string;              // código de color
  isActive: boolean;
  createdAt: string;
}
```

### 7. Prediction (Predicción Avanzada)
```typescript
{
  locationId: string;
  date: string;               // YYYY-MM-DD
  model: "ml" | "statistical" | "hybrid";
  temperature: {
    predicted: number;        // °C
    min: number;              // °C (intervalo de confianza)
    max: number;              // °C (intervalo de confianza)
    confidence: number;        // % (0-100)
  };
  precipitation: {
    probability: number;      // %
    amount: number;          // mm
    confidence: number;       // %
  };
  historical: {
    average: number;          // promedio histórico
    deviation: number;        // desviación estándar
  };
}
```

### 8. Model Metrics (Métricas de Modelos)
```typescript
{
  modelId: string;
  modelName: string;          // "ML Neural Network", "ARIMA", "Hybrid"
  accuracy: number;           // % (0-100)
  rmse: number;              // Root Mean Square Error
  mae: number;               // Mean Absolute Error
  period: string;            // "last_30_days"
  lastUpdated: string;       // ISO 8601
}
```

### 9. Analytics (Análisis Histórico)
```typescript
{
  locationId: string;
  period: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;         // YYYY-MM-DD
  endDate: string;           // YYYY-MM-DD
  temperature: {
    average: number;
    max: number;
    min: number;
    records: Array<{
      date: string;
      avg: number;
      max: number;
      min: number;
    }>;
  };
  precipitation: {
    total: number;            // mm
    daysWithRain: number;
    records: Array<{
      date: string;
      amount: number;
      days: number;
    }>;
  };
  wind: {
    dominantDirection: string; // "SE"
    averageSpeed: number;      // km/h
    frequency: Array<{
      direction: string;
      frequency: number;       // %
      avgSpeed: number;        // km/h
    }>;
  };
}
```

---

## 🛣️ Endpoints Detallados

### **GET** `/locations`
Obtener todas las ubicaciones disponibles
```json
Response: {
  "locations": [
    {
      "id": "loc_001",
      "name": "Buenos Aires",
      "country": "Argentina",
      "latitude": -34.6037,
      "longitude": -58.3816,
      "timezone": "America/Argentina/Buenos_Aires"
    }
  ]
}
```

### **GET** `/locations/:locationId/current`
Obtener condiciones actuales del tiempo
```json
Response: {
  "location": { /* Location object */ },
  "current": { /* Current Weather object */ },
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```
**Frecuencia**: Cada 1-2 minutos

### **GET** `/locations/:locationId/historical`
Obtener datos históricos
```
Query Params:
  - startDate: YYYY-MM-DD
  - endDate: YYYY-MM-DD
  - interval: "hourly" | "daily" | "weekly" | "monthly"
  - metrics: string[] (temperature, humidity, wind, etc.)
```
```json
Response: {
  "location": { /* Location object */ },
  "data": [
    {
      "timestamp": "2024-01-15T00:00:00Z",
      "temperature": 18.5,
      "humidity": 75,
      "windSpeed": 12,
      "windDirection": 315,
      "pressure": 1013,
      "precipitation": 0,
      "solarRadiation": 0,
      "uvIndex": 0,
      "airQuality": {
        "pm25": 15,
        "pm10": 25,
        "co2": 410,
        "o3": 45
      }
    }
  ],
  "summary": {
    "totalRecords": 24,
    "dateRange": {
      "start": "2024-01-15T00:00:00Z",
      "end": "2024-01-15T23:59:59Z"
    }
  }
}
```

### **GET** `/locations/:locationId/forecast/daily`
Pronóstico diario (7-14 días)
```json
Response: {
  "location": { /* Location object */ },
  "forecast": [
    {
      "date": "2024-01-15",
      "dayOfWeek": "Lun",
      "temperature": {
        "high": 28,
        "low": 18
      },
      "conditions": {
        "icon": "sun",
        "description": "Soleado"
      },
      "precipitation": {
        "probability": 10,
        "amount": 0
      },
      "wind": {
        "speed": 15,
        "direction": 315,
        "directionName": "NO"
      },
      "humidity": 65,
      "uvIndex": 8
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```
**Frecuencia**: Cada 6 horas

### **GET** `/locations/:locationId/forecast/hourly`
Pronóstico horario (próximas 24-48 horas)
```json
Response: {
  "location": { /* Location object */ },
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
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```
**Frecuencia**: Cada hora

### **GET** `/locations/:locationId/alerts`
Obtener alertas activas
```json
Response: {
  "location": { /* Location object */ },
  "alerts": [
    {
      "id": "alert_001",
      "type": "rain",
      "severity": "warning",
      "title": "Lluvia Intensa",
      "description": "Se esperan precipitaciones intensas...",
      "startTime": "2024-01-15T15:00:00Z",
      "endTime": "2024-01-15T17:00:00Z",
      "affectedAreas": ["CABA", "Gran Buenos Aires Norte"],
      "recommendations": [
        "Evite circular por zonas bajas",
        "Tenga precaución al conducir"
      ],
      "icon": "cloud-rain",
      "color": "chart-2",
      "isActive": true
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```
**Frecuencia**: Cada 5 minutos

### **GET** `/locations/:locationId/predictions`
Predicciones avanzadas con modelos ML
```
Query Params:
  - days: number (default: 7, max: 30)
  - model: "ml" | "statistical" | "hybrid" | "all"
```
```json
Response: {
  "location": { /* Location object */ },
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
    }
  ],
  "modelMetrics": {
    "ml": {
      "accuracy": 94.2,
      "rmse": 1.2,
      "mae": 0.9
    },
    "statistical": {
      "accuracy": 91.5,
      "rmse": 1.5,
      "mae": 1.2
    },
    "hybrid": {
      "accuracy": 95.8,
      "rmse": 0.9,
      "mae": 0.7
    }
  },
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```
**Frecuencia**: Cada 12 horas

### **GET** `/locations/:locationId/predictions/heatmap`
Heatmap de temperatura (próxima semana)
```json
Response: {
  "location": { /* Location object */ },
  "heatmap": [
    {
      "hour": "00h",
      "monday": 18,
      "tuesday": 19,
      "wednesday": 17,
      "thursday": 20,
      "friday": 18,
      "saturday": 19,
      "sunday": 18
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```
**Frecuencia**: Cada 12 horas

### **GET** `/locations/:locationId/predictions/longterm`
Predicción a largo plazo (4 semanas)
```json
Response: {
  "location": { /* Location object */ },
  "forecast": [
    {
      "week": "Sem 1",
      "startDate": "2024-01-15",
      "endDate": "2024-01-21",
      "avgTemp": 25,
      "minTemp": 20,
      "maxTemp": 30,
      "precipitation": 45
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```
**Frecuencia**: Diaria

### **GET** `/locations/:locationId/predictions/models/compare`
Comparación de modelos predictivos
```json
Response: {
  "location": { /* Location object */ },
  "comparison": [
    {
      "date": "2024-01-15",
      "ml": 25,
      "statistical": 24.5,
      "hybrid": 25.2,
      "actual": 25
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### **GET** `/locations/:locationId/analytics`
Análisis histórico y estadísticas
```
Query Params:
  - period: "daily" | "weekly" | "monthly" | "yearly"
  - startDate: YYYY-MM-DD
  - endDate: YYYY-MM-DD
```
```json
Response: {
  "location": { /* Location object */ },
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
        "avg": 26,
        "max": 32,
        "min": 20
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
      }
    ]
  },
  "wind": {
    "dominantDirection": "SE",
    "averageSpeed": 18,
    "frequency": [
      {
        "direction": "SE",
        "frequency": 18,
        "avgSpeed": 20
      }
    ]
  },
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### **GET** `/locations/:locationId/charts/temperature`
Datos para gráfico de temperatura (24h)
```json
Response: {
  "data": [
    {
      "time": "00:00",
      "temp": 18,
      "feels": 16,
      "soil": 20
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```
**Frecuencia**: Cada 15 minutos

### **GET** `/locations/:locationId/charts/precipitation`
Datos para gráfico de precipitación y humedad
```json
Response: {
  "data": [
    {
      "hour": "00h",
      "precipitation": 0,
      "humidity": 75,
      "soilHumidity": 40
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### **GET** `/locations/:locationId/charts/wind`
Datos para gráfico de viento
```json
Response: {
  "data": [
    {
      "time": "00:00",
      "speed": 12,
      "gust": 18,
      "direction": 315
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### **GET** `/locations/:locationId/charts/pressure-solar`
Datos para gráfico de presión y radiación solar
```json
Response: {
  "data": [
    {
      "time": "00:00",
      "pressure": 1013,
      "solar": 0,
      "uv": 0
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### **GET** `/locations/:locationId/charts/air-quality`
Datos para gráfico de calidad del aire
```json
Response: {
  "data": [
    {
      "time": "00:00",
      "pm25": 15,
      "pm10": 25,
      "co2": 410,
      "o3": 45
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### **GET** `/locations/:locationId/charts/radar`
Datos para gráfico radar (condiciones generales)
```json
Response: {
  "data": [
    {
      "metric": "Temperatura",
      "value": 85
    },
    {
      "metric": "Humedad",
      "value": 68
    }
  ],
  "lastUpdated": "2024-01-15T14:30:00Z"
}
```

### **WebSocket** `/ws/locations/:locationId/realtime`
Actualizaciones en tiempo real
```json
Message: {
  "type": "current_weather_update",
  "data": { /* Current Weather object */ },
  "timestamp": "2024-01-15T14:30:00Z"
}
```
**Frecuencia**: Cada 30-60 segundos

---

## ⏱️ Frecuencias de Actualización

### Datos en Tiempo Real
- **Current Weather**: Cada **1-2 minutos**
- **Charts Data (24h)**: Cada **15 minutos**
- **WebSocket Updates**: Cada **30-60 segundos**

### Pronósticos
- **Daily Forecast**: Cada **6 horas**
- **Hourly Forecast**: Cada **hora**
- **Long-term Forecast**: **Diario**

### Predicciones Avanzadas
- **ML Predictions**: Cada **12 horas**
- **Heatmap**: Cada **12 horas**
- **Model Comparison**: Cada **12 horas**

### Alertas
- **Active Alerts**: Cada **5 minutos**

### Análisis Histórico
- **Analytics**: **Bajo demanda** (calculado al momento de la petición)

---

## 🗄️ Estructura de Base de Datos

### Tablas Principales

#### `locations`
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timezone VARCHAR(50) NOT NULL,
  elevation INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `weather_current`
```sql
CREATE TABLE weather_current (
  id UUID PRIMARY KEY,
  location_id UUID REFERENCES locations(id),
  timestamp TIMESTAMP NOT NULL,
  temperature_air DECIMAL(5, 2),
  temperature_feels_like DECIMAL(5, 2),
  temperature_soil DECIMAL(5, 2),
  humidity_relative DECIMAL(5, 2),
  humidity_dew_point DECIMAL(5, 2),
  humidity_soil DECIMAL(5, 2),
  wind_speed DECIMAL(5, 2),
  wind_direction INTEGER,
  wind_gust DECIMAL(5, 2),
  pressure_value DECIMAL(7, 2),
  pressure_trend VARCHAR(20),
  precipitation_current DECIMAL(5, 2),
  precipitation_24h DECIMAL(5, 2),
  solar_radiation DECIMAL(6, 2),
  solar_max_today DECIMAL(6, 2),
  uv_index INTEGER,
  visibility DECIMAL(5, 2),
  aqi INTEGER,
  pm25 DECIMAL(5, 2),
  pm10 DECIMAL(5, 2),
  co2 INTEGER,
  o3 DECIMAL(5, 2),
  conditions_icon VARCHAR(50),
  conditions_description VARCHAR(200),
  cloud_cover DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(location_id, timestamp)
);

CREATE INDEX idx_weather_current_location_timestamp ON weather_current(location_id, timestamp DESC);
```

#### `weather_historical`
```sql
CREATE TABLE weather_historical (
  id UUID PRIMARY KEY,
  location_id UUID REFERENCES locations(id),
  timestamp TIMESTAMP NOT NULL,
  temperature DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  wind_speed DECIMAL(5, 2),
  wind_direction INTEGER,
  pressure DECIMAL(7, 2),
  precipitation DECIMAL(5, 2),
  solar_radiation DECIMAL(6, 2),
  uv_index INTEGER,
  pm25 DECIMAL(5, 2),
  pm10 DECIMAL(5, 2),
  co2 INTEGER,
  o3 DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(location_id, timestamp)
);

CREATE INDEX idx_weather_historical_location_timestamp ON weather_historical(location_id, timestamp DESC);
```

#### `forecasts_daily`
```sql
CREATE TABLE forecasts_daily (
  id UUID PRIMARY KEY,
  location_id UUID REFERENCES locations(id),
  date DATE NOT NULL,
  temperature_high DECIMAL(5, 2),
  temperature_low DECIMAL(5, 2),
  conditions_icon VARCHAR(50),
  conditions_description VARCHAR(200),
  cloud_cover DECIMAL(5, 2),
  precipitation_probability DECIMAL(5, 2),
  precipitation_amount DECIMAL(5, 2),
  wind_speed DECIMAL(5, 2),
  wind_direction INTEGER,
  wind_gust DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  uv_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(location_id, date)
);
```

#### `forecasts_hourly`
```sql
CREATE TABLE forecasts_hourly (
  id UUID PRIMARY KEY,
  location_id UUID REFERENCES locations(id),
  datetime TIMESTAMP NOT NULL,
  temperature DECIMAL(5, 2),
  feels_like DECIMAL(5, 2),
  humidity DECIMAL(5, 2),
  wind_speed DECIMAL(5, 2),
  wind_direction INTEGER,
  precipitation_probability DECIMAL(5, 2),
  precipitation_amount DECIMAL(5, 2),
  conditions_icon VARCHAR(50),
  conditions_description VARCHAR(200),
  uv_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(location_id, datetime)
);
```

#### `alerts`
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  location_id UUID REFERENCES locations(id),
  type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  affected_areas JSONB,
  recommendations JSONB,
  icon VARCHAR(50),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_location_active ON alerts(location_id, is_active, start_time);
```

#### `predictions`
```sql
CREATE TABLE predictions (
  id UUID PRIMARY KEY,
  location_id UUID REFERENCES locations(id),
  date DATE NOT NULL,
  model VARCHAR(50) NOT NULL,
  temperature_predicted DECIMAL(5, 2),
  temperature_min DECIMAL(5, 2),
  temperature_max DECIMAL(5, 2),
  temperature_confidence DECIMAL(5, 2),
  precipitation_probability DECIMAL(5, 2),
  precipitation_amount DECIMAL(5, 2),
  precipitation_confidence DECIMAL(5, 2),
  historical_average DECIMAL(5, 2),
  historical_deviation DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(location_id, date, model)
);
```

#### `model_metrics`
```sql
CREATE TABLE model_metrics (
  id UUID PRIMARY KEY,
  model_id VARCHAR(50) NOT NULL,
  model_name VARCHAR(100) NOT NULL,
  accuracy DECIMAL(5, 2),
  rmse DECIMAL(5, 2),
  mae DECIMAL(5, 2),
  period VARCHAR(50),
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(model_id, period)
);
```

---

## 🔧 Tecnologías Recomendadas

### Backend Framework
- **NestJS** (recomendado) - Arquitectura modular, TypeScript nativo, decoradores
- **Express.js** - Más simple, más control manual

### Base de Datos
- **PostgreSQL** - Para datos históricos y relaciones complejas
- **Redis** - Caché y datos en tiempo real
- **TimescaleDB** (opcional) - Extensión de PostgreSQL para time-series

### ORM/Query Builder
- **Prisma** - Type-safe, migrations automáticas
- **TypeORM** - Más flexible, más configuración manual

### Validación
- **Zod** - TypeScript-first, muy type-safe
- **Joi** - Alternativa popular

### WebSockets
- **Socket.io** - Fácil de usar, fallback automático
- **ws** - Más ligero, más control

### Autenticación
- **JWT** (jsonwebtoken)
- **Passport.js** - Estrategias múltiples

### Documentación
- **Swagger/OpenAPI** - Auto-generación de docs
- **Postman Collection** - Para testing

### Testing
- **Jest** - Unit tests
- **Supertest** - Integration tests

### Deployment
- **Docker** - Containerización
- **PM2** - Process manager
- **Nginx** - Reverse proxy

---

## 📝 Notas Importantes

1. **Caché**: Usar Redis para cachear respuestas frecuentes (current weather, forecasts)
2. **Rate Limiting**: Implementar límites de requests por IP/usuario
3. **Error Handling**: Respuestas consistentes con códigos HTTP apropiados
4. **Logging**: Implementar logging estructurado (Winston, Pino)
5. **Monitoring**: Health checks, métricas de performance
6. **Backup**: Backups automáticos de base de datos
7. **Timezones**: Siempre trabajar en UTC, convertir en frontend
8. **Validación**: Validar todos los inputs con Zod/Joi
9. **Seguridad**: HTTPS, CORS configurado, sanitización de inputs

---

## 🚀 Próximos Pasos

1. Configurar estructura del proyecto
2. Configurar base de datos (PostgreSQL + Redis)
3. Implementar modelos de datos
4. Crear servicios de datos meteorológicos (integración con APIs externas)
5. Implementar endpoints REST
6. Configurar WebSockets
7. Implementar caché con Redis
8. Agregar autenticación
9. Documentar APIs con Swagger
10. Testing y deployment

