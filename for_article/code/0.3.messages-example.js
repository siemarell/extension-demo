// Connection handler for other parts of the same extension. Content scripts, popup pages etc.
chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "knockknock");
    port.onMessage.addListener(function(msg) {
        if (msg.joke === "Knock knock")
            port.postMessage({question: "Who's there?"});
        else if (msg.answer === "Madame")
            port.postMessage({question: "Madame who?"});
        else if (msg.answer === "Madame... Bovary")
            port.postMessage({question: "I don't get it."});
    });
});

// External connection handler. Other extensions or web-pages
chrome.runtime.onConnectExternal.addListener(function(port) {
    ...
});