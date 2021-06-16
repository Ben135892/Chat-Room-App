const name = document.getElementById('name');
const form = document.getElementById('form');

form.addEventListener('submit', e => {
    e.preventDefault(); // stop page refreshing
    if (name.value == '')
        return;
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