"use client"

import { MapPin, AlertTriangle, CloudRain, Wind, Sun, Zap, Cloud } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocation } from "@/hooks/use-location"
import { useAlerts } from "@/hooks/use-weather"
import { formatDistanceToNow, format } from "date-fns"
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

export function AlertsSection() {
  const { locationName } = useLocation()
  const { data: alertsData } = useAlerts()

  const getLastUpdateText = () => {
    if (!alertsData?.lastUpdated) return "Cargando..."
    try {
      const date = new Date(alertsData.lastUpdated)
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    } catch {
      return "Reciente"
    }
  }

  return (
    <>
      <header className="border-b border-border/40 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-balance text-foreground">Centro de Alertas</h1>
            <p className="text-sm text-muted-foreground mt-1">Avisos y advertencias meteorológicas</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 bg-background">
              <MapPin className="h-3 w-3" />
              {locationName}
            </Badge>
            <Button variant="outline" size="sm" className="bg-background">
              Última actualización: {getLastUpdateText()}
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {alertsData ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Alertas Activas</h2>
                <p className="text-sm text-muted-foreground">
                  {alertsData.alerts.filter((a) => a.isActive).length} alerta
                  {alertsData.alerts.filter((a) => a.isActive).length !== 1 ? "s" : ""} requieren atención
                </p>
              </div>
              <Badge variant="destructive" className="gap-1.5">
                <AlertTriangle className="h-3 w-3" />
                {alertsData.alerts.filter((a) => a.isActive && a.severity === "warning").length} Advertencias
              </Badge>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="active">Activas</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4 mt-6">
                {alertsData.alerts.filter((a) => a.isActive).length === 0 ? (
                  <Card className="shadow-sm">
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No hay alertas activas en este momento
                    </CardContent>
                  </Card>
                ) : (
                  alertsData.alerts
                    .filter((a) => a.isActive)
                    .map((alert) => {
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
                        <Card
                          key={alert.id}
                          className="shadow-sm border-l-4"
                          style={{ borderLeftColor: `hsl(var(--${alert.color}))` }}
                        >
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg bg-${alert.color}/10`}>
                                  <Icon className={`h-6 w-6 text-${alert.color}`} />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{alert.title}</CardTitle>
                                  <CardDescription className="mt-1">{timeText}</CardDescription>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  alert.severity === "warning"
                                    ? "destructive"
                                    : alert.severity === "watch"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {alert.severity === "warning"
                                  ? "Advertencia"
                                  : alert.severity === "watch"
                                    ? "Vigilancia"
                                    : "Información"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <p className="text-sm text-foreground">{alert.description}</p>

                            {alert.recommendations && alert.recommendations.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-foreground mb-2">Recomendaciones:</h4>
                                <ul className="space-y-1">
                                  {alert.recommendations.map((rec, idx) => (
                                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                      <span className="text-chart-1 mt-1">•</span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {alert.affectedAreas && alert.affectedAreas.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-foreground mb-2">Áreas Afectadas:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {alert.affectedAreas.map((area, idx) => (
                                    <Badge key={idx} variant="outline">
                                      {area}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4 mt-6">
                {alertsData.alerts.filter((a) => !a.isActive).length === 0 ? (
                  <Card className="shadow-sm">
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No hay alertas en el historial
                    </CardContent>
                  </Card>
                ) : (
                  alertsData.alerts
                    .filter((a) => !a.isActive)
                    .map((alert) => {
                      const Icon = iconMap[alert.type] || AlertTriangle
                      const date = new Date(alert.createdAt)
                      return (
                        <Card key={alert.id} className="shadow-sm opacity-75">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-muted">
                                  <Icon className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{alert.title}</CardTitle>
                                  <CardDescription className="mt-1">
                                    {formatDistanceToNow(date, { addSuffix: true, locale: es })}
                                  </CardDescription>
                                </div>
                              </div>
                              <Badge variant="outline">Finalizada</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{alert.description}</p>
                          </CardContent>
                        </Card>
                      )
                    })
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">Cargando alertas...</div>
        )}
      </div>
    </>
  )
}
