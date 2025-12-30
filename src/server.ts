import fastify from "fastify"
// import knex from "knex"
import crypto from 'node:crypto'
import { env } from "../env/index.js"
import { transactionsRoutes } from "../routes/transactions.js"



const app = fastify()

app.register(transactionsRoutes)// register seria como um import

app.listen({
        port: env.PORT,
    }).then( () => {
        console.log(`server taokey, na porta ${env.PORT}` )
    })