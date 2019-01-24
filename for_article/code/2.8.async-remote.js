import {cbToPromise, transformMethods} from "../../src/utils/setupDnode";

const pageApi = await new Promise(resolve => {
    dnode.once('remote', remoteApi => {
        // С помощью утилит меняем все callback на promise
        resolve(transformMethods(cbToPromise, remoteApi))
    })
});