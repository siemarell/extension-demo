import Dnode from 'dnode/browser';

export class SignerApp {

    // Returns API object for ui
    popupApi(){
        return {
            hello: cb => cb(null, 'world')
        }
    }

    // Returns API object for page
    pageApi(){
        return {
            hello: cb => cb(null, 'world')
        }
    }

    // Creates rpc connection for ui
    connectPopup(connectionStream){
        const api = this.popupApi();
        const dnode = Dnode(api);

        connectionStream.pipe(dnode).pipe(connectionStream);

        dnode.on('remote', (remote) => {
            console.log(remote)
        })
    }

    // Creates rpc connection for page
    connectPage(connectionStream, origin){
        const api = this.popupApi();
        const dnode = Dnode(api);

        connectionStream.pipe(dnode).pipe(connectionStream);

        dnode.on('remote', (remote) => {
            console.log(origin);
            console.log(remote)
        })
    }

}