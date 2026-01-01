import fastify from "fastify"
// import knex from "knex"
import crypto from 'node:crypto'
import cookie from "@fastify/cookie"
import { env } from "../env/index.js"
import { transactionsRoutes } from "../routes/transactions.js"

export const app = fastify()

app.register(cookie)

    // PreHandler executado em todas as rotas do contexto do 
    app.addHook('preHandler', async (request) => {
        console.log(`método: ${request.method} | caminho: ${request.url}`)
    })

app.register(transactionsRoutes, {
    prefix: 'transactions',
})// register seria como um import
