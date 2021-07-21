const WebSocket = require('ws');
const PORT =  process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

//invoked upon a successful connection
wss.on('connection', function connection(ws) {
  //invoked when a WebSocket message from a client is received
  ws.on('message', function incoming(message) {

    message = JSON.parse(message);

    if(message.type == "name"){
      ws.nickname = message.data;
      return;
    }

    console.log('received: ', message);

    wss.clients.forEach((client) => {
      if(client != ws)
      client.send(JSON.stringify({
        name: ws.nickname,
        data: message.data
      }));
    });
  });

  ws.on('close', () => {
    console.log( ws.nickname +" left");
  });

  console.log(ws.nickname + " joined");
});
