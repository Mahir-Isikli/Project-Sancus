console.log("popup loaded");

function logSubmit(event) {
    event.preventDefault()
    console.log('start request')
    fetch('http://165.232.124.230/process/', {
        method: 'POST',
        body: JSON.stringify({username: 'elonmusk'}), // string or object
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
        }
        )
        .then(res => res.json())
        .then(res => console.log(res));

}

const form = document.getElementById('form');
form.addEventListener('submit', logSubmit);