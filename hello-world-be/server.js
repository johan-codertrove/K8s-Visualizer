const http = require('http');
const redis = require('redis');
const { v4: uuidv4 } = require('uuid');

const uniqueID = uuidv4();  // Generates a unique ID for each instance

const host = process.env.REDIS_HOST || 'redis-service';

console.log('process.env.REDIS_HOST: ', process.env.REDIS_HOST)

const client = redis.createClient({
    url: `redis://${host}:6379`
});

client.on('error', (err) => console.log('Redis Client Error', err));

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        try {
            const reply = await client.incr('counter');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Hello world from node instance ${uniqueID}! This server (cluster) has been visited ${reply} times.\n`);
        } catch (err) {
            console.error('Redis error:', err);
            res.writeHead(500);
            res.end('Failed to connect to Redis');
        }
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;

// Start server only if Redis is connected
client.connect().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to Redis:', err);
});
