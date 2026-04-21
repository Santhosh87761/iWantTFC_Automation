#!/usr/bin/env node
'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const reportDir = path.resolve(process.cwd(), process.argv[2] || 'allure-report');

if (!fs.existsSync(reportDir)) {
  console.error(`Allure report directory not found: ${reportDir}`);
  process.exit(1);
}

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function openBrowser(url) {
  const platform = process.platform;

  if (platform === 'win32') {
    return spawn('cmd', ['/c', 'start', '', url], {
      detached: true,
      stdio: 'ignore',
    });
  }

  if (platform === 'darwin') {
    return spawn('open', [url], { detached: true, stdio: 'ignore' });
  }

  return spawn('xdg-open', [url], { detached: true, stdio: 'ignore' });
}

function sendFile(filePath, response) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || 'application/octet-stream';

  response.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const safePath = requestPath === '/' ? '/index.html' : requestPath;
  const resolvedPath = path.resolve(reportDir, `.${safePath}`);

  if (!resolvedPath.startsWith(reportDir)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  fs.stat(resolvedPath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    sendFile(resolvedPath, response);
  });
});

server.listen(0, '127.0.0.1', () => {
  const address = server.address();
  if (!address || typeof address === 'string') {
    console.error('Failed to determine local server address.');
    process.exit(1);
  }

  const url = `http://127.0.0.1:${address.port}/`;
  openBrowser(url).unref();
  console.log(`Allure report available at ${url}`);
  console.log('Press Ctrl+C to stop the local report server.');
});

server.on('error', (error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
