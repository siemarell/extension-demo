import PostMessageStream from 'post-message-stream';
import Dnode from 'dnode/browser';


setupInpageApi().catch(console.error);


async function setupInpageApi() {
    const connectionStream = new PostMessageStream({
        name: 'page',
        target: 'content',
    });

    const dnode = Dnode();

    connectionStream.pipe(dnode).pipe(connectionStream);

    const pageApi = await new Promise(resolve => {
        dnode.once('remote', api => {
            resolve(api)
        })
    });

    global.SignerApp = pageApi;
}