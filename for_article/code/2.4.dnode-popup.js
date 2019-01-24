import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import Dnode from 'dnode/browser';

const DEV_MODE = process.env.NODE_ENV !== 'production';

setupUi().catch(console.error);

async function setupUi(){
    // Также, как и в классе приложения создаем порт, оборачиваем в stream, делаем  dnode
    const backgroundPort = extensionApi.runtime.connect({name: 'popup'});
    const connectionStream = new PortStream(backgroundPort);

    const dnode = Dnode();

    connectionStream.pipe(dnode).pipe(connectionStream);

    const background = await new Promise(resolve => {
        dnode.once('remote', api => {
            resolve(api)
        })
    });

    // Делаем объект API доступным из консоли
    if (DEV_MODE){
        global.background = background;
    }
}

