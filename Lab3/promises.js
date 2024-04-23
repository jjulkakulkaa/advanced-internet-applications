function loadContent() {
    var url = 'https://jsonplaceholder.typicode.com/posts/1'; 
    makeHttpRequest(url)
        .then(function(response) {
            document.getElementById('content').innerText = response;
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
}

function makeHttpRequest(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject('Error: ' + xhr.status + ' ' + xhr.statusText);
            }
        };
        xhr.onerror = function() {
            reject('Error: Network request failed');
        };
        xhr.send();
    });
}