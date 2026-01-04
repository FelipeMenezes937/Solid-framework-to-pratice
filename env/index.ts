import { config } from 'dotenv'

import { z } from 'zod'

if (process.env.NODE_ENV == 'test'){
    config({path: '.env.test'})
}else{
    config({path: '.env'})
}


//zod serve pra validar dados
const envSchema = z.object({
    // ambiente em que o código tá rodando
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
    DATABASE_URL: z.string(),
    PORT: z.coerce.number().default(3333) // coerce converte oq for recebido 
})

// pergunta se ele tá do jeito que a schema pede
const _env = envSchema.safeParse(process.env)

if (_env.success == false){
    console.log('invalid enviroment variables! ' + _env.error.format )
    throw new Error('invalid env variables')
}

export const env = _env.data