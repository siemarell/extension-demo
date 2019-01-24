import {action, observable, reaction} from 'mobx';
import uuid from 'uuid/v4';
import {signTx} from '@waves/waves-transactions'
import {setupDnode} from "./utils/setupDnode";
import {decrypt, encrypt} from "./utils/cryptoUtils";

export class SignerApp {

    ...

    @action
    newMessage(data, origin) {
        // Для каждого сообщения создаем метаданные с id, статусом, выременем создания и тд.
        const message = observable.object({
            id: uuid(), // Идентификатор, используюю uuid
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