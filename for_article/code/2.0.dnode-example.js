import Dnode from "dnode/browser";

// For the sake of simplicity only client calls remote functions on server. Nothing forbids us from making bidirectional rpc connection

// Server
// API. Simple hello function
const dnode = Dnode({
    hello: (cb) => cb(null, "world")
})
// Transport stream for dnode.Could be any nodeJs stream. For browsers we use 'readable-stream' library, which implements nodejs streams
connectionStream.pipe(dnode).pipe(connectionStream)



// Client
const dnodeClient = Dnode() // Create empty dnode, without remote api

// On connect call remote function and log it output
dnodeClient.once('remote', remote => {
    remote.hello(((err, value) => console.log(value)))
})
