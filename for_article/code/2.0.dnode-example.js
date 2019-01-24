import Dnode from "dnode/browser";

// В этом примере условимся что клиент удаленно вызывает функции на сервере, хотя ничего нам не мешает сделать это двунаправленным

// Cервер
// API, которое мы хотим предоставить
const dnode = Dnode({
    hello: (cb) => cb(null, "world")
})
// Транспорт, поверх которого будет работать dnode. Любой nodejs стрим. В браузере есть бибилиотека 'readable-stream'
connectionStream.pipe(dnode).pipe(connectionStream)



// Клиент
const dnodeClient = Dnode() // Вызов без агрумента значит что мы не предоставляем API на другой стороне

// Выведет в консоль world
dnodeClient.once('remote', remote => {
    remote.hello(((err, value) => console.log(value)))
})
