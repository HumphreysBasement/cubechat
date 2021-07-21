const WebSocket = require('ws');
const PORT =  process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

/*
1. establish connexion
client connect to server at ws://{host}/chat/{username}

so, server now can associate the username with the client.

server reject client if username is taken

send those things in json to client nested
*/

//                                              space

//invoked upon a successful connection
// req is type http.IncomingMessage: https://nodejs.org/api/http.html#http_class_http_incomingmessage
wss.on('connection', function connection(ws, req) {
   //invoked when a WebSocket message from a client is received
    const parts = req.url.split('/')
    ws.nickname = parts[parts.length-1]

    if ([...wss.clients].some(w => w !== ws && w.nickname === ws.nickname)) {
        ws.send(JSON.stringify({ type: 'reject', message: 'jim ryan' }))
        ws.close(1000)
        return;
    }

    ws.x = ws.y = ws.z = 0;


    //show new user to already users
    wss.clients.forEach((client) => {
        client.send(JSON.stringify({
            type: 'existance',
            username: ws.nickname,
            x: ws.x,
            y: ws.y,
            z: ws.z
        }));
    });

    //show already user to new user
    wss.clients.forEach((client) => {
        if (client === ws) return;
        ws.send(JSON.stringify({
            type: 'existance',
            username: client.nickname,
            x: client.x,
            y: client.y,
            z: client.z
        }));
    });

    ws.on('message', function incoming(message) {
        message = JSON.parse(message);

        console.log('received: ', message);
        //existence
        //your code goes here:

        //move
        //your code goes here:
        if(message.type == "move"){
            ws.x = message.x;
            ws.y = message.y;
            ws.z = message.z;
            wss.clients.forEach((client) => {
                client.send(JSON.stringify({
                    type: 'move',
                    username: ws.nickname,
                    x: ws.x,
                    y: ws.y,
                    z: ws.z
                }));
            });
            return;
        }

        //say
        //your code goes here:
        if(message.type == "say"){
            wss.clients.forEach((client) => {
                client.send(JSON.stringify({
                    type: 'say',
                    username: ws.nickname,
                    message: message.message
                }));
            });
            return;
        }
    });
    ws.on('close', () => {
        //nonexistence
        //your code goes here:
        wss.clients.forEach((client) => {
            client.send(JSON.stringify({
            type: 'nonexistance',
            username: ws.nickname
            }));
        })
    });

  console.log(ws.nickname + " joined");
});
