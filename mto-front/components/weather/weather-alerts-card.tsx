"use client"

import { AlertTriangle, CloudRain, Wind, Sun, Zap, Cloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAlerts } from "@/hooks/use-weather"
import { format, formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

const iconMap: Record<string, any> = {
  rain: CloudRain,
  wind: Wind,
  uv: Sun,
  temperature: AlertTriangle,
  air_quality: AlertTriangle,
  storm: Zap,
  cloud: Cloud,
}

export function WeatherAlertsCard() {
  const { data, isLoading, error } = useAlerts()

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !data) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-chart-4" />
            Alertas Meteorológicas Activas
          </CardTitle>
          <CardDescription>No se pudieron cargar las alertas</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const alerts = data.alerts.filter((alert) => alert.isActive)

  if (alerts.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-chart-4" />
            Alertas Meteorológicas Activas
          </CardTitle>
          <CardDescription>No hay alertas activas en este momento</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Todas las condiciones meteorológicas están dentro de los rangos normales.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-chart-4" />
          Alertas Meteorológicas Activas
        </CardTitle>
        <CardDescription>{alerts.length} alerta{alerts.length > 1 ? "s" : ""} activa{alerts.length > 1 ? "s" : ""}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = iconMap[alert.type] || AlertTriangle
            const startTime = new Date(alert.startTime)
            const endTime = new Date(alert.endTime)
            const now = new Date()

            let timeText = ""
            if (now < startTime) {
              timeText = `Inicia ${formatDistanceToNow(startTime, { addSuffix: true, locale: es })}`
            } else if (now > endTime) {
              timeText = `Finalizó ${formatDistanceToNow(endTime, { addSuffix: true, locale: es })}`
            } else {
              timeText = `Hasta ${format(endTime, "HH:mm", { locale: es })}`
            }

            return (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-4 bg-${alert.color}/5 rounded-lg border border-${alert.color}/20`}
              >
                <Icon className={`h-5 w-5 text-${alert.color} mt-0.5`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{alert.title}</span>
                    <Badge
                      variant={alert.severity === "warning" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {alert.severity === "warning"
                        ? "Advertencia"
                        : alert.severity === "watch"
                          ? "Vigilancia"
                          : "Info"}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{timeText}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  {alert.recommendations && alert.recommendations.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-semibold text-foreground mb-1">Recomendaciones:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {alert.recommendations.map((rec, idx) => (
                          <li key={idx}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
