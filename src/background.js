import {reaction} from 'mobx';
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

    // Setup state persistence
    reaction(
        () => ({
            vault: app.store.vault
        }),
        saveState
    );

    // update badge
    reaction(
        () => app.store.newMessages.length > 0 ? app.store.newMessages.length.toString() : '',
        text => extensionApi.browserAction.setBadgeText({text}),
        {fireImmediately: true}
    );

    // Lock on idle
    extensionApi.idle.setDetectionInterval(IDLE_INTERVAL);
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