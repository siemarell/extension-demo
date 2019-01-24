import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import {SignerApp} from "./SignerApp";

const DEV_MODE = process.env.NODE_ENV !== 'production';

setupApp();

function setupApp() {
    const app = new SignerApp();

    if (DEV_MODE) {
        global.app = app;
    }

    extensionApi.runtime.onConnect.addListener(connectRemote);

    function connectRemote(remotePort) {
        const processName = remotePort.name;
        const portStream = new PortStream(remotePort);
        if (processName === 'contentscript') {
            const origin = remotePort.sender.url;
            app.connectPage(portStream, origin)
        } else {
            app.connectPopup(portStream)
        }
    }
}