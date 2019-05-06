import {cbToPromise, transformMethods} from "../../src/utils/setupDnode";

const pageApi = await new Promise(resolve => {
    dnode.once('remote', remoteApi => {
        resolve(transformMethods(cbToPromise, remoteApi))
    })
});