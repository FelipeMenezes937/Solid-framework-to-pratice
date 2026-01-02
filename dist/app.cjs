"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"), 1);
var import_node_crypto2 = require("crypto");
var import_cookie = __toESM(require("@fastify/cookie"), 1);

// env/index.js
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV == "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)({ path: ".env" });
}
var envSchema = import_zod.z.object({
  // ambiente em que o código tá rodando
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success == false) {
  console.log("invalid enviroment variables! " + _env.error.format);
  throw new Error("invalid env variables");
}
var env = _env.data;

// routes/transactions.js
var import_node_crypto = require("crypto");

// src/database.ts
var import_knex = __toESM(require("knex"), 1);
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL env not found");
}
var config2 = {
  client: "sqlite",
  connection: {
    filename: env.DATABASE_URL
  },
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  }
};
var db = (0, import_knex.default)(config2);

// routes/transactions.js
var import_zod2 = require("zod");
var import_node_https = require("https");
var import_node_console = require("console");

// src/middlewares/check-session-id-exists.ts
async function checkSessionIdExists(request2, reply) {
  const sessionId = request2.cookies.sessionId;
  if (!sessionId) {
    return reply.status(401).send({
      error: "Unauthorized."
    });
  }
}

// routes/transactions.js
var knex2 = db;
function transactionsRoutes(app2) {
  app2.get("/", {
    preHandler: [checkSessionIdExists]
    // colocando o midleware de verificacao antes da execucao da rota, no PreHandler
  }, async (request2, reply) => {
    const { sessionId } = request2.cookies;
    const transactions = await knex2("transactions").where("session_id", sessionId).select();
    return {
      total: 200,
      transactions
    };
  });
  app2.get("/summary", {
    preHandler: [checkSessionIdExists]
  }, async (request2) => {
    const { sessionId } = request2.cookies;
    const summary = await knex2("transactions").where("session_id", sessionId).sum("amount", { as: "amount" }).first();
    return { summary };
  });
  app2.get("/:id", {
    preHandler: [checkSessionIdExists]
  }, async (request2) => {
    const getTransactionsParamSchema = import_zod2.z.object({
      id: import_zod2.z.uuid()
    });
    const { id } = getTransactionsParamSchema.parse(request2.params);
    const { sessionId } = request2.cookies;
    const transaction = await knex2("transactions").where({
      session_id: sessionId,
      id
      // nome da chave do banco = varname, não precisei colocar 2 vezes
    }).first();
    return { transaction };
  });
  app2.post("/", async (request2, reply) => {
    const createTransactionBodySchema = import_zod2.z.object({
      // as coisas que eu espero que tenham no objeto que receber(req.body)
      title: import_zod2.z.string(),
      amount: import_zod2.z.number(),
      type: import_zod2.z.enum(["credit", "debit"])
    });
    const { title, amount, type } = createTransactionBodySchema.parse(request2.body);
    let sessionId = request2.cookies.sessionId;
    if (!sessionId) {
      sessionId = (0, import_node_crypto.randomUUID)();
      reply.cookie("sessionId", sessionId, {
        path: "/",
        //se eu coloco só "/" qualquer rota acessa esse cookie
        maxAge: 60 * 60 * 24 * 7
        // 7 days
      });
    }
    await knex2("transactions").insert({
      id: (0, import_node_crypto.randomUUID)(),
      title,
      amount: type == "credit" ? amount : amount * -1,
      // mudando tratamento conforme o tipo
      session_id: sessionId
    });
    return reply.status(201).send();
  });
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.addHook("preHandler", async (request2) => {
  console.log(`m\xE9todo: ${request2.method} | caminho: ${request2.url}`);
});
app.register(transactionsRoutes, {
  prefix: "transactions"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
