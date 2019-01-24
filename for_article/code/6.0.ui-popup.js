import {observable} from 'mobx'
import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import {cbToPromise, setupDnode, transformMethods} from "./utils/setupDnode";
import {initApp} from "./ui/index";

const DEV_MODE = process.env.NODE_ENV !== 'production';

setupUi().catch(console.error);

async function setupUi() {
    // Подключаемся к порту, создаем из него стрим
    const backgroundPort = extensionApi.runtime.connect({name: 'popup'});
    const connectionStream = new PortStream(backgroundPort);

    // Создаем пустой observable для состояния background'a
    let backgroundState = observable.object({});
    const api = {
        //Отдаем бекграунду функцию, которая будет обновлять observable
        updateState: async state => {
            Object.assign(backgroundState, state)
        }
    };

    // Делаем RPC объект
    const dnode = setupDnode(connectionStream, api);
    const background = await new Promise(resolve => {
        dnode.once('remote', remoteApi => {
            resolve(transformMethods(cbToPromise, remoteApi))
        })
    });

    // Добавляем в background observable со стейтом
    background.state = backgroundState;

    if (DEV_MODE) {
        global.background = background;
    }

    // Запуск интерфейса
    await initApp(background)
}

