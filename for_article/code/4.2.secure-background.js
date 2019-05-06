import {reaction, toJS} from 'mobx';
import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import {SignerApp} from "./SignerApp";
import {loadState, saveState} from "./utils/localStorage";

const DEV_MODE = process.env.NODE_ENV !== 'production';
const IDLE_INTERVAL = 30;

setupApp();

function setupApp() {
    const initState = loadState();
    const app = new SignerApp(initState);

    if (DEV_MODE) {
        global.app = app;
    }

    reaction(
        () => ({
            vault: app.store.vault
        }),
        saveState
    );

    // Idle timeout
    extensionApi.idle.setDetectionInterval(IDLE_INTERVAL);
    // Lock app on idle or os lock
    extensionApi.idle.onStateChanged.addListener(state => {
        if (['locked', 'idle'].indexOf(state) > -1) {
            app.lock()
        }
    });

    // Connect to other contexts
    extensionApi.runtime.onConnect.addListener(connectRemote);

    function connectRemote(remotePort) {
        const processName = remotePort.name;
        const portStream = new PortStream(remotePort);
        if (processName === 'contentscript') {
            const origin = remotePort.sender.url
            app.connectPage(portStream, origin)
        } else {
            app.connectPopup(portStream)
        }
    }
}