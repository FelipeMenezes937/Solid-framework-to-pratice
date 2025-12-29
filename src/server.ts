import fastify from "fastify"
// import knex from "knex"
import crypto from 'node:crypto'
import { db } from "./database.js"


const app = fastify()

app.get('/hello', async () => {

 const transactions =  await db('transactions').insert({
  id: crypto.randomUUID(),
  title: 'transacao de teste',
  amount: 1000,
  created_at: new Date()
})
console.log('deu certo')
    return transactions
    
})

app.listen({
        port: 3333,
    }).then( () => {
        console.log(`server taokey, na porta 3333` )
    })