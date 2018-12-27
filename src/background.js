import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import {SignerApp} from "./SignerApp";

const app = new SignerApp();

extensionApi.runtime.onConnect.addListener(connectRemote);

function connectRemote(remotePort) {
    const processName = remotePort.name;
    const portStream = new PortStream(remotePort);
    if (processName === 'contentscript'){
        const origin = remotePort.sender.url
        app.connectPage(portStream, origin)
    }else{
        app.connectPopup(portStream)
    }
}

