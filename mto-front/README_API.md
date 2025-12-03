# Integración con Backend - MTOs Frontend

## 🚀 Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

### 2. Instalar Dependencias

```bash
pnpm install
```

Esto instalará:
- `@tanstack/react-query` - Para manejo de estado y caché
- `axios` - Cliente HTTP
- `date-fns` - Para formateo de fechas (ya incluido)

### 3. Iniciar Backend

Asegúrate de que el backend esté corriendo:

```bash
cd ../mto-back
uvicorn main:app --reload
```

### 4. Iniciar Frontend

```bash
pnpm dev
```

## 📡 Hooks Disponibles

### Hooks de Datos

- `useCurrentWeather()` - Tiempo actual
- `useDailyForecast(days?)` - Pronóstico diario
- `useHourlyForecast(hours?)` - Pronóstico horario
- `useAlerts()` - Alertas meteorológicas
- `usePredictions(days?, model?)` - Predicciones avanzadas
- `useHistorical(hours?)` - Datos históricos
- `useAnalytics(period?)` - Análisis histórico

### Hooks de Gráficos

- `useTemperatureChart()` - Datos de temperatura
- `usePrecipitationChart()` - Datos de precipitación
- `useWindChart()` - Datos de viento
- `usePressureSolarChart()` - Presión y radiación
- `useAirQualityChart()` - Calidad del aire
- `useRadarChart()` - Condiciones generales

### WebSocket

- `useWeatherWebSocket(locationId?)` - Actualizaciones en tiempo real

## 🔄 Actualización Automática

Los datos se actualizan automáticamente según la frecuencia configurada:

- **Tiempo Actual**: Cada 30 segundos
- **Gráficos**: Cada 15 minutos
- **Pronóstico Diario**: Cada 6 horas
- **Pronóstico Horario**: Cada hora
- **Predicciones**: Cada 12 horas
- **Alertas**: Cada 5 minutos

## 📊 WebSocket en Tiempo Real

El hook `useWeatherWebSocket` se conecta automáticamente y actualiza el cache de React Query cuando recibe nuevos datos.

```tsx
const { isConnected, lastUpdate } = useWeatherWebSocket()
```

## 🎯 Ejemplo de Uso

```tsx
"use client"

import { useCurrentWeather } from "@/hooks/use-weather"

export function MyComponent() {
  const { data, isLoading, error } = useCurrentWeather()

  if (isLoading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>Temperatura: {data.current.temperature.air}°C</div>
}
```

## 🔧 Troubleshooting

### Error de conexión

1. Verifica que el backend esté corriendo en `http://localhost:8000`
2. Verifica las variables de entorno en `.env.local`
3. Revisa la consola del navegador para errores CORS

### Datos no se actualizan

1. Verifica la conexión WebSocket en la consola
2. Revisa que el backend esté enviando actualizaciones
3. Verifica los intervalos de refetch en los hooks

## 📝 Notas

- Todos los hooks incluyen estados de loading y error
- Los datos se cachean automáticamente con React Query
- El WebSocket se reconecta automáticamente si se desconecta

