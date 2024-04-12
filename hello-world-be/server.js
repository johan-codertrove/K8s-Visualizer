const http = require('http');

// Counter to track the number of requests
let requestCount = 0;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        requestCount++;
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello world! This server has been visited ${requestCount} times.\n`);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
