import Dnode from 'dnode/browser';

export class SignerApp {

    popupApi(){
        return {
            hello: cb => cb(null, 'world')
        }
    }

    pageApi(){
        return {
            hello: cb => cb(null, 'world')
        }
    }

    connectPopup(connectionStream){
        const api = this.popupApi();
        const dnode = Dnode(api);

        connectionStream.pipe(dnode).pipe(connectionStream);

        dnode.on('remote', (remote) => {
            console.log(remote)
        })
    }

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