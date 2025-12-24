import fastify = require("fastify")

const app = fastify()

app.get('/hello', () => {
    return 'Hello node'
})

app.listen({
        port: 3333,
    }).then( () => {
        console.log(`server taokey, na porta 3333` )
    })