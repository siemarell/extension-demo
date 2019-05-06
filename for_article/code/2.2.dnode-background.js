import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import {SignerApp} from "./SignerApp";

const app = new SignerApp();

// executes every time contentscript, popup or page connects
extensionApi.runtime.onConnect.addListener(connectRemote);


function connectRemote(remotePort) {
    const processName = remotePort.name;
    const portStream = new PortStream(remotePort);
    // When we create connection, we can pass name. This way we can distinguish contentscript connection from ui connection
    // and give them different api
    if (processName === 'contentscript'){
        const origin = remotePort.sender.url
        app.connectPage(portStream, origin)
    }else{
        app.connectPopup(portStream)
    }
}

