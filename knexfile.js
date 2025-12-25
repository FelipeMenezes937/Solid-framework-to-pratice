// import { config } from "./src/database.js"

// export default config

/** @type {import('knex').Knex.Config} */
export default {
  client: 'sqlite3',
  connection: {
    filename: 'sqlite'
  },
  useNullAsDefault: true,
  migrations: {
    directory: 'migrations',
    extension: 'ts', // gambiarra pra gerar a migration já tipada
    directory: './db/migrations',    
  }
}