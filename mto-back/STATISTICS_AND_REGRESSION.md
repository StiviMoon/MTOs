# Estadística Descriptiva y Regresión Lineal - Documentación Técnica

## 📋 Índice

1. [Introducción](#introducción)
2. [Estadística Descriptiva](#estadística-descriptiva)
3. [Regresión Lineal](#regresión-lineal)
4. [Implementación en el Backend](#implementación-en-el-backend)
5. [Ejemplos de Uso](#ejemplos-de-uso)
6. [Interpretación de Resultados](#interpretación-de-resultados)
7. [Limitaciones y Consideraciones](#limitaciones-y-consideraciones)

---

## 🎯 Introducción

Este documento explica cómo el backend MTOs utiliza **estadística descriptiva** y **regresión lineal** para analizar y predecir variables meteorológicas. Estas técnicas nos permiten:

- **Comprender** el comportamiento histórico de las variables meteorológicas
- **Predecir** valores futuros basados en tendencias
- **Identificar** relaciones entre diferentes variables climáticas

---

## 📊 Estadística Descriptiva

### ¿Qué es la Estadística Descriptiva?

La estadística descriptiva es una rama de la estadística que se encarga de **resumir, organizar y presentar** datos de manera que sean más fáciles de entender. No hace inferencias sobre poblaciones más grandes, sino que describe las características de los datos que tenemos.

### Medidas de Tendencia Central

Estas medidas nos indican dónde se "concentra" el conjunto de datos:

#### 1. **Media (Mean)**
La media es el promedio aritmético de todos los valores.

**Fórmula:**
```
μ = (Σxᵢ) / n
```

**Ejemplo:**
Si tenemos temperaturas: [20, 22, 24, 21, 23]
Media = (20 + 22 + 24 + 21 + 23) / 5 = 22°C

**Interpretación:** La temperatura promedio es de 22°C.

#### 2. **Mediana (Median)**
La mediana es el valor que divide los datos en dos mitades iguales cuando están ordenados.

**Cálculo:**
1. Ordenar los datos de menor a mayor
2. Si hay un número impar de datos, la mediana es el valor central
3. Si hay un número par, la mediana es el promedio de los dos valores centrales

**Ejemplo:**
Datos ordenados: [20, 21, 22, 23, 24]
Mediana = 22°C (valor central)

**Interpretación:** El 50% de las temperaturas están por debajo de 22°C y el 50% por encima.

#### 3. **Moda (Mode)**
La moda es el valor que aparece con mayor frecuencia.

**Ejemplo:**
Temperaturas: [20, 22, 22, 24, 22]
Moda = 22°C (aparece 3 veces)

**Interpretación:** La temperatura más común es 22°C.

### Medidas de Dispersión

Estas medidas nos indican qué tan "esparcidos" están los datos:

#### 1. **Rango (Range)**
Diferencia entre el valor máximo y mínimo.

**Fórmula:**
```
Rango = Máximo - Mínimo
```

**Ejemplo:**
Temperaturas: [18, 20, 22, 24, 26]
Rango = 26 - 18 = 8°C

**Interpretación:** Las temperaturas varían en un rango de 8°C.

#### 2. **Varianza (Variance)**
Mide qué tan dispersos están los datos respecto a la media.

**Fórmula:**
```
σ² = Σ(xᵢ - μ)² / (n - 1)
```

**Interpretación:** 
- Varianza pequeña = datos concentrados cerca de la media
- Varianza grande = datos muy dispersos

#### 3. **Desviación Estándar (Standard Deviation)**
Es la raíz cuadrada de la varianza. Tiene las mismas unidades que los datos originales.

**Fórmula:**
```
σ = √σ²
```

**Ejemplo:**
Si la desviación estándar de temperatura es 2.5°C, significa que la mayoría de los valores están dentro de ±2.5°C de la media.

**Interpretación:**
- σ pequeña = datos muy concentrados
- σ grande = datos muy dispersos

#### 4. **Coeficiente de Variación (CV)**
Expresa la desviación estándar como porcentaje de la media.

**Fórmula:**
```
CV = (σ / μ) × 100%
```

**Interpretación:**
- CV < 15%: Baja variabilidad
- CV 15-35%: Variabilidad moderada
- CV > 35%: Alta variabilidad

### Cuartiles y Percentiles

#### **Cuartiles**
Dividen los datos en 4 partes iguales:

- **Q1 (Primer Cuartil)**: 25% de los datos están por debajo
- **Q2 (Segundo Cuartil)**: Es igual a la mediana (50%)
- **Q3 (Tercer Cuartil)**: 75% de los datos están por debajo

#### **Rango Intercuartílico (IQR)**
```
IQR = Q3 - Q1
```

**Interpretación:** El IQR contiene el 50% central de los datos. Es útil para identificar valores atípicos.

#### **Percentiles**
Similar a los cuartiles, pero dividen los datos en 100 partes:

- **P10**: 10% de los datos están por debajo
- **P90**: 90% de los datos están por debajo
- **P95**: 95% de los datos están por debajo
- **P99**: 99% de los datos están por debajo

### Estadísticas Avanzadas

#### 1. **Asimetría (Skewness)**
Mide la simetría de la distribución de datos.

**Interpretación:**
- **Skewness = 0**: Distribución simétrica (normal)
- **Skewness > 0**: Sesgo positivo (cola hacia la derecha, más valores bajos)
- **Skewness < 0**: Sesgo negativo (cola hacia la izquierda, más valores altos)

**Ejemplo en Meteorología:**
Si la temperatura tiene skewness positivo, significa que hay más días fríos que cálidos.

#### 2. **Curtosis (Kurtosis)**
Mide qué tan "picuda" o "plana" es la distribución comparada con una distribución normal.

**Interpretación:**
- **Kurtosis = 0**: Distribución normal (mesocúrtica)
- **Kurtosis > 0**: Distribución más picuda (leptocúrtica) - valores más concentrados
- **Kurtosis < 0**: Distribución más plana (platicúrtica) - valores más dispersos

#### 3. **Error Estándar de la Media (SEM)**
Mide la precisión de la media muestral como estimador de la media poblacional.

**Fórmula:**
```
SEM = σ / √n
```

**Interpretación:** Cuanto menor el SEM, más confiable es nuestra estimación de la media.

#### 4. **Intervalo de Confianza al 95%**
Rango de valores dentro del cual esperamos que esté la verdadera media poblacional con un 95% de confianza.

**Fórmula:**
```
IC 95% = μ ± (t × SEM)
```

Donde `t` es el valor crítico de la distribución t de Student.

**Interpretación:** Si el intervalo de confianza de temperatura es [21.5, 22.5]°C, podemos estar 95% seguros de que la verdadera temperatura promedio está en ese rango.

---

## 📈 Regresión Lineal

### ¿Qué es la Regresión Lineal?

La regresión lineal es un método estadístico que nos permite **modelar la relación** entre una variable dependiente (lo que queremos predecir) y una o más variables independientes (predictores), asumiendo que esta relación es **lineal**.

### Ecuación de la Recta

La regresión lineal simple se representa con la ecuación:

```
y = mx + b
```

Donde:
- **y**: Variable dependiente (lo que queremos predecir)
- **x**: Variable independiente (el tiempo, en nuestro caso)
- **m**: Pendiente o coeficiente (tasa de cambio)
- **b**: Intercepto (valor cuando x = 0)

### ¿Cómo Funciona?

1. **Recopilamos datos históricos**: Por ejemplo, temperaturas de las últimas 24 horas
2. **Entrenamos el modelo**: El algoritmo encuentra la mejor línea que se ajusta a los datos
3. **Hacemos predicciones**: Usamos la ecuación para predecir valores futuros

### Proceso Paso a Paso

#### Paso 1: Preparación de Datos

```python
# Datos históricos de temperatura
tiempo = [0, 1, 2, 3, 4, 5, ...]  # Horas desde el inicio
temperatura = [20, 21, 22, 23, 22, 21, ...]  # Temperaturas en °C
```

#### Paso 2: Entrenamiento del Modelo

El algoritmo de regresión lineal encuentra los valores óptimos de `m` y `b` que minimizan el error entre los valores reales y los predichos.

**Método: Mínimos Cuadrados**
```
m = Σ(xᵢ - x̄)(yᵢ - ȳ) / Σ(xᵢ - x̄)²
b = ȳ - m × x̄
```

#### Paso 3: Predicción

Una vez que tenemos `m` y `b`, podemos predecir valores futuros:

```python
# Predicción para la hora 25
temperatura_predicha = m × 25 + b
```

### Métricas de Evaluación del Modelo

#### 1. **Coeficiente de Determinación (R²)**

Mide qué tan bien el modelo explica la variabilidad de los datos.

**Fórmula:**
```
R² = 1 - (SS_res / SS_tot)
```

Donde:
- **SS_res**: Suma de cuadrados de los residuos (errores)
- **SS_tot**: Suma total de cuadrados

**Interpretación:**
- **R² = 1.0**: El modelo explica el 100% de la variabilidad (perfecto)
- **R² = 0.8**: El modelo explica el 80% de la variabilidad (bueno)
- **R² = 0.5**: El modelo explica el 50% de la variabilidad (moderado)
- **R² = 0.0**: El modelo no explica nada (inútil)

**Ejemplo:**
Si R² = 0.85 para predicción de temperatura, significa que el 85% de la variación en temperatura puede ser explicada por el modelo lineal.

#### 2. **Error Cuadrático Medio (RMSE)**

Mide el error promedio del modelo en las mismas unidades que la variable predicha.

**Fórmula:**
```
RMSE = √(Σ(yᵢ - ŷᵢ)² / n)
```

**Interpretación:**
- RMSE = 1.5°C significa que, en promedio, nuestras predicciones tienen un error de ±1.5°C
- **Menor RMSE = Mejor modelo**

#### 3. **Error Absoluto Medio (MAE)**

Similar al RMSE, pero usa valores absolutos en lugar de cuadrados.

**Fórmula:**
```
MAE = Σ|yᵢ - ŷᵢ| / n
```

**Interpretación:**
- MAE = 1.2°C significa que el error promedio es de 1.2°C
- **Menor MAE = Mejor modelo**

#### 4. **Error Cuadrático Medio (MSE)**

Es el RMSE al cuadrado. Penaliza más los errores grandes.

**Fórmula:**
```
MSE = Σ(yᵢ - ŷᵢ)² / n
```

### Intervalos de Confianza para Predicciones

No solo predecimos un valor, sino que también proporcionamos un **rango de confianza**:

```
Predicción ± (1.96 × Desviación Estándar de Residuos)
```

**Interpretación:**
Si predecimos 22°C con intervalo [20.5, 23.5]°C al 95% de confianza:
- El valor más probable es 22°C
- Estamos 95% seguros de que el valor real estará entre 20.5°C y 23.5°C

---

## 🔧 Implementación en el Backend

### Arquitectura del Módulo de Estadísticas

El backend implementa tres clases principales:

#### 1. `DescriptiveStatistics`
```python
class DescriptiveStatistics:
    @staticmethod
    def calculate_basic_stats(data: List[float]) -> Dict
    @staticmethod
    def calculate_advanced_stats(data: List[float]) -> Dict
    @staticmethod
    def calculate_weather_statistics(historical_data: List[Dict]) -> Dict
```

**Responsabilidades:**
- Calcular todas las medidas de tendencia central
- Calcular medidas de dispersión
- Calcular cuartiles y percentiles
- Calcular estadísticas avanzadas (asimetría, curtosis)
- Calcular intervalos de confianza

#### 2. `LinearRegressionPredictor`
```python
class LinearRegressionPredictor:
    @staticmethod
    def prepare_time_series_data(historical_data, variable) -> Tuple
    @staticmethod
    def predict_future(historical_data, variable, hours_ahead) -> Dict
    @staticmethod
    def predict_multiple_variables(historical_data, variables, hours_ahead) -> Dict
```

**Responsabilidades:**
- Preparar datos de series temporales
- Entrenar modelos de regresión lineal
- Generar predicciones futuras
- Calcular métricas del modelo (R², RMSE, MAE, MSE)
- Calcular intervalos de confianza

#### 3. `CorrelationAnalysis`
```python
class CorrelationAnalysis:
    @staticmethod
    def calculate_correlation_matrix(historical_data: List[Dict]) -> Dict
```

**Responsabilidades:**
- Calcular correlaciones de Pearson entre variables
- Generar matriz de correlación

### Flujo de Datos

```
1. Frontend solicita predicción
   ↓
2. Backend genera datos históricos (simulados)
   ↓
3. LinearRegressionPredictor prepara datos
   ↓
4. Entrena modelo con scikit-learn
   ↓
5. Genera predicciones futuras
   ↓
6. Calcula métricas y intervalos de confianza
   ↓
7. Retorna respuesta JSON al frontend
```

### Librerías Utilizadas

#### **NumPy**
- Operaciones matemáticas eficientes
- Cálculo de estadísticas básicas
- Manipulación de arrays

#### **SciPy**
- Distribuciones estadísticas (t de Student)
- Cálculo de intervalos de confianza
- Estadísticas avanzadas

#### **Scikit-learn**
- `LinearRegression`: Modelo de regresión lineal
- `r2_score`: Cálculo de R²
- `mean_squared_error`: Cálculo de MSE
- `mean_absolute_error`: Cálculo de MAE

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Obtener Estadísticas Descriptivas

**Request:**
```bash
GET /api/v1/locations/loc_001/statistics?hours=168
```

**Response:**
```json
{
  "location": {...},
  "period": "168h",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-08"
  },
  "statistics": {
    "temperature": {
      "count": 168,
      "mean": 22.5,
      "median": 22.3,
      "mode": 22.0,
      "stdDev": 2.1,
      "variance": 4.41,
      "min": 18.5,
      "max": 26.8,
      "range": 8.3,
      "q1": 21.0,
      "q2": 22.3,
      "q3": 24.0,
      "iqr": 3.0,
      "p10": 19.5,
      "p90": 25.2,
      "p95": 25.8,
      "p99": 26.5,
      "coefficientOfVariation": 9.3,
      "skewness": 0.15,
      "kurtosis": -0.32,
      "standardError": 0.16,
      "confidenceInterval95": {
        "lower": 22.18,
        "upper": 22.82,
        "margin": 0.32
      }
    }
  }
}
```

**Interpretación:**
- La temperatura promedio es 22.5°C
- La desviación estándar es 2.1°C (variabilidad moderada)
- El 50% de las temperaturas están entre 21.0°C (Q1) y 24.0°C (Q3)
- La distribución es ligeramente sesgada positivamente (skewness = 0.15)
- Estamos 95% seguros de que la verdadera media está entre 22.18°C y 22.82°C

### Ejemplo 2: Predicción con Regresión Lineal

**Request:**
```bash
GET /api/v1/locations/loc_001/predictions/regression/temperature?hours=24&hours_ahead=12
```

**Response:**
```json
{
  "location": {...},
  "variables": {
    "temperature": {
      "variable": "temperature",
      "model": {
        "type": "linear_regression",
        "coefficient": 0.15,
        "intercept": 20.5,
        "r2": 0.82,
        "rmse": 1.2,
        "mae": 0.9,
        "mse": 1.44
      },
      "predictions": [
        {
          "timestamp": "2024-01-08T13:00:00Z",
          "time": "13:00",
          "datetime": "2024-01-08 13:00:00",
          "predicted": 22.3,
          "lowerBound": 20.1,
          "upperBound": 24.5,
          "confidence": 95
        },
        {
          "timestamp": "2024-01-08T14:00:00Z",
          "time": "14:00",
          "datetime": "2024-01-08 14:00:00",
          "predicted": 22.45,
          "lowerBound": 20.25,
          "upperBound": 24.65,
          "confidence": 95
        }
        // ... más predicciones
      ],
      "dataPoints": 24,
      "hoursAhead": 12
    }
  }
}
```

**Interpretación:**
- **Ecuación del modelo**: `temperatura = 0.15 × hora + 20.5`
- **R² = 0.82**: El modelo explica el 82% de la variabilidad (muy bueno)
- **RMSE = 1.2°C**: Error promedio de ±1.2°C
- **Coeficiente = 0.15**: La temperatura aumenta 0.15°C por hora
- **Predicción a las 13:00**: 22.3°C con intervalo [20.1, 24.5]°C

### Ejemplo 3: Predicción de Múltiples Variables

**Request:**
```bash
GET /api/v1/locations/loc_001/predictions/regression?hours=48&hours_ahead=24&variables=temperature,humidity,windSpeed
```

**Response:**
```json
{
  "location": {...},
  "variables": {
    "temperature": {
      "model": {
        "r2": 0.85,
        "rmse": 1.1
      },
      "predictions": [...]
    },
    "humidity": {
      "model": {
        "r2": 0.72,
        "rmse": 3.5
      },
      "predictions": [...]
    },
    "windSpeed": {
      "model": {
        "r2": 0.68,
        "rmse": 2.3
      },
      "predictions": [...]
    }
  }
}
```

**Interpretación:**
- **Temperatura**: Mejor modelo (R² = 0.85)
- **Humedad**: Modelo moderado (R² = 0.72)
- **Velocidad del viento**: Modelo más débil (R² = 0.68), más difícil de predecir

### Ejemplo 4: Matriz de Correlación

**Request:**
```bash
GET /api/v1/locations/loc_001/correlation?hours=168
```

**Response:**
```json
{
  "location": {...},
  "matrix": {
    "temperature": {
      "temperature": 1.0,
      "humidity": -0.65,
      "windSpeed": 0.32,
      "pressure": -0.18
    },
    "humidity": {
      "temperature": -0.65,
      "humidity": 1.0,
      "windSpeed": -0.25,
      "pressure": 0.42
    }
  },
  "variables": ["temperature", "humidity", "windSpeed", "pressure"],
  "dataPoints": 168
}
```

**Interpretación:**
- **Temperatura ↔ Humedad**: Correlación negativa fuerte (-0.65)
  - Cuando la temperatura sube, la humedad baja (relación inversa)
- **Temperatura ↔ Viento**: Correlación positiva moderada (0.32)
  - Temperaturas más altas tienden a coincidir con más viento
- **Humedad ↔ Presión**: Correlación positiva moderada (0.42)
  - Mayor presión atmosférica tiende a coincidir con mayor humedad

---

## 📖 Interpretación de Resultados

### ¿Cuándo es Bueno un Modelo de Regresión?

| R² | Interpretación | Uso |
|---|---|---|
| 0.9 - 1.0 | Excelente | Predicciones muy confiables |
| 0.7 - 0.9 | Bueno | Predicciones confiables |
| 0.5 - 0.7 | Moderado | Predicciones útiles con precaución |
| 0.3 - 0.5 | Débil | Predicciones poco confiables |
| < 0.3 | Muy débil | Modelo no útil |

### Factores que Afectan la Calidad del Modelo

1. **Cantidad de datos históricos**
   - Más datos = Mejor modelo (hasta cierto punto)
   - Mínimo recomendado: 24 horas

2. **Variabilidad de los datos**
   - Datos muy variables = Modelo menos preciso
   - Datos con patrones claros = Modelo más preciso

3. **Linealidad de la relación**
   - Regresión lineal asume relación lineal
   - Si la relación es no lineal, el modelo será menos preciso

4. **Horizonte de predicción**
   - Predicciones a corto plazo (1-12 horas) = Más precisas
   - Predicciones a largo plazo (24-72 horas) = Menos precisas

### Interpretación de Intervalos de Confianza

**Intervalo estrecho:**
```
Predicción: 22.0°C
Intervalo: [21.8, 22.2]°C
```
→ Alta confianza, predicción precisa

**Intervalo amplio:**
```
Predicción: 22.0°C
Intervalo: [18.0, 26.0]°C
```
→ Baja confianza, mucha incertidumbre

---

## ⚠️ Limitaciones y Consideraciones

### Limitaciones de la Regresión Lineal

1. **Asume relación lineal**
   - Las variables meteorológicas pueden tener relaciones no lineales
   - Solución: Usar modelos más complejos (polinómicos, exponenciales)

2. **No captura estacionalidad**
   - No considera patrones diarios, semanales o estacionales
   - Solución: Agregar variables de tiempo (hora del día, día de la semana)

3. **No considera variables externas**
   - No incluye factores como nubosidad, presión, etc.
   - Solución: Regresión múltiple con más variables

4. **Precisión disminuye con el tiempo**
   - Las predicciones a largo plazo son menos precisas
   - Solución: Re-entrenar el modelo frecuentemente

### Consideraciones para Producción

1. **Validación de datos**
   - Verificar que los datos históricos sean válidos
   - Manejar valores faltantes o atípicos

2. **Actualización del modelo**
   - Re-entrenar periódicamente con datos nuevos
   - Considerar ventanas deslizantes de datos

3. **Manejo de errores**
   - Validar que haya suficientes datos
   - Manejar casos donde el modelo no puede entrenarse

4. **Rendimiento**
   - Los cálculos pueden ser costosos con muchos datos
   - Considerar caché de resultados

### Mejoras Futuras

1. **Regresión Polinómica**
   - Capturar relaciones no lineales
   - Mejor para variables con curvas

2. **Regresión Múltiple**
   - Incluir múltiples variables predictoras
   - Mejorar precisión del modelo

3. **Modelos de Series Temporales**
   - ARIMA, LSTM, Prophet
   - Capturar patrones temporales complejos

4. **Ensemble Methods**
   - Combinar múltiples modelos
   - Mejorar robustez y precisión

---

## 📚 Referencias y Recursos

### Conceptos Estadísticos
- **Media, Mediana, Moda**: Medidas de tendencia central
- **Desviación Estándar**: Medida de dispersión
- **Cuartiles**: División de datos en 4 partes
- **Correlación**: Relación entre variables

### Regresión Lineal
- **Mínimos Cuadrados**: Método de ajuste
- **R²**: Coeficiente de determinación
- **RMSE**: Error cuadrático medio
- **Intervalos de Confianza**: Rango de valores probables

### Librerías Python
- **NumPy**: Operaciones numéricas
- **SciPy**: Estadísticas avanzadas
- **Scikit-learn**: Machine Learning

---

## 🎓 Conclusión

La estadística descriptiva y la regresión lineal son herramientas poderosas para:

✅ **Comprender** el comportamiento histórico de variables meteorológicas
✅ **Predecir** valores futuros con cierto grado de confianza
✅ **Identificar** relaciones entre diferentes variables
✅ **Tomar decisiones** informadas basadas en datos

Aunque tienen limitaciones, son un excelente punto de partida para análisis meteorológicos y pueden mejorarse con modelos más sofisticados según las necesidades del proyecto.

---

**Documento creado para el Backend MTOs**
**Versión:** 1.0.0
**Fecha:** 2024

