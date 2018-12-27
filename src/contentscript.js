import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";
import PostMessageStream from 'post-message-stream';

setupConnection();
injectScript();

function setupConnection(){
    const backgroundPort = extensionApi.runtime.connect({name: 'contentscript'});
    const backgroundStream = new PortStream(backgroundPort);

    const pageStream = new PostMessageStream({
        name: 'content',
        target: 'page',
    });

    pageStream.pipe(backgroundStream).pipe(pageStream);
}


function injectScript(){
    try {
        // inject in-page script
        let script = document.createElement('script');
        script.src = extensionApi.extension.getURL('inpage.js');
        const container = document.head || document.documentElement;
        container.insertBefore(script, container.children[0]);
        script.onload = () => script.remove();
    } catch (e) {
        console.error('Injection failed.', e);
    }
}
