console.log("popup loaded");

function logSubmit(event) {
    event.preventDefault()
    console.log('start request')

    const username = document.getElementById('username');
    console.log(username.value)
    if (username.value) {

        fetch('https://cors-anywhere.herokuapp.com/http://165.232.124.230/process/', {
            method: 'POST',
            body: JSON.stringify({username: 'elonmusk'}), // string or object
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
            const m = res['triad']['machiavellianism']
            const p = res['triad']['psychopathy']
            const n = res['triad']['narcissism']
            const a = res['political']['authoritarian']
            const r = res['political']['right']
            const url = "profile.html?m=" + m + "&p=" + p + "&n=" + n +"&a=" + a +"&r=" + r;
            window.location.href = url;
        })

    }

}

const form = document.getElementById('form');
form.addEventListener('submit', logSubmit);