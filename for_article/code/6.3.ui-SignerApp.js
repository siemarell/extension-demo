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
            // Создаем reaction на изменения стейта, который сделает вызовет удаленну процедуру и обновит стейт в ui процессе
            const updateStateReaction = reaction(
                () => this.getState(),
                (state) => remote.updateState(state),
                // Третьим аргументом можно передавать параметры. fireImmediatly значит что reaction выполниться первый раз сразу.
                // Это необходимо, чтобы получить начальное состояние. Delay позволяет установить debounce
                {fireImmediately: true, delay: 500}
            );
            // Удалим подписку при отключении клиента
            dnode.once('end', () => updateStateReaction.dispose())

        })
    }

    ...
}