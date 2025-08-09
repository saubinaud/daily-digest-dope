
# Configuración de n8n para News Digest

## Pasos para conectar n8n con la aplicación:

### 1. Crear el workflow en n8n

1. **Crear nuevo workflow**
2. **Añadir HTTP Request Node** con la siguiente configuración:

```json
{
  "method": "POST",
  "url": "http://localhost:3001/api/news",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "date": "2024-01-15",
    "categories": {
      "IA": {
        "insight": "La inteligencia artificial continúa evolucionando...",
        "articles": [
          {
            "rank": 1,
            "title": "Título de la noticia",
            "summary": "Resumen de la noticia...",
            "context": "Contexto adicional...",
            "reliability": 5
          }
        ]
      },
      "Marketing": {
        "insight": "Las estrategias de marketing digital...",
        "articles": [...]
      },
      "Bolsa": {
        "insight": "Los mercados financieros...",
        "articles": [...]
      },
      "Internacional": {
        "insight": "Los eventos internacionales...",
        "articles": [...]
      }
    }
  }
}
```

### 2. Estructura requerida del JSON

Cada categoría debe tener:
- `insight`: String con el análisis general
- `articles`: Array de artículos con:
  - `rank`: Número (1, 2, 3...)
  - `title`: String
  - `summary`: String  
  - `context`: String
  - `reliability`: Número del 1 al 5

### 3. Endpoints disponibles

- **POST /api/news** - Enviar digest desde n8n
- **GET /api/get-today** - Obtener digest actual
- **POST /api/test-connection** - Probar conexión
- **GET /api/status** - Estado del servidor

### 4. Probar la conexión

Usar el endpoint de prueba primero:
```bash
curl -X POST http://localhost:3001/api/test-connection \
  -H "Content-Type: application/json" \
  -d '{"test": "data from n8n"}'
```

### 5. Configuración de CORS

El servidor está configurado para aceptar requests de:
- localhost (cualquier puerto)
- *.n8n.cloud
- app.n8n.cloud

¡El servidor está listo para recibir datos de n8n!
