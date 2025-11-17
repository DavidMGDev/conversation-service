# Servicio de Conversación

Un servicio de conversación inteligente construido con Node.js y Express que se integra con Google Gemini AI, Azure Service Bus y MongoDB (Azure Cosmos DB). Este servicio proporciona chat interactivo con personas virtuales, gestión de diccionarios personales y recomendaciones de speakers para el aprendizaje de idiomas.

## Arquitectura

```
conversation-service/
├── src/
│   ├── config/              # Configuración de base de datos
│   │   └── database.js
│   ├── controllers/         # Lógica de control de endpoints
│   │   ├── chatController.js
│   │   ├── dictionaryController.js
│   │   └── speakerController.js
│   ├── middleware/          # Middleware de seguridad y validación
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validateSslCert.js
│   ├── models/              # Modelos de datos Mongoose
│   │   ├── ChatSession.js
│   │   ├── Dictionary.js
│   │   ├── Speaker.js
│   │   └── Word.js
│   ├── routes/              # Definición de rutas API
│   │   ├── chats.js
│   │   ├── dictionary.js
│   │   └── speakers.js
│   ├── scripts/             # Scripts de utilidad
│   │   └── seedSpeakers.js
│   ├── services/            # Lógica de negocio y AI
│   │   ├── chatService.js
│   │   ├── dictionaryService.js
│   │   ├── geminiService.js
│   │   └── speakerService.js
│   └── utils/               # Utilidades de infraestructura
│       └── serviceBusClient.js
├── certs/                   # Certificados mTLS (opcional)
├── .github/workflows/       # Pipeline CI/CD
├── .env                     # Variables de entorno
├── server.js                # Punto de entrada principal
├── package.json             # Dependencias NPM
└── Dockerfile               # Containerización
```

## ✨ Características

- **Chat AI Interactivo**: Conexiones WebSocket para conversaciones en tiempo real con speakers virtuales
- **Integración con Google Gemini 2.0**: Generación inteligente de respuestas basadas en personalidad
- **API REST**: Operaciones CRUD completas para conversaciones, speakers y diccionarios
- **Azure Service Bus**: Procesamiento asíncrono de notificaciones de eventos
- **MongoDB (Azure Cosmos DB)**: Almacenamiento persistente de sesiones, speakers y palabras
- **Autenticación JWT**: Autenticación y autorización segura de usuarios
- **Speakers Virtuales**: 8+ personalidades predefinidas con rasgos culturales únicos
- **Diccionario Personal**: Guardado y traducción de palabras a múltiples idiomas
- **Soporte mTLS**: TLS mutuo opcional para entornos de producción
- **Soporte CORS**: Intercambio de recursos de origen cruzado configurable

## Inicio Rápido

### Prerequisitos

- Node.js 18+
- MongoDB 6+ o Azure Cosmos DB API for MongoDB
- Cuenta de Azure con:
  - Namespace de Service Bus y cola
- Clave de API de Google Gemini
- Clave secreta JWT

### Instalación

1. Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd conversation-service
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar variables de entorno (crear archivo `.env`):

```env
# MongoDB / Azure Cosmos DB
MONGO_URI=mongodb://<usuario>:<password>@<host>:10255/quickspeak?ssl=true&replicaSet=globaldb
GEMINI_API_KEY=tu_clave_gemini_aqui

# Azure Service Bus
SERVICE_BUS_CONNECTION_STRING=Endpoint=sb://<namespace>.servicebus.windows.net/;SharedAccessKey=<key>
NODE_ENV=development
PORT=3004
SKIP_MTLS=true

# JWT Secret (debe coincidir con el User Service)
JWT_SECRET=tu_clave_secreta_aqui

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,https://quickspeak-frontend.azurewebsites.net
```

4. Poblar base de datos con speakers iniciales:

```bash
npm run seed
```

5. Ejecutar la aplicación:

```bash
npm run dev
```

Para producción:

```bash
npm start
```

## Endpoints de la API

### Verificación de Salud

```http
GET /health
```

### Speakers

#### Obtener catálogo de speakers

```http
GET /speakers/catalog
```

#### Obtener speakers guardados del usuario

```http
GET /speakers/saved?userId=123
```

#### Agregar speaker al usuario

```http
POST /speakers
Content-Type: application/json

{
  "userId": "123",
  "id": "aurora-001",
  "name": "Aurora",
  "avatarSeed": "Aurora",
  "flagEmoji": "🇪🇸"
}
```

### Conversaciones (Chats)

#### Obtener sesión de chat

```http
GET /chat/session/:sessionId
```

#### Enviar mensaje en chat

```http
POST /chat/session/:sessionId/message
Content-Type: application/json

{
  "userId": "123",
  "text": "Hola, ¿cómo estás?",
  "recipientUserId": "123"
}
```

#### Obtener chats recientes

```http
GET /chats/recent?userId=123
```

### Diccionario

#### Obtener catálogo de diccionarios del usuario

```http
GET /dictionary/catalog?userId=123
```

#### Obtener palabras por idioma

```http
GET /dictionary/words?userId=123&language=Spanish
```

#### Agregar nueva palabra

```http
POST /dictionary/words
Content-Type: application/json

{
  "userId": "123",
  "lang": "Spanish",
  "word": "puerta"
}
```

#### Actualizar traducciones pendientes

```http
POST /dictionary/words/update-translations
Content-Type: application/json

{
  "userId": "123"
}
```

#### Olvidar (eliminar) palabra

```http
POST /dictionary/words/:id/forget
Content-Type: application/json

{
  "userId": "123",
  "word": "puerta"
}
```

## Autenticación

El servicio utiliza tokens JWT para autenticación. Incluir el token en:

- **API REST**: Encabezado `Authorization: Bearer {token}`
- **WebSocket**: Parámetro de consulta `token` en la conexión

Ejemplo de payload del token:

```json
{
  "sub": "user123",
  "exp": 1700000000
}
```

## Flujo de Datos

### Chat Interactivo

```
Usuario → POST /chat/session/:sessionId/message
    ↓
Auth Middleware → Valida JWT token
    ↓
Chat Controller → Receives request
    ↓
Chat Service → Guarda mensaje del usuario en MongoDB
    ↓
Gemini Service → Llama a Google Gemini API con contexto de speaker
    ↓
Chat Service → Guarda respuesta de AI en sesión
    ↓
Service Bus → Publica notificación NEW_MESSAGE
    ↓
WebSocket Manager → Envia notificación en tiempo real al usuario
    ↓
Response → Devuelve mensaje AI al cliente
```

### Gestión de Diccionario

```
Usuario → POST /dictionary/words
    ↓
Dictionary Service → Guarda palabra en MongoDB
    ↓
Gemini Service → Traduce palabra a idiomas del usuario
    ↓
Dictionary Service → Actualiza traducciones en Word document
    ↓
Service Bus → Publica notificación WORD_SAVED
    ↓
Response → Confirma guardado con traducciones
```

### Service Bus Message Flow

```
Producer (Chat/Dictionary) → Service Bus Queue
    ↓
Consumer Backend → Procesa mensaje
    ↓
Table Storage → Persiste notificación
    ↓
WebSocket → Envia en tiempo real a usuario conectado
    ↓
API REST → Disponible para consultas históricas
```

## Formatos de Mensajes

### Mensaje de Cola Service Bus (Chat)

```json
{
  "type": "NEW_MESSAGE",
  "userId": "user123",
  "data": {
    "sessionId": "chat_aurora-001",
    "speakerId": "aurora-001",
    "speakerName": "Aurora",
    "messagePreview": "¡Hola! ¿Cómo estás hoy?"
  }
}
```

### Mensaje de Cola Service Bus (Dictionary)

```json
{
  "type": "WORD_SAVED",
  "userId": "user123",
  "data": {
    "word": "puerta",
    "language": "Spanish",
    "wordId": "507f1f77bcf86cd799439011",
    "translations": [
      {"language": "English", "word": "door"},
      {"language": "German", "word": "Tür"}
    ]
  }
}
```

### Mensaje de Cola Service Bus (Word Forgotten)

```json
{
  "type": "WORD_FORGOTTEN",
  "userId": "user123",
  "data": {
    "wordId": "507f1f77bcf86cd799439011",
    "word": "puerta"
  }
}
```

## Pruebas

Ejecutar pruebas locales:

```bash
# Test endpoints con curl (desarrollo)
curl http://localhost:3004/health

# Test Gemini AI integration
curl http://localhost:3004/debug/gemini

# Test Service Bus connection
curl http://localhost:3004/debug/servicebus
```

## Despliegue

### Docker

```bash
# Construir imagen
docker build -t conversation-service .

# Ejecutar contenedor
docker run -p 3004:3004 --env-file .env conversation-service
```

### Azure App Service

El repositorio incluye workflow de GitHub Actions para despliegue automatizado.

Secretos requeridos en GitHub:

- `AZUREAPPSERVICE_CLIENTID`
- `AZUREAPPSERVICE_TENANTID`
- `AZUREAPPSERVICE_SUBSCRIPTIONID`

Variables de entorno requeridas en Azure Portal:

```bash
MONGO_URI=jdbc:cosmos://...
GEMINI_API_KEY=AIzaSy...
SERVICE_BUS_CONNECTION_STRING=Endpoint=sb://...
JWT_SECRET=tu_secreto_jwt
CORS_ORIGINS=https://quickspeak-web.azurewebsites.net
SKIP_MTLS=false
```

## Variables de Entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `MONGO_URI` | Sí | Cadena de conexión de MongoDB/Azure Cosmos DB |
| `GEMINI_API_KEY` | Sí | Clave de API de Google Gemini AI |
| `SERVICE_BUS_CONNECTION_STRING` | Sí | Cadena de conexión de Azure Service Bus |
| `JWT_SECRET` | Sí | Clave secreta para validación de tokens JWT |
| `PORT` | No | Puerto del servidor (default: 3004) |
| `NODE_ENV` | No | Entorno: development, production (default: development) |
| `SKIP_MTLS` | No | Saltar validación mTLS en desarrollo (default: true en dev) |
| `CORS_ORIGINS` | No | Lista de origen CORS permitidos separados por comas |
| `AZURE_STORAGE_CONNECTION_STRING` | No | Para integración futura con Azure Storage |

## 🛠️ Tecnologías

- **Node.js 18+**: Runtime JavaScript del lado del servidor
- **Express.js**: Framework web minimalista y flexible
- **Mongoose**: ODM para MongoDB y Cosmos DB
- **Google Generative AI API**: Modelo Gemini 2.0 Flash para respuestas inteligentes
- **Azure Service Bus**: Cola de mensajes para procesamiento asíncrono
- **JSON Web Tokens**: Estándar para autenticación segura
- **bcryptjs**: Hashing de contraseñas para seguridad
- **Helmet**: Seguridad HTTP headers
- **CORS**: Intercambio de recursos de origen cruzado
- **Docker**: Containerización

## Configuración de mTLS

Para entornos de producción con Azure App Service y Azure API Management:

1. **Generar certificados** (si no existen):
```bash
cd certs
./generate-certificates.sh
```

2. **Subir certificados a Azure**:
   - `server-keystore.p12` → App Service TLS/SSL settings
   - `apim-client.pfx` → Azure APIM Certificates

3. **Configurar variables**:
```bash
# En Azure App Service
WEBSITE_LOAD_CERTIFICATES=*
SKIP_MTLS=false
```

4. **Validar conexión**:
```bash
curl -k --cert apim-client-cert.pem --key apim-client-key.pem \
  https://quickspeak-conversation-service.azurewebsites.net/health
```

## Seguridad

### Autenticación
- JWT HS256 con clave compartida entre microservicios
- Validación de token en middleware `auth.js`

### Autorización
- User ID extraído del token y validado en cada operación
- No se permite acceso a datos de otros usuarios

### Encriptación
- Conexiones SSL/TLS requeridas en producción
- mTLS opcional para validación de cliente (APIM)

### Rate Limiting
Implementar en Azure API Management:
- Policy de throttling en cada endpoint
- Límites: 100 requests/min por usuario

## Monitoring

### Logs
La aplicación registra automáticamente:
- Conexiones de base de datos
- Llamadas a Gemini AI (duración y errores)
- Mensajes de Service Bus enviados/recibidos
- Errores de validación

### Métricas clave a monitorear:
- Tiempo de respuesta de Gemini API (< 3s)
- Conexiones activas WebSocket
- Mensajes en cola Service Bus (< 100)
- Error rate de endpoints (< 1%)

## Soporte

### Troubleshooting
**Problema**: Conexión a MongoDB falla
- **Solución**: Asegurar IP en whitelist de Cosmos DB firewall

**Problema**: Gemini API retorna errores
- **Solución**: Verificar quota y habilitar API en Google Cloud Console

**Problema**: Service Bus no envía mensajes
- **Solución**: Validar connection string y existencia de la cola

**Problema**: WebSocket no conecta
- **Solución**: Verificar token JWT y CORS origins

### Contacto
Para incidentes en producción, consultar los logs en Azure Monitor o Application Insights.

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0.0
**Estado**: ✅ Producción Ready
