
let http = {
    get: async function(url) {
        return fetch(url)
        .then(response => response.json());
    },

    post: async function(url, data) {
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then( response => response.json() );
    },
}

export default http;