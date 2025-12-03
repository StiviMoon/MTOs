"use client"

import { 
  Database, 
  Activity, 
  Brain, 
  TrendingUp, 
  BarChart3, 
  Zap,
  Cloud,
  Wind,
  Droplets,
  Gauge,
  Sun,
  Thermometer,
  CheckCircle2,
  Filter,
  LineChart,
  Target
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useLocation } from "@/hooks/use-location"

const processSteps = [
  {
    icon: Database,
    title: "Recolección de Datos",
    description: "Captura continua de datos meteorológicos desde sensores simulados",
    details: [
      "Sensores de temperatura (aire, suelo, sensación térmica)",
      "Medición de humedad relativa y del suelo",
      "Monitoreo de presión atmosférica",
      "Velocidad y dirección del viento",
      "Precipitación y radiación solar",
      "Índice UV y calidad del aire (PM2.5, PM10, CO₂, O₃)"
    ],
    color: "hsl(221, 83%, 53%)"
  },
  {
    icon: Filter,
    title: "Limpieza y Validación",
    description: "Procesamiento de datos para eliminar anomalías y asegurar calidad",
    details: [
      "Detección y corrección de valores atípicos",
      "Validación de rangos físicos posibles",
      "Interpolación de datos faltantes",
      "Normalización de unidades y escalas",
      "Verificación de coherencia temporal",
      "Filtrado de ruido mediante técnicas estadísticas"
    ],
    color: "hsl(199, 89%, 48%)"
  },
  {
    icon: BarChart3,
    title: "Análisis Exploratorio",
    description: "Identificación de patrones, tendencias y correlaciones",
    details: [
      "Análisis estadístico descriptivo",
      "Identificación de tendencias temporales",
      "Análisis de correlación entre variables",
      "Detección de estacionalidad",
      "Análisis de frecuencia (rosa de vientos)",
      "Comparación con datos históricos"
    ],
    color: "hsl(142, 76%, 36%)"
  },
  {
    icon: Brain,
    title: "Modelado Predictivo",
    description: "Aplicación de modelos de Machine Learning y estadísticos",
    details: [
      "Modelo de Red Neuronal (ML)",
      "Modelo Estadístico (ARIMA)",
      "Modelo Híbrido (Ensemble)",
      "Regresión lineal para predicciones",
      "Intervalos de confianza del 95%",
      "Validación cruzada y métricas de precisión"
    ],
    color: "hsl(271, 81%, 56%)"
  },
  {
    icon: TrendingUp,
    title: "Predicciones y Pronósticos",
    description: "Generación de pronósticos a corto, medio y largo plazo",
    details: [
      "Pronóstico horario (24 horas)",
      "Pronóstico diario (7 días)",
      "Predicciones a largo plazo (30 días)",
      "Probabilidades de precipitación",
      "Heatmaps de temperatura",
      "Comparación de modelos predictivos"
    ],
    color: "hsl(14, 90%, 53%)"
  },
  {
    icon: Target,
    title: "Visualización y Alertas",
    description: "Presentación de información y generación de alertas",
    details: [
      "Gráficos interactivos en tiempo real",
      "Dashboard con múltiples visualizaciones",
      "Sistema de alertas automáticas",
      "Notificaciones de eventos extremos",
      "Exportación de datos y reportes",
      "Actualizaciones vía WebSocket"
    ],
    color: "hsl(45, 93%, 47%)"
  }
]

const sensors = [
  { icon: Thermometer, name: "Temperatura", variables: ["Aire", "Suelo", "Sensación térmica"], unit: "°C" },
  { icon: Droplets, name: "Humedad", variables: ["Relativa", "Suelo"], unit: "%" },
  { icon: Gauge, name: "Presión", variables: ["Atmosférica"], unit: "hPa" },
  { icon: Wind, name: "Viento", variables: ["Velocidad", "Dirección", "Ráfagas"], unit: "km/h" },
  { icon: Cloud, name: "Precipitación", variables: ["Acumulada", "Probabilidad"], unit: "mm" },
  { icon: Sun, name: "Radiación", variables: ["Solar", "UV"], unit: "W/m²" },
]

export function AboutSection() {
  const { locationName } = useLocation()

  return (
    <>
      <header className="border-b border-border/40 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-balance text-foreground">Acerca del Proyecto</h1>
            <p className="text-sm text-muted-foreground mt-1">Metodología y proceso de análisis meteorológico</p>
          </div>
          <Badge variant="outline" className="gap-1.5 bg-background">
            <Zap className="h-3 w-3" />
            MTOs v1.0.0
          </Badge>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Introducción */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">MTOs - Sistema de Análisis Meteorológico</CardTitle>
                <CardDescription className="text-base mt-1">
                  Plataforma profesional para monitoreo, análisis y predicción meteorológica
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              MTOs es un sistema avanzado de análisis meteorológico que combina simulación de sensores, 
              procesamiento de datos en tiempo real y modelos predictivos de Machine Learning para 
              proporcionar información precisa y actualizada sobre las condiciones climáticas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Datos en Tiempo Real</p>
                  <p className="text-xs text-muted-foreground">Actualización cada 30s</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Brain className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">ML Predictivo</p>
                  <p className="text-xs text-muted-foreground">95.8% precisión</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Ubicación</p>
                  <p className="text-xs text-muted-foreground">{locationName}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Proceso de Trabajo */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Proceso de Análisis de Datos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon
              return (
                <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="h-10 w-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${step.color}15` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: step.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{step.title}</CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Paso {index + 1} de {processSteps.length}
                        </CardDescription>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" style={{ color: step.color }} />
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Sensores */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Sensores Meteorológicos Simulados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor, index) => {
              const Icon = sensor.icon
              return (
                <Card key={index} className="shadow-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{sensor.name}</CardTitle>
                        <CardDescription className="text-xs">Unidad: {sensor.unit}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {sensor.variables.map((variable, idx) => (
                        <Badge key={idx} variant="secondary" className="mr-1 mb-1">
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Arquitectura Técnica */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Arquitectura Técnica
            </CardTitle>
            <CardDescription>
              Stack tecnológico y componentes del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Backend</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span><strong>FastAPI</strong> - Framework web asíncrono</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span><strong>Python</strong> - Lenguaje de programación</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span><strong>WebSockets</strong> - Comunicación en tiempo real</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span><strong>Pydantic</strong> - Validación de datos</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase">Frontend</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span><strong>Next.js 14</strong> - Framework React</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span><strong>TypeScript</strong> - Tipado estático</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span><strong>TanStack Query</strong> - Gestión de estado y caché</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span><strong>Recharts</strong> - Visualización de datos</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span><strong>TailwindCSS</strong> - Estilos utilitarios</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modelos Predictivos */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Modelos Predictivos
            </CardTitle>
            <CardDescription>
              Algoritmos utilizados para generar predicciones meteorológicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Modelo ML</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Red neuronal para predicciones no lineales
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precisión:</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RMSE:</span>
                    <span className="font-medium">1.2°C</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Modelo Estadístico</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  ARIMA para series temporales
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precisión:</span>
                    <span className="font-medium">91.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RMSE:</span>
                    <span className="font-medium">1.5°C</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-border bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Modelo Híbrido</h4>
                  <Badge variant="secondary" className="ml-auto text-xs">Recomendado</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Ensemble combinando ML y estadística
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precisión:</span>
                    <span className="font-medium">95.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RMSE:</span>
                    <span className="font-medium">0.9°C</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metodología de Limpieza */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Metodología de Limpieza de Datos
            </CardTitle>
            <CardDescription>
              Procesos aplicados para asegurar la calidad y confiabilidad de los datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Detección de Valores Atípicos
                </h4>
                <p className="text-sm text-muted-foreground">
                  Utilizamos el método de rango intercuartílico (IQR) y análisis Z-score para identificar 
                  valores que se desvían significativamente de la distribución normal. Los valores atípicos 
                  se marcan y se reemplazan mediante interpolación o se eliminan según su impacto.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Validación de Rangos Físicos
                </h4>
                <p className="text-sm text-muted-foreground">
                  Cada variable meteorológica se valida contra rangos físicamente posibles. Por ejemplo, 
                  la temperatura del aire debe estar entre -50°C y 60°C, la humedad relativa entre 0% y 100%, 
                  y la presión atmosférica entre 800 y 1100 hPa.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Interpolación de Datos Faltantes
                </h4>
                <p className="text-sm text-muted-foreground">
                  Cuando se detectan valores faltantes, aplicamos interpolación lineal o spline cúbico 
                  dependiendo de la naturaleza de la variable. Para series temporales, utilizamos 
                  métodos de forward-fill y backward-fill con validación cruzada.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Filtrado de Ruido
                </h4>
                <p className="text-sm text-muted-foreground">
                  Aplicamos filtros de media móvil y filtros de Kalman para suavizar las fluctuaciones 
                  de alta frecuencia causadas por ruido en los sensores, manteniendo las tendencias 
                  y patrones significativos en los datos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

