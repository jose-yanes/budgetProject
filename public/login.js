const urlParams = new URLSearchParams(window.location.search);
const failedParam = urlParams.get('cred');
console.log(failedParam);
if(failedParam === 'false'){
    const failedMessage = document.createElement('p');
    failedMessage.textContent = 'Username or password invalid 😢';
    console.log(failedMessage.textContent)
    const form = document.getElementById('loginDiv');

    form.appendChild(failedMessage);
}