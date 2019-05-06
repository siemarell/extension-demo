import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import Dnode from 'dnode/browser';

const DEV_MODE = process.env.NODE_ENV !== 'production';

setupUi().catch(console.error);

async function setupUi(){
    // Get port. Convert port to stream. Create rpc over stream
    const backgroundPort = extensionApi.runtime.connect({name: 'popup'});
    const connectionStream = new PortStream(backgroundPort);

    const dnode = Dnode();

    connectionStream.pipe(dnode).pipe(connectionStream);

    const background = await new Promise(resolve => {
        dnode.once('remote', api => {
            resolve(api)
        })
    });

    // Make api object available for debug
    if (DEV_MODE){
        global.background = background;
    }
}

