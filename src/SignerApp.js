import {observable, action} from 'mobx';
import {setupDnode} from "./utils/setupDnode";

export class SignerApp {

    constructor(initState) {
        const defaultState = {
            keys: [],
        };
        this.store = observable.object({...defaultState, ...initState})
    }

    @action
    addKey(key) {
        this.store.keys.push(key)
    }

    @action
    removeKey(index) {
        this.store.keys.splice(index, 1)
    }

    popupApi() {
        return {
            addKey: async (key) => this.addKey(key),
            removeKey: async (index) => this.removeKey(index)
        }
    }

    pageApi() {
        return {
            hello: async () => "world"
        }
    }

    connectPopup(connectionStream) {
        const api = this.popupApi();
        const dnode = setupDnode(connectionStream, api);

        dnode.on('remote', (remote) => {
            console.log(remote)
        })
    }

    connectPage(connectionStream, origin) {
        const api = this.popupApi();
        const dnode = setupDnode(connectionStream, api);

        dnode.on('remote', (remote) => {
            console.log(origin);
            console.log(remote)
        })
    }

}