import fastify from "fastify"
import { db } from "./database.js"

const app = fastify()

app.get('/hello', async () => {
    const tables = await db('sqlite_schema').select('*')// sqlite_schema é uma tabela universal, usada em todo banco sqlite
    return tables
})

app.listen({
        port: 3333,
    }).then( () => {
        console.log(`server taokey, na porta 3333` )
    })