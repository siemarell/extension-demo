// Обработчик для подключения 'своих' вкладок. Контент скриптов, popup или страниц расширения
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

// Обработчик для подключения внешних вкладок. Других расширений или веб страниц, которым разрешен доступ в манифесте
chrome.runtime.onConnect.addListener(function(port) {
    ...
});