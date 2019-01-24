import {reaction, toJS} from 'mobx';
import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import {SignerApp} from "./SignerApp";
// Вспомогательные методы. Записывают/читают объект в/из localStorage виде JSON строки по ключу 'store'
import {loadState, saveState} from "./utils/localStorage";

const DEV_MODE = process.env.NODE_ENV !== 'production';

setupApp();

function setupApp() {
    const initState = loadState();
    const app = new SignerApp(initState);

    if (DEV_MODE) {
        global.app = app;
    }

    // Setup state persistence

    // Результат reaction присваивается переменной, чтобы подписку можно было отменить. Нам это не нужно, оставлено для примера
    const localStorageReaction = reaction(
        () => toJS(app.store), // Функция-селектор данных
        saveState // Функция, которая будет вызвана при изменении данных, которые возвращает селектор
    );

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