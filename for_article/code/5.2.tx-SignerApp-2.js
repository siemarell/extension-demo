
export class SignerApp {
    ...

    popupApi() {
        return {
            addKey: async (key) => this.addKey(key),
            removeKey: async (index) => this.removeKey(index),

            lock: async () => this.lock(),
            unlock: async (password) => this.unlock(password),
            initVault: async (password) => this.initVault(password),

            approve: async (id, keyIndex) => this.approve(id, keyIndex),
            reject: async (id) => this.reject(id)
        }
    }

    pageApi(origin) {
        return {
            signTransaction: async (txParams) => this.newMessage(txParams, origin)
        }
    }

    ...

}
