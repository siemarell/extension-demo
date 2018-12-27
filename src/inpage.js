import PostMessageStream from 'post-message-stream';
import {cbToPromise, setupDnode, transformMethods} from "./utils/setupDnode";


setupInpageApi().catch(console.error);


async function setupInpageApi() {
    const connectionStream = new PostMessageStream({
        name: 'page',
        target: 'content',
    });

    const api = {};
    const dnode = setupDnode(connectionStream, api);

    const pageApi = await new Promise(resolve => {
        dnode.once('remote', remoteApi => {
            resolve(transformMethods(cbToPromise, remoteApi))
        })
    });

    global.SignerApp = pageApi;
}