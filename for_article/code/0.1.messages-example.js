// Any JSON-serializable object could be used as msg
const msg = {a:'foo', b: 'bar'};

// You can omit extensionId in case message is sent to 'parent' exntesion. E.g.: from UI or contentscript
chrome.runtime.sendMessage(extensionId, msg);

// Handler
chrome.runtime.onMessage.addListener((msg)=>console.log(msg))

// You can send message to any chrome tab by id
chrome.tabs.sendMessage(tabId, msg)

// Access to tabs. E.g.: log current tab
chrome.tabs.query(
    {currentWindow: true, active : true},
    function(tabArray){
      tabArray.forEach(tab => console.log(tab.id))
    }
)