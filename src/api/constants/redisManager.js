const redis = require('redis');

// Create Redis clients for publishing and subscribing
const redisPublisherClient = redis.createClient({
  url: 'redis://5.161.243.233:6379'
});

// Error handling for publisher client
redisPublisherClient.on('error', (err) => {
  console.error('Redis publisher client error:', err);
});

// Function to connect the Redis clients
async function connectRedis(client) {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.log('Connected to Redis server');
    } else {
      console.log('Redis client already connected');
    }
  } catch (err) {
    console.error('Redis connection error:', err);
  }
}

// Connect to Redis for both clients
connectRedis(redisPublisherClient);

const uuidv4 = require('uuid').v4;

async function publishMessage(channel, triggerKeyword, username) {
  if (!redisPublisherClient.isOpen) {
    console.error('Redis publisher client is not connected');
    return;
  }

  try {
    const messageId = uuidv4(); // Generate a unique identifier for the message
    const payload = JSON.stringify({ messageId, triggerKeyword, username }); // Construct the payload with triggerKeyword and username
    const reply = await redisPublisherClient.publish(channel, payload);
    
    console.log(`Message published to Redis channel '${channel}': ${reply}`);
    console.log(`Payload: ${payload}`);
  } catch (err) {
    console.error('Error publishing message to Redis:', err);
  }
}


// Function to process incoming messages
function handleRedisMessage(messageId, message, colouredMessage) {
  if (processedMessageIds.has(messageId)) {
    return; // If the message has already been processed, skip further processing
  }

  // Log the parsed message for debugging
  console.log('Received message from Redis:', { messageId, message, colouredMessage });

  // Mark the message as processed to avoid handling it again
  processedMessageIds.add(messageId);
}

// Function to subscribe to a Redis channel and handle incoming messages
async function subscribeToChannel(channel, messageHandler) {
  try {
    if (!redisSubscriberClient.isOpen) {
      await redisSubscriberClient.connect();
    }
    await redisSubscriberClient.subscribe(channel, (message) => {
      console.log('Payload Received:', message);
      try {
        const parsedPayload = JSON.parse(message); // Parse the incoming message JSON
        messageHandler(parsedPayload.messageId, parsedPayload.message, parsedPayload.colouredMessage); // Call the handler
      } catch (parseError) {
        console.error('Error parsing message:', parseError); // Handle JSON parse errors
      }
    });
  } catch (err) {
    console.error('Redis connection error:', err); // Handle Redis connection errors
  }
}

module.exports = {
  redisPublisherClient,
  publishMessage,
  subscribeToChannel,
  handleRedisMessage,  // Exporting the message handler function
};
