import {action, observable, reaction} from 'mobx';
import uuid from 'uuid/v4';
import {signTx} from '@waves/waves-transactions'
import {setupDnode} from "./utils/setupDnode";
import {decrypt, encrypt} from "./utils/cryptoUtils";

export class SignerApp {

    constructor(initState = {}) {
        this.store = observable.object({
            password: null,
            vault: initState.vault,
            messages: [],

            //Computed properties. Можно провести аналогию с view в бд
            get locked() {
                return this.password == null
            },
            get keys() {
                if (this.locked) {
                   return []
                }
                return SignerApp._decryptVault(this.vault, this.password)
            },
            get initialized() {
                return this.vault != null
            },
            get newMessages(){
                return this.messages.filter(msg => msg.status === 'new')
            }
        })

    }

    // actions

    @action
    initVault(password) {
        this.store.vault = SignerApp._encryptVault([], password)
        this.store.password = password
    }

    @action
    deleteVault(){
        this.store.vault = null
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
        this._checkLocked()
        this.store.vault = SignerApp._encryptVault(this.store.keys.concat(key), this.store.password)
    }

    @action
    removeKey(index) {
        this._checkLocked()
        this.store.vault = SignerApp._encryptVault([
                ...this.store.keys.slice(0, index),
                ...this.store.keys.slice(index + 1)
            ],
            this.store.password
        )
    }

    @action
    newMessage(data, origin) {
        // Для каждого сообщения создаем метаданные с id, статусом, выременем создания и тд.
        const message = observable.object({
            id: uuid(), //Идентификатор, используюю uuid, но подошел бы и число с автоинкрементом
            origin, // Origin будем впоследствии показывать в интерфейсе
            data, //
            status: 'new', // Статусов будет четыре: new, signed, rejected и failed
            timestamp: Date.now()
        });
        console.log(`new message: ${JSON.stringify(message, null, 2)}`);

        this.store.messages.push(message);

        // Возвращаем промис внутри которого mobx мониторит изменения сообщения. Как только статус поменяется мы зарезолвим его
        return new Promise((resolve, reject) => {
            reaction(
                () => message.status, //Будем обсервить статус сообщеня
                (status, reaction) => { // второй аргумент это ссылка на сам reaction, чтобы его можно было уничтожть внутри вызова
                    switch (status) {
                        case 'signed':
                            resolve(message.data);
                            break;
                        case 'rejected':
                            reject(new Error('User rejected message'));
                            break;
                        case 'failed':
                            reject(new Error(message.err.message));
                            break;
                        default:
                            return
                    }
                    reaction.dispose()
                }
            )
        })
    }

    @action
    approve(id, keyIndex = 0) {
        this._checkLocked();
        const message = this.store.messages.find(msg => msg.id === id);
        if (message == null) throw new Error(`No msg with id:${id}`);
        try {
            message.data = signTx(message.data, this.store.keys[keyIndex]);
            message.status = 'signed'
        } catch (e) {
            message.err = {
                stack: e.stack,
                message: e.message
            };
            message.status = 'failed'
            throw e
        }
    }

    @action
    reject(id) {
        const message = this.store.messages.find(msg => msg.id === id);
        if (message == null) throw new Error(`No msg with id:${id}`);
        message.status = 'rejected'
    }

    // public
    getState() {
        return {
            keys: this.store.keys,
            messages: this.store.newMessages,
            initialized: this.store.initialized,
            locked: this.store.locked
        }
    }

    popupApi() {
        return {
            addKey: async (key) => this.addKey(key),
            removeKey: async (index) => this.removeKey(index),

            lock: async () => this.lock(),
            unlock: async (password) => this.unlock(password),

            initVault: async (password) => this.initVault(password),
            deleteVault: async () => this.deleteVault(),

            approve: async (id, keyIndex) => this.approve(id, keyIndex),
            reject: async (id) => this.reject(id)
        }
    }

    pageApi(origin) {
        return {
            signTransaction: async (txParams) => this.newMessage(txParams, origin)
        }
    }

    //
    connectPopup(connectionStream) {
        const api = this.popupApi();
        const dnode = setupDnode(connectionStream, api);

        dnode.once('remote', (remote) => {
            // Создаем reaction на изменения стейта, который сделает RPC вызов к UI и обновит стейт
            const updateStateReaction = reaction(
                () => this.getState(),
                (state) => remote.updateState(state),
                // Третьим аргументом можно передавать параметры. fireImmediatly значит что reaction выполниться первый раз сразу.
                // Это необходимо, чтобы получить начальное состояние. Delay позволяет установить debounce
                {fireImmediately: true, delay: 500}
            );
            dnode.once('end', () => updateStateReaction.dispose())

        })
    }

    connectPage(connectionStream, origin) {
        const api = this.pageApi(origin);
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

    _checkLocked(){
        if (this.store.locked) {
            throw new Error('App is locked')
        }
    }

    static _encryptVault(obj, pass) {
        const jsonString = JSON.stringify(obj)
        return encrypt(jsonString, pass)
    }

    static _decryptVault(str, pass) {
        if (str === undefined) {
            throw new Error('Vault not initialized')
        }
        try {
            const jsonString = decrypt(str, pass)
            return JSON.parse(jsonString)
        } catch (e) {
            throw new Error('Wrong password')
        }
    }
}