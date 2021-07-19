const WebSocket = require('ws');
const PORT =  process.env.PORT;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: ', message);
  });

  ws.send('something');
});
