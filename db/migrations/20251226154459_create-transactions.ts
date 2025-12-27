import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {// metodo "up especifica oq a migration faz"
    await knex.schema.createTable('transactions', (table) =>{
        table.uuid('id').primary()
        table.text('title').notNullable()
        table.decimal('amount', 10, 2).notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable
    })
}


export async function down(knex: Knex): Promise<void> {// metodo usado para voltar, limpar o banco, fazer um rollback
    await knex.schema.dropTable('transactions')
}

