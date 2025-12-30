import type { FastifyInstance } from "fastify";
import { randomUUID } from 'node:crypto'
import { db } from "../src/database.js"
import { z } from "zod";
let knex = db;

// todo plugin do fastify necessariamente é uma funcao assíncrona
export function transactionsRoutes(app: FastifyInstance){
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
                amount: type == 'credit' ? amount : amount * -1,
            })

        
        return reply.status(201).send()
    })
}

    