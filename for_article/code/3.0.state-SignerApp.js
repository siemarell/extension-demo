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

    ...

}
