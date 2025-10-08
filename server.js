import Fastify from 'fastify'

const server = Fastify()

server.get('/usuarios', () => {
    return 'Usuarios'
})

server.listen({
    port: 3000,
    host: '0.0.0.0'
})