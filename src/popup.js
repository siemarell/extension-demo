import {observable} from 'mobx'
import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import {cbToPromise, setupDnode, transformMethods} from "./utils/setupDnode";
import {initApp} from "./ui/index";

const DEV_MODE = process.env.NODE_ENV !== 'production';

setupUi().catch(console.error);

async function setupUi() {
    // Create connection port. Convert port to stream
    const backgroundPort = extensionApi.runtime.connect({name: 'popup'});
    const connectionStream = new PortStream(backgroundPort);

    // Create empty observable for background state
    let backgroundState = observable.object({});
    const api = {
        // Expose update function to background
        updateState: async state => {
            Object.assign(backgroundState, state)
        }
    };

    // Create RPC object
    const dnode = setupDnode(connectionStream, api);
    const background = await new Promise(resolve => {
        dnode.once('remote', remoteApi => {
            resolve(transformMethods(cbToPromise, remoteApi))
        })
    });

    // Add background state to background RPC object
    background.state = backgroundState;

    if (DEV_MODE) {
        global.background = background;
    }

    // Interface app start
    await initApp(background)
}

