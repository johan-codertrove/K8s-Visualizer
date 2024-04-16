const http = require('http');
const redis = require('redis');

const host = process.env.REDIS_HOST || 'redis-service';
const podName = process.env.POD_NAME || 'not a pod';
const podIp = process.env.POD_IP || 'not a pod';

const client = redis.createClient({
    url: `redis://${host}:6379`
});

client.on('error', (err) => console.log('Redis Client Error', err));

let requestCount = 0;

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        try {
            const reply = await client.incr('counter');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Hello world! from node instance: ${podName} at IP: ${podIp}, This node has been visited ${++requestCount} times and the cluster has been visited a total of ${reply} times.\n`);
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
