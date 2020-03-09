const express = require('express')
const cookieParser = require('cookie-parser')
const app = express()
const path = require('path')
const MongoClient = require('mongodb').MongoClient

app.use(cookieParser())

const clients = require('./api/ws')

MongoClient.connect(
    'mongodb://localhost:27017/ws-chatroom', 

    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, 

    (error, client) => {
        if (error) throw error

        console.log('Connected to database')

        app.use(express.json())

        const db = client.db('ws-chatroom')

        const router = require('./api/auth.js')(db)

        app.use('/auth', router)

        app.use('/', express.static(path.join(__dirname, 'public')))
    }
)

app.listen(80)

console.log('Listening on port 80')


