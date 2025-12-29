import fastify from "fastify"
// import knex from "knex"
import crypto from 'node:crypto'
import { db } from "./database.js"
import { env } from "../env/index.js"

let knex = db

const app = fastify()

app.get('/hello', async () => {
    const transactions = await knex('transactions')
    .where('amount', 100)
    .select('*')




//  const transactions =  await db('transactions').insert({
//   id: crypto.randomUUID(),
//   title: 'transacao de teste',
//   amount: 1000,
//   created_at: new Date()
// }).returning('*')
console.log('deu certo')
    return transactions
    
})

app.listen({
        port: env.PORT,
    }).then( () => {
        console.log(`server taokey, na porta ${env.PORT}` )
    })