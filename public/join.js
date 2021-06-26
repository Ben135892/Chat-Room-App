const name = document.getElementById('name');
const form = document.getElementById('form');
const error = document.getElementsByClassName('error')[0];
let clickCount = 0;

form.addEventListener('submit', e => {
    e.preventDefault(); // stop page refreshing
    if (name.value == '' || clickCount >= 1)
        return;
    clickCount++;
    fetch('/chat/join', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name.value })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success)
            window.location.href = data.redirect;
        else 
            error.innerText = data.message;
    })
    .catch(err => console.log(err));
});