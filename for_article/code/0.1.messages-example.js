// Сообщением может быть любой JSON сериализуемый объект
const msg = {a:'foo', b: 'bar'};

// extensionId можно не указывать, если мы хотим послать сообщение 'своему' расширению (из ui или контент скрипта)
chrome.runtime.sendMessage(extensionId, msg);

// Вот так выглядит обработчик
chrome.runtime.onMessage.addListener((msg)=>console.log(msg))

// Можно слать сообщения вкладкам зная их id
chrome.tabs.sendMessage(tabId, msg)

// Получить к вкладкам и их id можно например вот так
chrome.tabs.query(
    {currentWindow: true, active : true},
    function(tabArray){
      tabArray.forEach(tab => console.log(tab.id))
    }
)