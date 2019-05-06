import PostMessageStream from 'post-message-stream';
import Dnode from 'dnode/browser';


setupInpageApi().catch(console.error);


async function setupInpageApi() {
    // Contentscript stream
    const connectionStream = new PostMessageStream({
        name: 'page',
        target: 'content',
    });

    const dnode = Dnode();

    connectionStream.pipe(dnode).pipe(connectionStream);

    // Get API object
    const pageApi = await new Promise(resolve => {
        dnode.once('remote', api => {
            resolve(api)
        })
    });

    // Global access for debug
    global.SignerApp = pageApi;
}