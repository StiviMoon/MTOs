"""
Módulo de Estadística Descriptiva y Regresión Lineal
Para análisis de datos meteorológicos simulados
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from scipy import stats
import math


class DescriptiveStatistics:
    """Clase para calcular estadísticas descriptivas de datos meteorológicos"""
    
    @staticmethod
    def calculate_basic_stats(data: List[float]) -> Dict[str, float]:
        """Calcula estadísticas básicas: media, mediana, moda, etc."""
        if not data or len(data) == 0:
            return {}
        
        data_array = np.array(data)
        
        # Estadísticas básicas
        mean = float(np.mean(data_array))
        median = float(np.median(data_array))
        
        # Moda (valor más frecuente)
        values, counts = np.unique(data_array, return_counts=True)
        mode_idx = np.argmax(counts)
        mode = float(values[mode_idx])
        
        # Dispersión
        std_dev = float(np.std(data_array, ddof=1))  # Desviación estándar muestral
        variance = float(np.var(data_array, ddof=1))
        
        # Rango
        min_val = float(np.min(data_array))
        max_val = float(np.max(data_array))
        range_val = max_val - min_val
        
        # Cuartiles
        q1 = float(np.percentile(data_array, 25))
        q2 = float(np.percentile(data_array, 50))  # Mediana
        q3 = float(np.percentile(data_array, 75))
        iqr = q3 - q1  # Rango intercuartílico
        
        # Percentiles
        p10 = float(np.percentile(data_array, 10))
        p90 = float(np.percentile(data_array, 90))
        p95 = float(np.percentile(data_array, 95))
        p99 = float(np.percentile(data_array, 99))
        
        # Coeficiente de variación
        cv = (std_dev / mean * 100) if mean != 0 else 0
        
        return {
            "count": len(data),
            "mean": round(mean, 2),
            "median": round(median, 2),
            "mode": round(mode, 2),
            "stdDev": round(std_dev, 2),
            "variance": round(variance, 2),
            "min": round(min_val, 2),
            "max": round(max_val, 2),
            "range": round(range_val, 2),
            "q1": round(q1, 2),
            "q2": round(q2, 2),
            "q3": round(q3, 2),
            "iqr": round(iqr, 2),
            "p10": round(p10, 2),
            "p90": round(p90, 2),
            "p95": round(p95, 2),
            "p99": round(p99, 2),
            "coefficientOfVariation": round(cv, 2)
        }
    
    @staticmethod
    def calculate_advanced_stats(data: List[float]) -> Dict[str, float]:
        """Calcula estadísticas avanzadas: asimetría, curtosis, etc."""
        if not data or len(data) < 3:
            return {}
        
        data_array = np.array(data)
        
        # Asimetría (skewness)
        mean = np.mean(data_array)
        std_dev = np.std(data_array, ddof=1)
        n = len(data_array)
        
        if std_dev == 0:
            skewness = 0.0
        else:
            skewness = (n / ((n - 1) * (n - 2))) * np.sum(((data_array - mean) / std_dev) ** 3)
        
        # Curtosis (kurtosis)
        if std_dev == 0:
            kurtosis = 0.0
        else:
            kurtosis = (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * np.sum(((data_array - mean) / std_dev) ** 4) - 3 * (n - 1) ** 2 / ((n - 2) * (n - 3))
        
        # Error estándar de la media
        sem = std_dev / math.sqrt(n) if n > 0 else 0
        
        # Intervalo de confianza al 95%
        confidence_level = 0.95
        alpha = 1 - confidence_level
        t_critical = stats.t.ppf(1 - alpha/2, df=n-1) if n > 1 else 1.96
        margin_error = t_critical * sem
        ci_lower = mean - margin_error
        ci_upper = mean + margin_error
        
        return {
            "skewness": round(float(skewness), 3),
            "kurtosis": round(float(kurtosis), 3),
            "standardError": round(float(sem), 3),
            "confidenceInterval95": {
                "lower": round(float(ci_lower), 2),
                "upper": round(float(ci_upper), 2),
                "margin": round(float(margin_error), 2)
            }
        }
    
    @staticmethod
    def calculate_weather_statistics(historical_data: List[Dict]) -> Dict[str, Dict]:
        """Calcula estadísticas descriptivas para todas las variables meteorológicas"""
        if not historical_data:
            return {}
        
        # Extraer variables
        temperatures = [d.get("temperature", 0) for d in historical_data]
        humidity = [d.get("humidity", 0) for d in historical_data]
        wind_speed = [d.get("windSpeed", 0) for d in historical_data]
        pressure = [d.get("pressure", 0) for d in historical_data]
        precipitation = [d.get("precipitation", 0) for d in historical_data]
        solar_radiation = [d.get("solarRadiation", 0) for d in historical_data if d.get("solarRadiation") is not None]
        uv_index = [d.get("uvIndex", 0) for d in historical_data if d.get("uvIndex") is not None]
        pm25 = [d.get("pm25", 0) for d in historical_data if d.get("pm25") is not None]
        pm10 = [d.get("pm10", 0) for d in historical_data if d.get("pm10") is not None]
        
        stats = {}
        
        # Calcular estadísticas para cada variable
        if temperatures:
            stats["temperature"] = DescriptiveStatistics.calculate_basic_stats(temperatures)
            stats["temperature"].update(DescriptiveStatistics.calculate_advanced_stats(temperatures))
        
        if humidity:
            stats["humidity"] = DescriptiveStatistics.calculate_basic_stats(humidity)
            stats["humidity"].update(DescriptiveStatistics.calculate_advanced_stats(humidity))
        
        if wind_speed:
            stats["windSpeed"] = DescriptiveStatistics.calculate_basic_stats(wind_speed)
            stats["windSpeed"].update(DescriptiveStatistics.calculate_advanced_stats(wind_speed))
        
        if pressure:
            stats["pressure"] = DescriptiveStatistics.calculate_basic_stats(pressure)
            stats["pressure"].update(DescriptiveStatistics.calculate_advanced_stats(pressure))
        
        if precipitation:
            stats["precipitation"] = DescriptiveStatistics.calculate_basic_stats(precipitation)
            stats["precipitation"].update(DescriptiveStatistics.calculate_advanced_stats(precipitation))
        
        if solar_radiation:
            stats["solarRadiation"] = DescriptiveStatistics.calculate_basic_stats(solar_radiation)
            stats["solarRadiation"].update(DescriptiveStatistics.calculate_advanced_stats(solar_radiation))
        
        if uv_index:
            stats["uvIndex"] = DescriptiveStatistics.calculate_basic_stats(uv_index)
            stats["uvIndex"].update(DescriptiveStatistics.calculate_advanced_stats(uv_index))
        
        if pm25:
            stats["pm25"] = DescriptiveStatistics.calculate_basic_stats(pm25)
            stats["pm25"].update(DescriptiveStatistics.calculate_advanced_stats(pm25))
        
        if pm10:
            stats["pm10"] = DescriptiveStatistics.calculate_basic_stats(pm10)
            stats["pm10"].update(DescriptiveStatistics.calculate_advanced_stats(pm10))
        
        return stats


class LinearRegressionPredictor:
    """Clase para realizar predicciones usando regresión lineal"""
    
    @staticmethod
    def prepare_time_series_data(historical_data: List[Dict], variable: str) -> Tuple[np.ndarray, np.ndarray]:
        """Prepara datos de serie temporal para regresión"""
        if not historical_data:
            return np.array([]), np.array([])
        
        # Extraer timestamps y valores
        timestamps = []
        values = []
        
        for i, data_point in enumerate(historical_data):
            timestamp_str = data_point.get("timestamp", "")
            if timestamp_str:
                try:
                    # Convertir timestamp a número (horas desde el inicio)
                    ts = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
                    # Usar índice como variable independiente (más simple)
                    timestamps.append(i)
                    value = data_point.get(variable, 0)
                    if value is not None:
                        values.append(float(value))
                except:
                    continue
        
        if len(timestamps) != len(values) or len(timestamps) == 0:
            return np.array([]), np.array([])
        
        X = np.array(timestamps).reshape(-1, 1)
        y = np.array(values)
        
        return X, y
    
    @staticmethod
    def predict_future(
        historical_data: List[Dict],
        variable: str,
        hours_ahead: int = 24
    ) -> Dict:
        """Predice valores futuros usando regresión lineal"""
        if not historical_data or len(historical_data) < 2:
            return {
                "error": "Datos insuficientes para realizar predicción",
                "predictions": []
            }
        
        # Preparar datos
        X, y = LinearRegressionPredictor.prepare_time_series_data(historical_data, variable)
        
        if len(X) == 0 or len(y) == 0:
            return {
                "error": "No se pudieron extraer datos válidos",
                "predictions": []
            }
        
        # Entrenar modelo de regresión lineal
        model = LinearRegression()
        model.fit(X, y)
        
        # Calcular métricas del modelo
        y_pred = model.predict(X)
        r2 = r2_score(y, y_pred)
        mse = mean_squared_error(y, y_pred)
        rmse = math.sqrt(mse)
        mae = mean_absolute_error(y, y_pred)
        
        # Generar predicciones futuras
        last_index = len(X) - 1
        future_indices = np.array(range(last_index + 1, last_index + 1 + hours_ahead)).reshape(-1, 1)
        future_predictions = model.predict(future_indices)
        
        # Calcular intervalos de confianza (simplificado)
        residuals = y - y_pred
        std_residuals = np.std(residuals)
        
        predictions = []
        base_time = datetime.now()
        
        for i, pred_value in enumerate(future_predictions):
            prediction_time = base_time + timedelta(hours=i + 1)
            
            # Intervalo de confianza al 95% (aproximado)
            confidence_interval = 1.96 * std_residuals
            
            predictions.append({
                "timestamp": prediction_time.isoformat() + "Z",
                "time": prediction_time.strftime("%H:%M"),
                "datetime": prediction_time.strftime("%Y-%m-%d %H:%M:%S"),
                "predicted": round(float(pred_value), 2),
                "lowerBound": round(float(pred_value - confidence_interval), 2),
                "upperBound": round(float(pred_value + confidence_interval), 2),
                "confidence": 95
            })
        
        return {
            "variable": variable,
            "model": {
                "type": "linear_regression",
                "coefficient": round(float(model.coef_[0]), 4),
                "intercept": round(float(model.intercept_), 2),
                "r2": round(float(r2), 4),
                "rmse": round(float(rmse), 2),
                "mae": round(float(mae), 2),
                "mse": round(float(mse), 2)
            },
            "predictions": predictions,
            "dataPoints": len(X),
            "hoursAhead": hours_ahead
        }
    
    @staticmethod
    def predict_multiple_variables(
        historical_data: List[Dict],
        variables: List[str],
        hours_ahead: int = 24
    ) -> Dict:
        """Predice múltiples variables meteorológicas"""
        results = {}
        
        for variable in variables:
            prediction = LinearRegressionPredictor.predict_future(
                historical_data,
                variable,
                hours_ahead
            )
            results[variable] = prediction
        
        return results


class CorrelationAnalysis:
    """Análisis de correlación entre variables meteorológicas"""
    
    @staticmethod
    def calculate_correlation_matrix(historical_data: List[Dict]) -> Dict:
        """Calcula matriz de correlación entre variables"""
        if not historical_data or len(historical_data) < 2:
            return {}
        
        # Extraer variables
        variables = {
            "temperature": [d.get("temperature", 0) for d in historical_data],
            "humidity": [d.get("humidity", 0) for d in historical_data],
            "windSpeed": [d.get("windSpeed", 0) for d in historical_data],
            "pressure": [d.get("pressure", 0) for d in historical_data],
            "precipitation": [d.get("precipitation", 0) for d in historical_data],
        }
        
        # Filtrar variables con datos válidos
        valid_vars = {k: v for k, v in variables.items() if len(v) > 0}
        
        if len(valid_vars) < 2:
            return {}
        
        # Calcular matriz de correlación
        correlation_matrix = {}
        
        var_names = list(valid_vars.keys())
        for i, var1 in enumerate(var_names):
            correlation_matrix[var1] = {}
            for var2 in var_names:
                if var1 == var2:
                    correlation_matrix[var1][var2] = 1.0
                else:
                    corr = np.corrcoef(valid_vars[var1], valid_vars[var2])[0, 1]
                    correlation_matrix[var1][var2] = round(float(corr), 3) if not np.isnan(corr) else 0.0
        
        return {
            "matrix": correlation_matrix,
            "variables": var_names,
            "dataPoints": len(historical_data)
        }

