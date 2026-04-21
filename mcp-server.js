#!/usr/bin/env node

/**
 * MCP Server
 * Serves framework context and manifest files via HTTP
 * Endpoints:
 *   GET /health - Health check
 *   GET /manifest - Framework manifest
 *   GET /context/:filename - Serve files from .mcp-context/
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.MCP_PORT || 3000;
const MCP_CONTEXT_DIR = path.join(__dirname, '.mcp-context');

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: 'MCP Framework Server'
  });
});

// Manifest endpoint (serves bf-manifest-schema.json)
app.get('/manifest', (req, res) => {
  const manifestPath = path.join(MCP_CONTEXT_DIR, 'bf-manifest-schema.json');

  try {
    const manifest = fs.readFileSync(manifestPath, 'utf-8');
    res.set('Content-Type', 'application/json');
    res.send(manifest);
  } catch (error) {
    res.status(404).json({
      error: 'Manifest not found',
      details: error.message
    });
  }
});

// Context files endpoint
app.get('/context/:filename', (req, res) => {
  const { filename } = req.params;

  // Security: Prevent directory traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  const filePath = path.join(MCP_CONTEXT_DIR, filename);

  try {
    // Check if file exists and is within .mcp-context/
    if (!fs.existsSync(filePath) || !filePath.startsWith(MCP_CONTEXT_DIR)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filename);

    // Set appropriate content type
    let contentType = 'text/plain';
    if (ext === '.json') contentType = 'application/json';
    else if (ext === '.md') contentType = 'text/markdown';

    res.set('Content-Type', contentType);
    res.send(content);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to read file',
      details: error.message
    });
  }
});

// List available context files
app.get('/context', (req, res) => {
  try {
    const files = fs.readdirSync(MCP_CONTEXT_DIR);
    res.json({
      contextDirectory: '.mcp-context',
      availableFiles: files,
      baseUrl: `http://localhost:${PORT}/context`
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to list files',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═════════════════════════════════════════╗
║   MCP Framework Server Started          ║
║   Port: ${PORT}                         ║
╚═════════════════════════════════════════╝

📍 Available Endpoints:
  • GET  /health              → Health check
  • GET  /manifest            → BF Manifest Schema
  • GET  /context             → List available context files
  • GET  /context/:filename   → Serve context files (*.json, *.md)

🔗 URLs:
  • Health:   http://localhost:${PORT}/health
  • Manifest: http://localhost:${PORT}/manifest
  • Context:  http://localhost:${PORT}/context

To stop: Press Ctrl+C
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n✋ MCP Server shutting down...\n');
  process.exit(0);
});
