const name = document.getElementById('name');
const form = document.getElementById('form');
let clickCount = 0; // don't allow multiple form submits

form.addEventListener('submit', e => {
    e.preventDefault(); // stop page refreshing
    if (name.value == '' || clickCount >= 1) 
        return;
    clickCount++;
    fetch('/chat/create', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name.value })
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = data.redirect;
    })
    .catch(err => console.log(err));
});