import type { FastifyInstance } from "fastify";
import { randomUUID } from 'node:crypto'
import { db } from "../src/database.js"
import { z } from "zod";
import { request } from "node:https";
import { error } from "node:console";
import { checkSessionIdExists } from "../src/middlewares/check-session-id-exists.js";
let knex = db; 

// todo plugin do fastify necessariamente é uma funcao assíncrona
export function transactionsRoutes(app: FastifyInstance){
    




    app.get('/', {
        preHandler: [checkSessionIdExists],// colocando o midleware de verificacao antes da execucao da rota, no PreHandler
    },async(request, reply) =>{
        const { sessionId } = request.cookies


        const transactions = await knex('transactions').where('session_id', sessionId).select()

        return {// trabalha como objeto pq é mais simples de adicionar/remover dados
            total: 200,
            transactions,
        }
    })

    app.get('/summary', {
        preHandler: [checkSessionIdExists],
    },async (request) => {
        
        const { sessionId } = request.cookies
        const summary = await knex('transactions')
        .where("session_id", sessionId)
        .sum('amount', { as: 'amount'}).first()
        return {summary}
    })

    app.get('/:id', {
        preHandler: [checkSessionIdExists],
    },async (request) => {
        const getTransactionsParamSchema = z.object({
            id: z.uuid()
        })
        const { id } = getTransactionsParamSchema.parse(request.params)
        const { sessionId } = request.cookies

        const transaction = await knex('transactions')
        .where({
            session_id: sessionId,
            id, // nome da chave do banco = varname, não precisei colocar 2 vezes
        })
        .first()

        return { transaction }
    })

    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            // as coisas que eu espero que tenham no objeto que receber(req.body)
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })
        const { title, amount, type } = createTransactionBodySchema.parse(request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId){
            sessionId = randomUUID()
            reply.cookie('sessionId', sessionId, {
                path: '/', //se eu coloco só "/" qualquer rota acessa esse cookie
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
        }
        await knex('transactions')
            .insert({
                id: randomUUID(),
                title,
                amount: type == 'credit' ? amount : amount * -1,// mudando tratamento conforme o tipo
                session_id: sessionId
            })

        
        return reply.status(201).send()
    })
}

    