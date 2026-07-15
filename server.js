const express = require('express');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, '.')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/terminal' });

wss.on('connection', (ws) => {
  const shell = spawn('/bin/bash', [], {
    env: {
      ...process.env,
      TERM: 'xterm-256color',
      PS1: '\\[\\e[1;32m\\]aura@nano\\[\\e[0m\\]:\\[\\e[1;36m\\]\\w\\[\\e[0m\\] \\[\\e[1;31m\\]%\\[\\e[0m\\] '
    },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  let buffer = '';
  const enc = new TextEncoder();

  shell.stdout.on('data', (data) => {
    ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
  });

  shell.stderr.on('data', (data) => {
    ws.send(JSON.stringify({ type: 'output', data: '\x1b[91m' + data.toString() + '\x1b[0m' }));
  });

  ws.on('message', (msg) => {
    try {
      const parsed = JSON.parse(msg.toString());
      if (parsed.type === 'input') {
        shell.stdin.write(parsed.data);
      } else if (parsed.type === 'resize') {
        if (shell.stdin.writable) {
          shell.stdin.write('\x1b[8;' + parsed.rows + ';' + parsed.cols + 't');
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  });

  ws.on('close', () => {
    shell.kill('SIGTERM');
    setTimeout(() => shell.kill('SIGKILL'), 2000);
  });

  shell.on('exit', (code) => {
    ws.send(JSON.stringify({ type: 'output', data: '\r\n\x1b[1;31m[Process completed: exit code ' + code + ']\x1b[0m\r\n' }));
    try { ws.close(); } catch(e) {}
  });

  ws.send(JSON.stringify({ type: 'output', data: '\x1b[32m╔═══════════════════════════════════════════╗\x1b[0m\r\n' }));
  ws.send(JSON.stringify({ type: 'output', data: '\x1b[32m║\x1b[0m  \x1b[1;37mNANO OS - Real Terminal\x1b[0m           \x1b[32m║\x1b[0m\r\n' }));
  ws.send(JSON.stringify({ type: 'output', data: '\x1b[32m║\x1b[0m  Type \x1b[1;33mhelp\x1b[0m for commands or run \x1b[1;33mpython3\x1b[0m  \x1b[32m║\x1b[0m\r\n' }));
  ws.send(JSON.stringify({ type: 'output', data: '\x1b[32m╚═══════════════════════════════════════════╝\x1b[0m\r\n' }));
});

server.listen(3000, () => {
  console.log('  NANO OS running at: http://localhost:3000');
  console.log('  Terminal:           ws://localhost:3000/terminal');
});
