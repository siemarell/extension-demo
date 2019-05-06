import {action, observable, reaction} from 'mobx';
import uuid from 'uuid/v4';
import {signTx} from '@waves/waves-transactions'
import {setupDnode} from "./utils/setupDnode";
import {decrypt, encrypt} from "./utils/cryptoUtils";

export class SignerApp {

    ...

    // public
    getState() {
        return {
            keys: this.store.keys,
            messages: this.store.newMessages,
            initialized: this.store.initialized,
            locked: this.store.locked
        }
    }

    ...

    //
    connectPopup(connectionStream) {
        const api = this.popupApi();
        const dnode = setupDnode(connectionStream, api);

        dnode.once('remote', (remote) => {
            // This reaction will call remote updateState function every time state changes. That way UI will be in sync with background
            const updateStateReaction = reaction(
                () => this.getState(),
                (state) => remote.updateState(state),
                // fireImmediately - calls updateState for the first time. Delay - debounce function
                {fireImmediately: true, delay: 500}
            );
            // Dispose reaction on disconnect
            dnode.once('end', () => updateStateReaction.dispose())

        })
    }

    ...
}