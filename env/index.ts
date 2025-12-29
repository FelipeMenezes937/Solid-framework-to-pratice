import 'dotenv/config'

import { z } from 'zod'
//zod serve pra validar dados
const envSchema = z.object({
    // ambiente em que o código tá rodando
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),

    DATABASE_URL: z.string(),
    PORT: z.number().default(3333)
})

// pergunta se ele tá do jeito que a schema pede
const _env = envSchema.safeParse(process.env)

if (_env.success == false){
    console.log('invalid enviroment variables! ' + _env.error.format )
    throw new Error('invalid env variables')
}

export const env = _env.data