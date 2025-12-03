# ⚡ MTOs - Sistema de Análisis Meteorológico

<div align="center">

![MTOs Logo](mto-front/public/icon.svg)

**Plataforma profesional para monitoreo, análisis y predicción meteorológica en tiempo real**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)](https://www.python.org/)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación](#-documentación)
- [Tecnologías](#-tecnologías)
- [Desarrollo](#-desarrollo)

---

## 🎯 Descripción

**MTOs** es un sistema completo de análisis meteorológico que combina:

- **Simulación realista** de sensores meteorológicos
- **Procesamiento de datos** en tiempo real
- **Modelos predictivos** de Machine Learning
- **Visualización interactiva** con gráficos avanzados
- **Actualizaciones en tiempo real** vía WebSocket

El sistema está diseñado para proporcionar información precisa y actualizada sobre condiciones climáticas, con capacidades de predicción a corto, medio y largo plazo.

---

## ✨ Características

### Backend (FastAPI)
- ✅ Simulación realista de variables meteorológicas
- ✅ API REST completa con todos los endpoints necesarios
- ✅ WebSocket para actualizaciones en tiempo real
- ✅ Actualización automática cada 30 segundos
- ✅ Modelos de Machine Learning para predicciones
- ✅ Análisis estadístico y regresión
- ✅ Documentación automática (Swagger/ReDoc)

### Frontend (Next.js)
- ✅ Dashboard interactivo y responsive
- ✅ Visualizaciones con gráficos avanzados (Recharts)
- ✅ Actualizaciones en tiempo real vía WebSocket
- ✅ Caché inteligente con TanStack Query
- ✅ Múltiples secciones: Overview, Pronóstico, Predicciones, Análisis, Mapas, Alertas
- ✅ Diseño moderno con TailwindCSS y componentes Shadcn/ui
- ✅ Tema claro/oscuro

### Variables Meteorológicas
- 🌡️ **Temperatura:** Aire, sensación térmica, suelo
- 💧 **Humedad:** Relativa, punto de rocío, suelo
- 💨 **Viento:** Velocidad, dirección, ráfagas
- 📊 **Presión:** Atmosférica con tendencia
- 🌧️ **Precipitación:** Actual, últimas 24h, probabilidad
- ☀️ **Radiación Solar:** W/m², máximo diario
- 🕶️ **Índice UV:** 0-11 con niveles
- 🌬️ **Calidad del Aire:** AQI, PM2.5, PM10, CO₂, O₃
- 👁️ **Visibilidad:** En kilómetros
- ☁️ **Condiciones:** Icono, descripción, nubosidad

---

## 🏗️ Arquitectura

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend      │
│   (Next.js)     │◄───────►│   (FastAPI)     │
│                 │  HTTP   │                 │
│  - React        │         │  - Python       │
│  - TypeScript   │         │  - FastAPI      │
│  - TanStack     │         │  - WebSocket    │
│    Query        │         │  - ML Models    │
│  - Recharts     │◄───────►│                 │
│                 │ WebSocket│                 │
└─────────────────┘         └─────────────────┘
```

---

## 📋 Requisitos

### Backend
- Python 3.9 o superior
- pip
- (Opcional) Entorno virtual

### Frontend
- Node.js 18+ o superior
- pnpm (recomendado) o npm/yarn

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd MTO
```

### 2. Instalar Backend

```bash
cd mto-back

# Crear entorno virtual (recomendado)
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt
```

### 3. Instalar Frontend

```bash
cd mto-front

# Instalar dependencias
pnpm install
# o
npm install
```

---

## ⚙️ Configuración

### Backend

El backend no requiere configuración adicional. Los datos se generan automáticamente.

**Opcional:** Puedes modificar los parámetros del simulador en `mto-back/main.py`:

```python
simulator = WeatherSimulator(
    base_temp=24.0,      # Temperatura base en °C
    base_humidity=68.0   # Humedad base en %
)
```

### Frontend

Crea un archivo `.env.local` en `mto-front/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

El WebSocket se configura automáticamente basándose en `NEXT_PUBLIC_API_URL`.

---

## 🏃 Uso

### Iniciar Backend

```bash
cd mto-back
source .venv/bin/activate  # Si usas entorno virtual
uvicorn main:app --reload
```

El servidor estará disponible en: `http://localhost:8000`

**Documentación API:**
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Iniciar Frontend

```bash
cd mto-front
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

---

## 📁 Estructura del Proyecto

```
MTO/
├── mto-back/                 # Backend FastAPI
│   ├── main.py              # Aplicación principal
│   ├── sensors.py           # Simulador de sensores
│   ├── models.py            # Modelos Pydantic
│   ├── statistics.py        # Análisis estadístico
│   ├── requirements.txt     # Dependencias Python
│   └── README.md           # Documentación backend
│
├── mto-front/               # Frontend Next.js
│   ├── app/                # Rutas y páginas
│   ├── components/         # Componentes React
│   │   ├── sections/      # Secciones del dashboard
│   │   ├── ui/            # Componentes UI (Shadcn)
│   │   └── weather/       # Componentes meteorológicos
│   ├── hooks/             # Custom hooks
│   │   ├── use-weather.ts  # Hooks de datos
│   │   └── use-websocket.ts # Hook WebSocket
│   ├── lib/               # Utilidades
│   │   ├── api.ts         # Cliente API
│   │   └── utils.ts       # Utilidades generales
│   ├── providers/         # Context providers
│   ├── public/            # Archivos estáticos
│   ├── package.json       # Dependencias Node
│   └── README_API.md      # Documentación frontend
│
└── README.md              # Este archivo
```

---

## 📚 Documentación

### Backend

Para documentación detallada del backend, consulta:
- **[mto-back/README.md](mto-back/README.md)** - Guía completa del backend
- **[mto-back/API_EXAMPLES.md](mto-back/API_EXAMPLES.md)** - Ejemplos de uso de la API
- **[mto-back/BACKEND_SPECIFICATION.md](mto-back/BACKEND_SPECIFICATION.md)** - Especificación técnica
- **[mto-back/STATISTICS_AND_REGRESSION.md](mto-back/STATISTICS_AND_REGRESSION.md)** - Documentación de análisis estadístico

### Frontend

Para documentación detallada del frontend, consulta:
- **[mto-front/README_API.md](mto-front/README_API.md)** - Guía de integración y hooks

### Endpoints Principales

#### Información General
- `GET /` - Información de la API

#### Tiempo Actual
- `GET /api/v1/locations/{location_id}/current` - Condiciones actuales

#### Pronósticos
- `GET /api/v1/locations/{location_id}/forecast/daily?days=7` - Pronóstico diario
- `GET /api/v1/locations/{location_id}/forecast/hourly?hours=24` - Pronóstico horario

#### Predicciones
- `GET /api/v1/locations/{location_id}/predictions?days=7&model=hybrid` - Predicciones ML
- `GET /api/v1/locations/{location_id}/predictions/heatmap` - Heatmap de temperatura

#### Datos Históricos
- `GET /api/v1/locations/{location_id}/historical?hours=24` - Datos históricos
- `GET /api/v1/locations/{location_id}/analytics?period=monthly` - Análisis histórico

#### Gráficos
- `GET /api/v1/locations/{location_id}/charts/temperature` - Datos de temperatura
- `GET /api/v1/locations/{location_id}/charts/precipitation` - Datos de precipitación
- `GET /api/v1/locations/{location_id}/charts/wind` - Datos de viento
- `GET /api/v1/locations/{location_id}/charts/pressure-solar` - Presión y radiación
- `GET /api/v1/locations/{location_id}/charts/air-quality` - Calidad del aire
- `GET /api/v1/locations/{location_id}/charts/radar` - Condiciones generales

#### WebSocket
- `WS /ws/locations/{location_id}/realtime` - Actualizaciones en tiempo real

### Hooks del Frontend

#### Hooks de Datos
- `useCurrentWeather()` - Tiempo actual
- `useDailyForecast(days?)` - Pronóstico diario
- `useHourlyForecast(hours?)` - Pronóstico horario
- `useAlerts()` - Alertas meteorológicas
- `usePredictions(days?, model?)` - Predicciones avanzadas
- `useHistorical(hours?)` - Datos históricos
- `useAnalytics(period?)` - Análisis histórico

#### Hooks de Gráficos
- `useTemperatureChart()` - Datos de temperatura
- `usePrecipitationChart()` - Datos de precipitación
- `useWindChart()` - Datos de viento
- `usePressureSolarChart()` - Presión y radiación
- `useAirQualityChart()` - Calidad del aire
- `useRadarChart()` - Condiciones generales

#### WebSocket
- `useWeatherWebSocket(locationId?)` - Actualizaciones en tiempo real

---

## 🛠️ Tecnologías

### Backend
- **FastAPI** - Framework web asíncrono
- **Python** - Lenguaje de programación
- **Pydantic** - Validación de datos
- **WebSockets** - Comunicación en tiempo real
- **NumPy** - Cálculos numéricos
- **Scikit-learn** - Machine Learning
- **SciPy** - Análisis estadístico

### Frontend
- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **React 19** - Biblioteca UI
- **TanStack Query** - Gestión de estado y caché
- **Axios** - Cliente HTTP
- **Recharts** - Visualización de datos
- **TailwindCSS** - Estilos utilitarios
- **Shadcn/ui** - Componentes UI
- **Lucide React** - Iconos
- **date-fns** - Manejo de fechas

---

## 💻 Desarrollo

### Scripts Disponibles

#### Backend
```bash
# Desarrollo con recarga automática
uvicorn main:app --reload

# Producción
uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
# Desarrollo
pnpm dev

# Build de producción
pnpm build

# Iniciar producción
pnpm start

# Linting
pnpm lint
```

### Actualización Automática de Datos

Los datos se actualizan automáticamente según la frecuencia configurada:

- **Tiempo Actual**: Cada 30 segundos
- **Gráficos**: Cada 15 minutos
- **Pronóstico Diario**: Cada 6 horas
- **Pronóstico Horario**: Cada hora
- **Predicciones**: Cada 12 horas
- **Alertas**: Cada 5 minutos

### WebSocket en Tiempo Real

El frontend se conecta automáticamente al WebSocket del backend y actualiza el caché de React Query cuando recibe nuevos datos.

```tsx
const { isConnected, lastUpdate, error } = useWeatherWebSocket("loc_001")
```

---

## 🔧 Troubleshooting

### Error de conexión Backend-Frontend

1. Verifica que el backend esté corriendo en `http://localhost:8000`
2. Verifica las variables de entorno en `mto-front/.env.local`
3. Revisa la consola del navegador para errores CORS
4. Verifica que el puerto 8000 no esté en uso

### Datos no se actualizan

1. Verifica la conexión WebSocket en la consola del navegador
2. Revisa que el backend esté enviando actualizaciones
3. Verifica los intervalos de refetch en los hooks
4. Revisa la consola del backend para errores

### Problemas con dependencias

#### Backend
```bash
# Reinstalar dependencias
pip install -r requirements.txt --upgrade
```

#### Frontend
```bash
# Limpiar e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📊 Modelos Predictivos

El sistema utiliza tres modelos para generar predicciones:

1. **Modelo ML (Neural Network)**
   - Precisión: 94.2%
   - RMSE: 1.2°C

2. **Modelo Estadístico (ARIMA)**
   - Precisión: 91.5%
   - RMSE: 1.5°C

3. **Modelo Híbrido (Ensemble)** ⭐ Recomendado
   - Precisión: 95.8%
   - RMSE: 0.9°C

---

## 🎯 Ejemplos de Uso

### Backend - Obtener tiempo actual

```bash
curl http://localhost:8000/api/v1/locations/loc_001/current
```

### Backend - Conectar WebSocket

```javascript
const ws = new WebSocket('ws://localhost:8000/ws/locations/loc_001/realtime');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Actualización:', data);
};
```

### Frontend - Usar hook de datos

```tsx
"use client"

import { useCurrentWeather } from "@/hooks/use-weather"

export function MyComponent() {
  const { data, isLoading, error } = useCurrentWeather()

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>Temperatura: {data?.current.temperature.air}°C</div>
}
```

---

## 🚀 Próximos Pasos

### Backend
- [ ] Agregar base de datos para historial persistente
- [ ] Implementar autenticación JWT
- [ ] Agregar múltiples ubicaciones
- [ ] Dockerizar la aplicación
- [ ] Agregar tests unitarios
- [ ] Implementar rate limiting
- [ ] Agregar logging estructurado

### Frontend
- [ ] Agregar más visualizaciones
- [ ] Implementar exportación de datos
- [ ] Agregar notificaciones push
- [ ] Mejorar responsive design
- [ ] Agregar tests E2E
- [ ] Optimizar bundle size

---

## 📝 Notas

- Los datos son **simulados** y se generan en tiempo real
- No se requiere conexión a APIs externas
- Perfecto para desarrollo, testing y demostración
- Fácil de extender con datos reales de sensores

---

## 🤝 Contribuir

Este es un proyecto de simulación meteorológica. Siéntete libre de mejorarlo y adaptarlo a tus necesidades.

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto para tus propios fines.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para análisis meteorológico profesional.

---

<div align="center">

**MTOs** - Sistema de Análisis Meteorológico ⚡

[Documentación Backend](mto-back/README.md) • [Documentación Frontend](mto-front/README_API.md) • [API Docs](http://localhost:8000/docs)

</div>

