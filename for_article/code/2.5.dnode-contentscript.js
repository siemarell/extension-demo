import PostMessageStream from 'post-message-stream';
import {extensionApi} from "./utils/extensionApi";
import {PortStream} from "./utils/PortStream";

setupConnection();
injectScript();

function setupConnection(){
    // Background stream over port
    const backgroundPort = extensionApi.runtime.connect({name: 'contentscript'});
    const backgroundStream = new PortStream(backgroundPort);

    // Page stream over postMessage API
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
