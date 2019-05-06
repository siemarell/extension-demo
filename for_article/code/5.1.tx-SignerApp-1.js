import {action, observable, reaction} from 'mobx';
import uuid from 'uuid/v4';
import {signTx} from '@waves/waves-transactions'
import {setupDnode} from "./utils/setupDnode";
import {decrypt, encrypt} from "./utils/cryptoUtils";

export class SignerApp {

    ...

    @action
    newMessage(data, origin) {
        // For every new message we create observable object with id, status, creation timestamp etc.
        const message = observable.object({
            id: uuid(), //I use uuid as id
            origin, // Message origin will be shown in interface later
            data, //
            status: 'new', // Four statuses: new, signed, rejected и failed
            timestamp: Date.now()
        });
        console.log(`new message: ${JSON.stringify(message, null, 2)}`);

        this.store.messages.push(message);

        // This promise will be resolved when status is changed
        return new Promise((resolve, reject) => {
            reaction(// Create mobX reaction
                () => message.status, // which observes message status and invokes callback function when status is changed
                (status, reaction) => { // we pass second argument to cb function. It is a reference to reaction itself, so we can safely dispose it
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

    ...
}