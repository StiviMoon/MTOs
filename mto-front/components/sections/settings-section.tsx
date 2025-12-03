"use client"

import { MapPin, Bell, Gauge, MapPinned, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useLocation } from "@/hooks/use-location"

export function SettingsSection() {
  const { location, locationName } = useLocation()

  return (
    <>
      <header className="border-b border-border/40 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/80 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-balance text-foreground">Configuración</h1>
            <p className="text-sm text-muted-foreground mt-1">Personaliza tu experiencia meteorológica</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 bg-background">
              <MapPin className="h-3 w-3" />
              {locationName}
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6 max-w-4xl">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPinned className="h-5 w-5" />
              Ubicación
            </CardTitle>
            <CardDescription>Configura tu ubicación predeterminada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Ciudad</Label>
              <div className="text-sm text-foreground">{locationName}</div>
            </div>
            <div className="space-y-2">
              <Label>Coordenadas</Label>
              <div className="text-sm text-muted-foreground">
                {location ? `${location.latitude}, ${location.longitude}` : "Cargando..."}
              </div>
            </div>
            <Button variant="outline" size="sm">
              Cambiar Ubicación
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>Gestiona tus alertas y notificaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alerts-warning">Alertas de Advertencia</Label>
                <div className="text-sm text-muted-foreground">Recibe notificaciones de alertas críticas</div>
              </div>
              <Switch id="alerts-warning" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="alerts-watch">Alertas de Vigilancia</Label>
                <div className="text-sm text-muted-foreground">Notificaciones de condiciones a vigilar</div>
              </div>
              <Switch id="alerts-watch" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="daily-forecast">Pronóstico Diario</Label>
                <div className="text-sm text-muted-foreground">Resumen diario del clima cada mañana</div>
              </div>
              <Switch id="daily-forecast" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Unidades de Medida
            </CardTitle>
            <CardDescription>Configura las unidades preferidas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Temperatura</Label>
              <div className="flex gap-2">
                <Button variant="default" size="sm">
                  Celsius (°C)
                </Button>
                <Button variant="outline" size="sm">
                  Fahrenheit (°F)
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Velocidad del Viento</Label>
              <div className="flex gap-2">
                <Button variant="default" size="sm">
                  km/h
                </Button>
                <Button variant="outline" size="sm">
                  m/s
                </Button>
                <Button variant="outline" size="sm">
                  mph
                </Button>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Presión</Label>
              <div className="flex gap-2">
                <Button variant="default" size="sm">
                  hPa
                </Button>
                <Button variant="outline" size="sm">
                  inHg
                </Button>
                <Button variant="outline" size="sm">
                  mmHg
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Datos
            </CardTitle>
            <CardDescription>Descarga datos históricos y reportes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Datos del último mes</div>
                <div className="text-sm text-muted-foreground">Exportar en formato CSV</div>
              </div>
              <Button variant="outline" size="sm">
                Descargar CSV
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Reporte Completo</div>
                <div className="text-sm text-muted-foreground">Exportar en formato PDF</div>
              </div>
              <Button variant="outline" size="sm">
                Descargar PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
