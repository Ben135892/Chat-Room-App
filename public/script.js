const name = document.getElementById('name');
const create = document.getElementById('create');

create.addEventListener('click', e => {
    console.log('d');
    e.preventDefault(); // stop page refreshing
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