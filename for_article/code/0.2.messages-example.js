// Опять же extensionId можно не указывать при коммуникации внутри одного расширения. Подключение можно именовать
const port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
    if (msg.question === "Who's there?")
        port.postMessage({answer: "Madame"});
    else if (msg.question === "Madame who?")
        port.postMessage({answer: "Madame... Bovary"});
});

