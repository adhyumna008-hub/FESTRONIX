// Temporary, localhost-only specimen server. No dependencies or production integration.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const page = path.join(__dirname, 'index.html');
http.createServer((request, response) => {
  if (new URL(request.url, 'http://localhost').pathname !== '/') {
    response.writeHead(404); response.end('Not found'); return;
  }
  response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'});
  fs.createReadStream(page).pipe(response);
}).listen(4177, '127.0.0.1', () => console.log('Typography specimen: http://127.0.0.1:4177/'));
