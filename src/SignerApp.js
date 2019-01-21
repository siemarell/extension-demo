import {observable, action} from 'mobx';
import {setupDnode} from "./utils/setupDnode";
import {encrypt, decrypt} from "./utils/cryptoUtils";

export class SignerApp {

    constructor(initState = {}) {
        this.store = observable.object({
            password: null,
            vault: initState.vault,
            messages: initState.messages || [],

            //Computed properties. Можно провести аналогию с view в бд
            get locked(){
                return this.password == null
            },
            get keys(){
                return this.locked ?
                    undefined :
                    SignerApp._decryptVault(this.vault, this.password)
            },
            get initialized(){
                return this.vault !== undefined
            }
        })
    }


    // actions

    @action
    initVault(password){
        this.store.vault = SignerApp._encryptVault([], password)
    }
    @action
    lock() {
        this.store.password = null
    }

    @action
    unlock(password) {
        this._checkPassword(password);
        this.store.password = password
    }

    @action
    addKey(key) {
        this._checkLocked();
        this.store.vault = SignerApp._encryptVault(this.store.keys.concat(key), this.store.password)
    }

    @action
    removeKey(index) {
        this._checkLocked();
        this.store.vault = SignerApp._encryptVault([
            ...this.store.keys.slice(0, index),
            ...this.store.keys.slice(index + 1)
            ],
            this.store.password
        )
    }

    // public
    popupApi() {
        return {
            addKey: async (key) => this.addKey(key),
            removeKey: async (index) => this.removeKey(index),
            lock: async  () => this.lock(),
            unlock: async (password) => this.unlock(password),
            initVault: async (password) => this.initVault(password)
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

    // private
    _checkPassword(password) {
        SignerApp._decryptVault(this.store.vault, password);
    }

    _checkLocked() {
        if (this.store.locked){
            throw new Error('App is locked')
        }
    }

    static _encryptVault(obj, pass){
        const jsonString = JSON.stringify(obj)
        return encrypt(jsonString, pass)
    }
    static _decryptVault(str, pass){
        if (str === undefined){
            throw new Error('Vault not initialized')
        }
        try {
            const jsonString = decrypt(str, pass)
            return JSON.parse(jsonString)
        }catch (e) {
            throw new Error('Wrong password')
        }
    }
}