"use client"

import { MapPin, Layers, Satellite, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocation } from "@/hooks/use-location"
import { useCurrentWeather } from "@/hooks/use-weather"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function MapsSection() {
  const { locationName } = useLocation()
  const { data: currentData } = useCurrentWeather()

  const getLastUpdateText = () => {
    if (!currentData?.lastUpdated) return "Cargando..."
    try {
      const date = new Date(currentData.lastUpdated)
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
            <h1 className="text-2xl font-semibold text-balance text-foreground">Mapas Meteorológicos</h1>
            <p className="text-sm text-muted-foreground mt-1">Visualización geoespacial de datos en tiempo real</p>
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
        <Tabs defaultValue="radar" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="radar">Radar</TabsTrigger>
            <TabsTrigger value="satellite">Satélite</TabsTrigger>
            <TabsTrigger value="temperature">Temperatura</TabsTrigger>
            <TabsTrigger value="wind">Vientos</TabsTrigger>
          </TabsList>

          <TabsContent value="radar" className="space-y-6 mt-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Radar de Precipitación
                </CardTitle>
                <CardDescription>Intensidad de lluvia en tiempo real</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg h-[500px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Layers className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Mapa de radar de precipitación</p>
                    <p className="text-sm text-muted-foreground">Integración con servicios de mapas en desarrollo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satellite" className="space-y-6 mt-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Satellite className="h-5 w-5" />
                  Imágenes Satelitales
                </CardTitle>
                <CardDescription>Vista desde satélites meteorológicos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg h-[500px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Satellite className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Imágenes satelitales en tiempo real</p>
                    <p className="text-sm text-muted-foreground">Integración con servicios de mapas en desarrollo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="temperature" className="space-y-6 mt-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Mapa de Temperatura</CardTitle>
                <CardDescription>Distribución térmica regional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg h-[500px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Mapa de distribución de temperatura</p>
                    <p className="text-sm text-muted-foreground">Integración con servicios de mapas en desarrollo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wind" className="space-y-6 mt-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="h-5 w-5" />
                  Mapa de Vientos
                </CardTitle>
                <CardDescription>Dirección y velocidad del viento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg h-[500px] flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Wind className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">Mapa de corrientes de viento</p>
                    <p className="text-sm text-muted-foreground">Integración con servicios de mapas en desarrollo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
