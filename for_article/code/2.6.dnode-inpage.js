import PostMessageStream from 'post-message-stream';
import Dnode from 'dnode/browser';


setupInpageApi().catch(console.error);


async function setupInpageApi() {
    // Стрим к контентскрипту
    const connectionStream = new PostMessageStream({
        name: 'page',
        target: 'content',
    });

    const dnode = Dnode();

    connectionStream.pipe(dnode).pipe(connectionStream);

    // Получаем объект API
    const pageApi = await new Promise(resolve => {
        dnode.once('remote', api => {
            resolve(api)
        })
    });

    // Доступ через window
    global.SignerApp = pageApi;
}