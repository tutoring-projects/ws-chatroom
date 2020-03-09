const inputUsername = document.querySelector('#username')
const inputPassword = document.querySelector('#password')
const loginButton = document.querySelector('button')

loginButton.addEventListener('click', () => {
    const { value: username } = inputUsername
    const { value: password } = inputPassword 

    console.log(username, password)

    fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
    }).then(async response => {
        if (response.status !== 200) throw await response.text()
        else return await response.json()
    }).then( success => {
        if (success === true) {
            window.location.href = 'http://localhost'
        }
    }).catch(console.error)
    

    // const { a } = inputUsername.value
    // const { value: { a } } = inputUsername

    // window.location.href = "http://localhost"
})

fetch ('/auth/logged-in')
    .then(d => d.json())
    .then(loggedIn => {
        if (loggedIn) window.location.href = "http://localhost"
    })