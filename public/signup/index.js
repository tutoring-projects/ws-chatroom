const inputUsername = document.querySelector('#username')
const inputPassword = document.querySelector('#password')
const inputConfirmPassword = document.querySelector('#confirm-password')
const loginButton = document.querySelector('button')

loginButton.addEventListener('click', () => {
    const { value: username } = inputUsername
    const { value: password } = inputPassword 
    const { value: confirmPassword } = inputConfirmPassword 

    console.log(username, password, confirmPassword)

    if ( password !== confirmPassword ) console.error('Password doesn\'t match')

    else fetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
    }).then(async response => {
        if (response.status !== 200) throw await response.text()                       // when we throw, we pass to .catch fx
        else return await response.json()
    }).then( success => {
        if (success === true) {
            window.location.href = 'http://localhost'
        }
    }).catch(console.error)
})

fetch ('/auth/logged-in')
    .then(d => d.json())
    .then(loggedIn => {
        if (loggedIn) window.location.href = "http://localhost"
    })