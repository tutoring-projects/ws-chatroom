const log = document.querySelector('#log')
const inputBox = document.querySelector('input')
const sendButton = document.querySelector('button')

let username

const ws = new WebSocket('ws://localhost:8080')

ws.onopen = () => {
    console.log('Connected to server.')   
}

const send = () => {
    const message = username + ': ' + inputBox.value
    ws.send(JSON.stringify({ message }))
    inputBox.value = ""
}

sendButton.addEventListener('click', send)

inputBox.addEventListener('keydown', event => {
    if (event.key === "Enter") send()
})

const appendMessage = (string) => {
    const p = document.createElement("p")
    p.innerText = string
    log.append(p)
}

ws.onmessage = (response) => {
    const { log, message } = JSON.parse(response.data)

    if (message) appendMessage(message) 
    else for (const message of log) {
        appendMessage(message)
    }
}

// check if logged in before connecting

fetch ('/auth/logged-in')
    .then(d => d.json())
    .then(loggedIn => {
        if (!loggedIn) window.location.href = "http://localhost/login"
        username = loggedIn.username
    })