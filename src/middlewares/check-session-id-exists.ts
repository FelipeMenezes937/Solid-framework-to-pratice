import type { FastifyReply, FastifyRequest } from "fastify"


export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply){
    const sessionId = request.cookies.sessionId
    if(!sessionId){// o comportamento padrão de um middleware é: se não fizer nenhum return, segue o baile
        return reply.status(401).send({
            error: 'Unauthorized.',
        })
    }
}