import type { FastifyInstance } from "fastify";
import { randomUUID } from 'node:crypto'
import { db } from "../src/database.js"
import { z } from "zod";
import { request } from "node:https";
let knex = db;

// todo plugin do fastify necessariamente é uma funcao assíncrona
export function transactionsRoutes(app: FastifyInstance){
    
    app.get('/', async() =>{
        const transactions = await knex('transactions').select()

        return {// trabalha como objeto pq é mais simples de adicionar/remover dados
            total: 200,
            transactions,
        }
    })

    app.get('/:id', async () => {
        
    })

    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            // as coisas que eu espero que tenham no objeto que receber(req.body)
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })
        const { title, amount, type } = createTransactionBodySchema.parse(request.body)
        await knex('transactions')
            .insert({
                id: randomUUID(),
                title,
                amount: type == 'credit' ? amount : amount * -1,// mudando tratamento conforme o tipo
            })

        
        return reply.status(201).send()
    })
}

    