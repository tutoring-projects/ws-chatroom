const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const uuid = require('uuid/v4')

module.exports = (db) => {
    const Users = db.collection('users')
    const Sessions = db.collection('sessions')

    router.get('/', (req, res) => res.send('auth'))

    router.get('/get-cookie', (req, res) => {
        console.log(req.cookies)
        res.json(req.cookies)
    })

    router.get('/set-cookie', (req, res) => {
        res.cookie('iAmAnotherCookie', true, {
            httpOnly: true
        })
        
        res.send('set cookie')
    })

    router.post('/signup', async (req, res) => {
        const { password, username } = req.body

        const user = await Users.findOne({ username })

        if (user) return res.status(400).send('User already exists')

        if (!username || username.length < 4) return res.status(400).send('Invalid username')
        if (!password || password.length < 8) return res.status(400).send('Invalid password')

        const hash = await argon2.hash(password)

        await Users.insertOne({ username, hash })

        const session = uuid()

        await Sessions.insertOne({ username, session })

        res.cookie('session', session, { httpOnly: true })

        res.json(true)
    })

    router.post('/login', async (req, res) => {
        const { password, username } = req.body

        if (!username || username.length < 4) return res.status(400).send('Invalid username')
        if (!password || password.length < 8) return res.status(400).send('Invalid password')

        const user = await Users.findOne({ username })              // user.username & user.hash

        /*
        {
            "_id": "5e614a6ab01dd3326c318d02",
            "username": "apple",
            "hash": "$argon2i$v=19$m=4096,t=3,p=1$U1/P/J0mRwDyUDzL9uzWog$waOP8FosP+dhWf/MXoYE0JNUQxk4ScTBNzdMPUU+5TE"
        }
        */

        if (!user) return res.status(404).send('User does not exist')

        // const { hash } = user

        const verified = await argon2.verify(user.hash, password)

        const session = uuid()

        await Sessions.insertOne({ username, session })

        res.cookie('session', session, { httpOnly: true })

        res.json(verified)
    })

    router.get('/logged-in', async (req, res) => {
        const { session } = req.cookies

        if (!session) return res.json(false)

        const validSession = await Sessions.findOne({ session })

        if (validSession) res.json({ username: validSession.username })   
        else res.json(false)
    })

    router.get('/logout', async (req, res) => {
        res.clearCookie('session', { httpOnly: true })
        res.json(true)
    })

    router.get('/users', async (req, res) => {
        const users = await Users.find({}).toArray()

        res.json(users)
    })

    router.get('/sessions', async (req, res) => {
        const sessions = await Sessions.find({}).toArray()

        res.json(sessions)
    })

    router.get('/drop', async (req, res) => {
        await Users.deleteMany({})

        res.send('success')
    })

    return router
}