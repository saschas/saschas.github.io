var shaderLoader = {};

shaderLoader.load = function (url, callback) {
    // Set up an asynchronous request
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                callback(request.responseText);
            } else { // Failed
                console.error("shaderLoader :: Load Faild");
            }
        }
    };

    request.send(null);    
};