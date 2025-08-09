
# Guía de Despliegue para News Digest

## Desplegar el Servidor API

### Opción 1: Render (Recomendado)

1. **Crear cuenta en Render.com**
2. **Conectar repositorio de GitHub**
3. **Crear nuevo Web Service**
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && node index.js`
   - Environment: Node.js

4. **Configurar variables de entorno** (opcional):
   ```
   NODE_ENV=production
   PORT=10000
   ```

5. **Tu API estará disponible en**: `https://your-app-name.onrender.com`

### Opción 2: Railway

1. **Crear cuenta en Railway.app**
2. **Conectar repositorio de GitHub**
3. **Seleccionar carpeta `server`**
4. **Railway detectará automáticamente Node.js**

### Opción 3: Vercel

1. **Instalar Vercel CLI**: `npm i -g vercel`
2. **En la carpeta server**: `vercel`
3. **Seguir instrucciones**

## Configurar Frontend para Producción

Una vez que tengas tu servidor desplegado, configura la URL de la API:

1. **En Lovable, ir a Configuración del Proyecto**
2. **Añadir variable de entorno**:
   ```
   VITE_API_BASE_URL=https://tu-servidor-desplegado.com
   ```

## Configurar n8n

### n8n Cloud

1. **Crear workflow en n8n.cloud**
2. **Usar HTTP Request node**:
   ```json
   {
     "method": "POST",
     "url": "https://tu-servidor-desplegado.com/api/news",
     "headers": {
       "Content-Type": "application/json"
     },
     "body": {
       "date": "2024-01-15",
       "categories": {
         "IA": {
           "insight": "Tu insight aquí...",
           "articles": [
             {
               "rank": 1,
               "title": "Título",
               "summary": "Resumen",
               "context": "Contexto",
               "reliability": 5
             }
           ]
         },
         "Marketing": { /* ... */ },
         "Bolsa": { /* ... */ },
         "Internacional": { /* ... */ }
       }
     }
   }
   ```

### n8n Self-hosted

Si usas n8n self-hosted, asegúrate de que puede acceder a tu servidor público.

## Probar la Conexión

1. **Verificar que el servidor está funcionando**:
   ```bash
   curl https://tu-servidor-desplegado.com/health
   ```

2. **Probar desde n8n**:
   ```bash
   curl -X POST https://tu-servidor-desplegado.com/api/test-connection \
     -H "Content-Type: application/json" \
     -d '{"test": "desde n8n"}'
   ```

## Troubleshooting

### CORS Errors
- Verifica que tu dominio esté en la lista CORS del servidor
- El servidor ya incluye configuración para Lovable y n8n Cloud

### 404 Errors
- Verifica que la URL del servidor sea correcta
- Asegúrate de incluir `/api/` en las rutas

### Server Offline
- La aplicación funciona con datos de demostración cuando el servidor no está disponible
- Verifica los logs del servidor para errores

## Variables de Entorno

### Frontend (Lovable)
```
VITE_API_BASE_URL=https://tu-servidor-desplegado.com
```

### Backend (Servidor)
```
NODE_ENV=production
PORT=10000
```

¡Tu aplicación estará lista para recibir datos de n8n una vez completados estos pasos!
