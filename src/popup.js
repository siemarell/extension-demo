import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import {cbToPromise, setupDnode, transformMethods} from "./utils/setupDnode";

const DEV_MODE = process.env.NODE_ENV !== 'production';

setupUi().catch(console.error);

async function setupUi(){
    const backgroundPort = extensionApi.runtime.connect({name: 'popup'});
    const connectionStream = new PortStream(backgroundPort);

    const api = {};
    const dnode = setupDnode(connectionStream, api);

    const background = await new Promise(resolve => {
        dnode.once('remote', remoteApi => {
            resolve(transformMethods(cbToPromise, remoteApi))
        })
    });

    if (DEV_MODE){
        global.background = background;
    }
}

