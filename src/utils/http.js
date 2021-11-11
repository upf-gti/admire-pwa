
let http = {
    get: async function(url, options = {}) {
        const headers = Object.assign({
            'Content-Type': 'application/json'
        }, options.headers ?? {});

        return fetch(url, {method: 'GET',headers})
        .then(response => response.json())
        .catch(error => console.trace(error));
    },

    post: async function(url, options = {}) {
        const headers = Object.assign({
            'Content-Type': 'application/json'
        }, options.headers ?? {});

        const body = JSON.stringify(options.data ?? {});

        return fetch(url, {method: 'POST',headers,body})
        .then(response =>  response.json())
        .catch(error => console.trace(error));
    },
}

export default http;