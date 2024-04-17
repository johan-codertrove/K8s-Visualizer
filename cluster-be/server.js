const http = require('http');
const redis = require('redis');

const host = process.env.REDIS_HOST || 'redis-service';
const podName = process.env.POD_NAME || 'not a pod';
const podIp = process.env.POD_IP || 'not a pod';

const client = redis.createClient({
    url: `redis://${host}:6379`
});

client.on('error', (err) => console.log('Redis Client Error', err));

const server = http.createServer(async (req, res) => {
    if (req.url === '/') {
        try {
            // Increment the global counter
            const totalVisits = await client.incr('globalCounter');
            
            await client.incr(`node:${podName}:visits`);

            // Fetch all nodes data
            const keys = await client.keys('node:*:visits');
            const nodes = await Promise.all(keys.map(async key => {
                const localCount = await client.get(key);
                const nodeName = key.split(':')[1]; // Assuming the key format is 'node:{podName}:visits'
                return {
                    nodeInstance: nodeName,
                    ip: nodeName === podName ? podIp : 'unknown', // Only the current node's IP is known
                    localVisits: parseInt(localCount, 10),
                    isActive: nodeName === podName // Mark the current node as active
                };
            }));

            const responseData = {
                nodes: nodes,
                totalVisits: totalVisits
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(responseData));
        } catch (err) {
            console.error('Redis error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to connect to Redis' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
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
