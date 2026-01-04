import { env } from '../env/index.js'
import knex from 'knex'
import type { Knex } from 'knex'

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env not found")
}

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_CLIENT === 'sqlite' ? { // o método pra sqlite != pg, tem que colocar uma verificacao
    filename: env.DATABASE_URL,
  } : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const db = knex(config)


