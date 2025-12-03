/**
 * Hook para WebSocket - Actualizaciones en tiempo real
 */

import { useEffect, useRef, useState, useCallback } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { weatherKeys } from "./use-weather"
import type { CurrentWeather } from "@/lib/api"

// Usar la misma base URL que la API, pero con protocolo ws://
const getWebSocketBaseUrl = (): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  // Convertir http:// a ws:// o https:// a wss://
  return apiUrl.replace(/^http/, "ws")
}

interface WebSocketMessage {
  type: string
  locationId: string
  data: CurrentWeather
  timestamp: string
}

export const useWeatherWebSocket = (locationId: string = "loc_001") => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const queryClient = useQueryClient()
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const connect = useCallback(() => {
    // Evitar múltiples conexiones simultáneas
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return
    }

    try {
      const baseUrl = getWebSocketBaseUrl()
      const wsUrl = `${baseUrl}/ws/locations/${locationId}/realtime`
      
      // Solo conectar en el cliente
      if (typeof window === "undefined") {
        return
      }

      const ws = new WebSocket(wsUrl)

      ws.onopen = () => {
        console.log("✅ WebSocket conectado a:", wsUrl)
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }
      }

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)

          if (message.type === "current_weather_update") {
            // Actualizar el cache de React Query
            queryClient.setQueryData(weatherKeys.current(locationId), {
              location: {
                id: locationId,
                name: "Yumbo",
                country: "Colombia",
                latitude: 3.5570,
                longitude: -74.7812,
                timezone: "America/Bogota",
              },
              current: message.data,
              lastUpdated: message.timestamp,
            })

            setLastUpdate(message.timestamp)
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
          setError("Error al procesar mensaje del servidor")
        }
      }

      ws.onerror = (event) => {
        // El evento de error no tiene mucha información útil
        // El error real se verá en onclose
        console.warn("⚠️ WebSocket error event (detalles en onclose)")
        setIsConnected(false)
      }

      ws.onclose = (event) => {
        setIsConnected(false)
        
        // Determinar el tipo de error
        let errorMessage: string | null = null
        if (event.code === 1006) {
          errorMessage = "No se pudo conectar al servidor. Verifica que el backend esté ejecutándose."
        } else if (event.code !== 1000) {
          errorMessage = `Conexión cerrada (código: ${event.code})`
        }
        setError(errorMessage)

        // Intentar reconectar solo si no fue un cierre intencional
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1
          const delay = Math.min(3000 * reconnectAttemptsRef.current, 30000) // Max 30 segundos
          console.log(`🔄 Intentando reconectar WebSocket (intento ${reconnectAttemptsRef.current}/${maxReconnectAttempts}) en ${delay}ms...`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error("❌ Máximo de intentos de reconexión alcanzado. WebSocket deshabilitado.")
          setError("No se pudo conectar después de varios intentos. Por favor, recarga la página.")
        } else {
          console.log("✅ WebSocket cerrado intencionalmente")
        }
      }

      wsRef.current = ws
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error desconocido"
      console.error("❌ Error connecting WebSocket:", errorMsg)
      setError(`Error al conectar: ${errorMsg}`)
      setIsConnected(false)
    }
  }, [locationId, queryClient])

  useEffect(() => {
    connect()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connect])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
  }, [])

  return {
    isConnected,
    lastUpdate,
    error,
    disconnect,
    reconnect: connect,
  }
}

