#!/bin/bash
# Script de inicio para Render
# Render asigna un puerto interno ($PORT) que la app debe usar
# Render luego mapea ese puerto a la URL pública (ej: https://tu-app.onrender.com)

# Asegurar que PORT esté definido
if [ -z "$PORT" ]; then
    PORT=8000
fi

echo "🚀 Iniciando MTOs Backend..."
echo "📍 Puerto: $PORT"
echo "🌐 Host: 0.0.0.0"

# Ejecutar uvicorn con parámetros explícitos
exec uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1

