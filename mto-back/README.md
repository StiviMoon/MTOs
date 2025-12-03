# MTOs Backend - Sistema de Simulación Meteorológica

Backend sencillo y funcional construido con **FastAPI** y **Python** para simular sensores meteorológicos y exponer datos mediante API REST.

## 🚀 Características

- ✅ Simulación realista de variables meteorológicas
- ✅ API REST completa con todos los endpoints necesarios
- ✅ WebSocket para actualizaciones en tiempo real
- ✅ Actualización automática cada 30 segundos
- ✅ Compatible con el frontend MTOs
- ✅ Código simple y fácil de entender

## 📋 Requisitos

- Python 3.9+
- pip

## 🔧 Instalación

1. **Clonar o navegar al directorio del proyecto:**
```bash
cd mto-back
```

2. **Crear entorno virtual (recomendado):**
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. **Instalar dependencias:**
```bash
pip install -r requirements.txt
```

## 🏃 Ejecución

**Modo desarrollo (con recarga automática):**
```bash
uvicorn main:app --reload
```

**Modo producción:**
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

El servidor estará disponible en: `http://localhost:8000`

## 📚 Documentación

Una vez iniciado el servidor, puedes acceder a:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

## 🔌 Endpoints Principales

### Información General
- `GET /` - Información de la API

### Ubicaciones
- `GET /api/v1/locations` - Lista de ubicaciones disponibles

### Tiempo Actual
- `GET /api/v1/locations/{location_id}/current` - Condiciones actuales

### Pronósticos
- `GET /api/v1/locations/{location_id}/forecast/daily?days=7` - Pronóstico diario
- `GET /api/v1/locations/{location_id}/forecast/hourly?hours=24` - Pronóstico horario

### Alertas
- `GET /api/v1/locations/{location_id}/alerts` - Alertas meteorológicas activas

### Predicciones Avanzadas
- `GET /api/v1/locations/{location_id}/predictions?days=7&model=hybrid` - Predicciones ML
- `GET /api/v1/locations/{location_id}/predictions/heatmap` - Heatmap de temperatura

### Datos Históricos
- `GET /api/v1/locations/{location_id}/historical?hours=24` - Datos históricos
- `GET /api/v1/locations/{location_id}/analytics?period=monthly` - Análisis histórico

### Gráficos
- `GET /api/v1/locations/{location_id}/charts/temperature` - Datos de temperatura
- `GET /api/v1/locations/{location_id}/charts/precipitation` - Datos de precipitación
- `GET /api/v1/locations/{location_id}/charts/wind` - Datos de viento
- `GET /api/v1/locations/{location_id}/charts/pressure-solar` - Presión y radiación
- `GET /api/v1/locations/{location_id}/charts/air-quality` - Calidad del aire
- `GET /api/v1/locations/{location_id}/charts/radar` - Condiciones generales

### WebSocket
- `WS /ws/locations/{location_id}/realtime` - Actualizaciones en tiempo real

## 📊 Variables Simuladas

El sistema simula las siguientes variables meteorológicas:

- **Temperatura:** Aire, sensación térmica, suelo
- **Humedad:** Relativa, punto de rocío, suelo
- **Viento:** Velocidad, dirección, ráfagas
- **Presión:** Atmosférica con tendencia
- **Precipitación:** Actual, últimas 24h, probabilidad
- **Radiación Solar:** W/m², máximo diario
- **Índice UV:** 0-11 con niveles
- **Calidad del Aire:** AQI, PM2.5, PM10, CO₂, O₃
- **Visibilidad:** En kilómetros
- **Condiciones:** Icono, descripción, nubosidad

## 🔄 Funcionamiento

1. El backend inicia y genera el estado inicial
2. Una tarea automática actualiza los datos cada **30 segundos**
3. Los datos se generan usando funciones matemáticas realistas
4. El frontend puede consultar los endpoints para obtener datos
5. WebSocket envía actualizaciones automáticas a clientes conectados

## 🎯 Ejemplo de Uso

### Obtener tiempo actual:
```bash
curl http://localhost:8000/api/v1/locations/loc_001/current
```

### Obtener pronóstico diario:
```bash
curl http://localhost:8000/api/v1/locations/loc_001/forecast/daily?days=7
```

### Conectar WebSocket (JavaScript):
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/locations/loc_001/realtime');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Actualización:', data);
};
```

## 🔧 Configuración

Puedes modificar los parámetros base del simulador en `main.py`:

```python
simulator = WeatherSimulator(
    base_temp=24.0,      # Temperatura base en °C
    base_humidity=68.0   # Humedad base en %
)
```

Y el intervalo de actualización:

```python
await asyncio.sleep(30)  # Cambiar a los segundos deseados
```

## 📁 Estructura del Proyecto

```
mto-back/
├── main.py              # Aplicación FastAPI principal
├── sensors.py           # Simulador de sensores meteorológicos
├── models.py            # Modelos Pydantic para validación
├── requirements.txt     # Dependencias Python
└── README.md           # Este archivo
```

## 🚀 Próximos Pasos (Opcional)

- [ ] Agregar base de datos para historial persistente
- [ ] Implementar autenticación JWT
- [ ] Agregar múltiples ubicaciones
- [ ] Dockerizar la aplicación
- [ ] Agregar tests unitarios
- [ ] Implementar rate limiting
- [ ] Agregar logging estructurado

## 📝 Notas

- Los datos son **simulados** y se generan en tiempo real
- No se requiere conexión a APIs externas
- Perfecto para desarrollo y testing
- Fácil de extender con datos reales

## 🤝 Contribuir

Este es un proyecto de simulación. Siéntete libre de mejorarlo y adaptarlo a tus necesidades.

## 📄 Licencia

MIT

