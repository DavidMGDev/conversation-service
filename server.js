require('dotenv').config();

const express = require('express');

const cors = require('cors');

const helmet = require('helmet');

const connectDB = require('./src/config/database');

const { initServiceBus, closeServiceBus } = require('./src/utils/serviceBusClient');

// Import middlewares
const validateClientCertificate = require('./src/middleware/validateSslCert');

// Import routes

const speakersRoutes = require('./src/routes/speakers');

const chatsRoutes = require('./src/routes/chats');

const dictionaryRoutes = require('./src/routes/dictionary');

// Initialize Express

const app = express();

// Global middlewares

app.use(helmet());

app.use(cors({

  origin: process.env.CORS_ORIGIN || '*',

  credentials: true

}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Certificate-based authentication (mTLS) - validates APIM client certificate
app.use(validateClientCertificate);

// Logging middleware (development only)

if (process.env.NODE_ENV !== 'production') {

  app.use((req, res, next) => {

    console.log(`${req.method} ${req.path}`);

    next();

  });

}

// Health checks

app.get('/', (req, res) => {

  res.json({

    service: 'Conversation Service',

    status: 'running',

    timestamp: new Date().toISOString()

  });

});

app.get('/health', (req, res) => {

  res.json({

    status: 'healthy',

    database: 'connected',

    timestamp: new Date().toISOString()

  });

});

// Debug endpoints (development only)

if (process.env.NODE_ENV !== 'production') {

  app.get('/debug/servicebus', async (req, res) => {

    try {

      const { sendNotification } = require('./src/utils/serviceBusClient');

      await sendNotification('TEST', { userId: 'test-user', data: { message: 'Test notification' } });

      res.json({ success: true, message: 'Test notification sent' });

    } catch (error) {

      res.status(500).json({ success: false, error: error.message });

    }

  });

  app.get('/debug/gemini', async (req, res) => {

    try {

      const { generateChatResponse } = require('./src/services/geminiService');

      const mockSpeaker = {

        name: 'Aurora',

        language: 'Spanish',

        personality: ['Friendly'],

        interests: ['Music']

      };

      const response = await generateChatResponse(mockSpeaker, 'Hola, ¿cómo estás?');

      res.json({ success: true, response });

    } catch (error) {

      res.status(500).json({ success: false, error: error.message });

    }

  });

  app.get('/debug/user', (req, res) => {

    const userId = req.query.userId || req.body.userId;

    res.json({ success: true, userId, message: 'User ID extracted from request' });

  });

}

// API Routes

app.use('/speakers', speakersRoutes);

app.use('/chat', chatsRoutes);

app.use('/chats', chatsRoutes); // Alias for /chats/recent

app.use('/dictionaries', dictionaryRoutes);

app.use('/dictionary', dictionaryRoutes);

// Error handler (must be last)

app.use(require('./src/middleware/errorHandler'));

// Graceful shutdown

process.on('SIGTERM', async () => {

  console.log('⚠️ SIGTERM received, shutting down gracefully...');

  await closeServiceBus();

  process.exit(0);

});

process.on('SIGINT', async () => {

  console.log('⚠️ SIGINT received, shutting down gracefully...');

  await closeServiceBus();

  process.exit(0);

});

// Start services

async function startServer() {

  try {

    await connectDB();

    initServiceBus();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {

      console.log(`🚀 Conversation Service running on port ${PORT}`);

      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);

    });

  } catch (error) {

    console.error('❌ Failed to start server:', error.message);

    process.exit(1);

  }

}

startServer();