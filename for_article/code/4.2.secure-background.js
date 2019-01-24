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

    // Теперь мы явно узываем поле, которому будет происходить доступ, reaction отработает нормально
    reaction(
        () => ({
            vault: app.store.vault
        }),
        saveState
    );

    // Таймаут бездействия, когда сработает событие
    extensionApi.idle.setDetectionInterval(IDLE_INTERVAL);
    // Если пользователь залочил экран или бездействовал в течение указанного интервала лочим приложение
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