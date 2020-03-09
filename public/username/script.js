const inputUsername = document.querySelector('input')
const loginButton = document.querySelector('button')

loginButton.addEventListener('click', () => {
    localStorage.username = inputUsername.value
    window.location.href = "http://localhost"
})

