import {setupDnode} from "./utils/setupDnode";

export class SignerApp {

    popupApi(){
        return {
            hello: async () => "world"
        }
    }

    pageApi(){
        return {
            hello: async () => "world"
        }
    }

    connectPopup(connectionStream){
        const api = this.popupApi();
        const dnode = setupDnode(connectionStream, api);

        dnode.on('remote', (remote) => {
            console.log(remote)
        })
    }

    connectPage(connectionStream, origin){
        const api = this.popupApi();
        const dnode = setupDnode(connectionStream, api);

        dnode.on('remote', (remote) => {
            console.log(origin);
            console.log(remote)
        })
    }

}