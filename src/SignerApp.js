import {setupDnode} from "./utils/setupDnode";

export class SignerApp {

    constructor(){

        this.store = {
            keys: [],
        };

    }

    addKey(key){
        this.store.keys.push(key)
    }

    removeKey(index){
        this.store.keys.splice(index,1)
    }

    popupApi(){
        return {
            addKey: async (key) => this.addKey(key),
            removeKey: async (index) => this.removeKey(index)
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