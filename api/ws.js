const WebSocket = require('ws')
 
const wss = new WebSocket.Server({ 
    port: 8080
})

const clients = [] 

const log = []
 
wss.on('connection', (ws) => {
    clients.push(ws)

    ws.on('message', (json) => {
        const { message } = JSON.parse(json)

        log.push(message)

        for (const client of clients) {
            client.send(JSON.stringify({ message }))
        }
    })

    ws.send(JSON.stringify({ log }))
    
    console.log('Connection has been established.')
})

console.log('WebSocket server listening on port 8080')

module.exports = clients