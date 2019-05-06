import {observable, action} from 'mobx';
import {setupDnode} from "./utils/setupDnode";

export class SignerApp {

    constructor(initState = {}) {
        // Externally our store has the same api, but every field has become proxy. Proxies track property access
        this.store =  observable.object({
            keys: initState.keys || [],
        });
    }

    // Methods, mutating observables, decorate with action
    @action
    addKey(key) {
        this.store.keys.push(key)
    }

    @action
    removeKey(index) {
        this.store.keys.splice(index, 1)
    }

    ...

}