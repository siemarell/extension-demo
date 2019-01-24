import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import {SignerApp} from "./SignerApp";

const app = new SignerApp();

// onConnect срабатывает при подключении 'процессов' (contentscript, popup, или страница расширения)
extensionApi.runtime.onConnect.addListener(connectRemote);


function connectRemote(remotePort) {
    const processName = remotePort.name;
    const portStream = new PortStream(remotePort);
    // При установке соединения можно указывать имя, по этому имени мы и оппределяем кто к нам подлючился, контентскрипт или ui
    if (processName === 'contentscript'){
        const origin = remotePort.sender.url
        app.connectPage(portStream, origin)
    }else{
        app.connectPopup(portStream)
    }
}

