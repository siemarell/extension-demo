import Dnode from 'dnode/browser';

export class SignerApp {

    // Возвращает объект API для ui
    popupApi(){
        return {
            hello: cb => cb(null, 'world')
        }
    }

    // Возвращает объет API для страницы
    pageApi(){
        return {
            hello: cb => cb(null, 'world')
        }
    }

    // Подключает popup ui
    connectPopup(connectionStream){
        const api = this.popupApi();
        const dnode = Dnode(api);

        connectionStream.pipe(dnode).pipe(connectionStream);

        dnode.on('remote', (remote) => {
            console.log(remote)
        })
    }

    // Подключает страницу
    connectPage(connectionStream, origin){
        const api = this.popupApi();
        const dnode = Dnode(api);

        connectionStream.pipe(dnode).pipe(connectionStream);

        dnode.on('remote', (remote) => {
            console.log(origin);
            console.log(remote)
        })
    }

}