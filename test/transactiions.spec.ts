import request from "supertest"
import { afterAll, beforeAll, expect, it, describe } from 'vitest'
import { app } from '../src/app.js';
import { id } from "zod/locales";
import { string } from "zod";

describe('Transactions routes', () => {

    beforeAll(async () => {
        await app.ready()
    })

    afterAll(async () => {
        await app.close()
    })

    it('should be able to create a new transaction', async () => {
        const response = await request(app.server)
        .post('/transactions')
        .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit', 
        })
        .expect(201)// valida automaticamente

        // outro jeito é:
        //     expect(response.statusCode).toEqual(201)
       
    })
    // [REGRA DE QA] se um teste depende de outro, tá fazendo errado
    // temos que fazer partindo do princípio que os outros testes não existem

    it('should be able to list all transactions', async () => {
        const createTransaction = await request(app.server)
        .post('/transactions')
        .send({
                title: 'New Transaction',
                amount: 5000,
                type: 'credit', 
        })
        
        const cookies = createTransaction.get('Set-Cookie')
    

        const listTransactionsReponse = await request(app.server)
        .get('/transactions')
        .set('Cookie', cookies)
        .expect(200)

        expect(listTransactionsReponse.body.transactions).toEqual([
            expect.objectContaining({
                title: 'New Transaction',
                amount: 5000,
            })
        ])
    })
    
})