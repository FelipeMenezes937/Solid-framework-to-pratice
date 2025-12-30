import type { FastifyInstance } from "fastify";
import { db } from "../src/database.js"
let knex = db;

// todo plugin do fastify necessariamente é uma funcao assíncrona
export function transactionsRoutes(app: FastifyInstance){
    app.get('/hello', async () => {
        const transactions = await knex('transactions')
        .where('amount', 1000)
        .select('*')
        
        return transactions
        
    })
}

    