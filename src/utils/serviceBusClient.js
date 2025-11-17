const { ServiceBusClient } = require('@azure/service-bus');

let sbClient;

let sender;

function initServiceBus() {

  if (!process.env.SERVICE_BUS_CONNECTION_STRING) {

    console.warn('⚠️ Service Bus not configured');

    return;

  }

  sbClient = new ServiceBusClient(process.env.SERVICE_BUS_CONNECTION_STRING);

  sender = sbClient.createSender('notifications');

  console.log('✅ Service Bus client initialized');

}

/**

 * Sends notification to queue

 * @param {String} type - Event type (WORD_SAVED, NEW_MESSAGE, etc.)

 * @param {Object} payload - Event data containing userId

 */

async function sendNotification(type, payload) {

  try {

    if (!sender) {

      console.warn('⚠️ Service Bus not initialized');

      return;

    }

    const message = {

      body: {

        type,

        userId: payload.userId,

        data: payload,

        timestamp: new Date().toISOString()

      }

    };

    await sender.sendMessages(message);

    console.log(`📩 Notification sent: ${type} for user ${payload.userId}`);

  } catch (error) {

    console.error('❌ Error sending notification:', error.message);

  }

}

async function closeServiceBus() {

  if (sender) await sender.close();

  if (sbClient) await sbClient.close();

}

module.exports = { initServiceBus, sendNotification, closeServiceBus };
