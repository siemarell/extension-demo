import {observable, action} from 'mobx';
import {setupDnode} from "./utils/setupDnode";

export class SignerApp {

    constructor(initState = {}) {
        // Внешне store так и останется тем же объектом, только теперь все его поля стали proxy, которые отслеживают доступ к ним
        this.store =  observable.object({
            keys: initState.keys || [],
        });
    }

    // Методы, которые меняют observable принято оборачивать декоратором
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