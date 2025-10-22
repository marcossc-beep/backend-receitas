import Fastify from 'fastify';
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
    user: 'local',
    host: 'localhost',
    database: 'receitas',
    password: '12345',
    port: '5432'
})

const server = Fastify()

server.get('/usuarios', async (req, reply) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios')
        reply.status(200).send(resultado.rows)
    } catch (err) {
        reply.status(500).send({ error: err.message })
    }
})

server.put('/usuarios/:id', async (req, reply) => {
    const id = req.params.id;
    const { nome, senha, email, telefone, ativo } = req.body
    try {
        const resultado = await pool.query('update usuarios set nome=$1, senha=$2, email=$3, telefone=$4, ativo=$6 where id=$5 returning *',
            [nome, senha, email, telefone, id, ativo]
        );
        reply.send(resultado.rows[0]);
    } catch (err) {
        reply.status(500).send({ error: err.message })
    }
})

server.delete('/usuarios/:id', async (req, reply) => {
    const id = req.params.id;
    try {
        await pool.query(
            'Delete from usuarios where id=$1',
            [id]
        )
        reply.send({mensagem: "Deu certo!"})
    } catch (err) {
        reply.status(500).send({ error: err.message })
    }
})

server.post('/usuarios', async (req, reply) => {
    const { nome, senha, email, telefone } = req.body;

    try {
        const resultado = await pool.query(
            'INSERT INTO USUARIOS (nome, senha, email, telefone) VALUES ($1, $2, $3, $4) RETURNING *',
            [nome, senha, email, telefone]
        )
        reply.status(200).send(resultado.rows[0])
    } catch (e) {
        reply.status(500).send({ error: e.message })
    }
})


server.get('/categorias', async (req, reply) => {
    try {
        const resultado = await pool.query('SELECT * FROM categorias')
        reply.status(200).send(resultado.rows)
    } catch (err) {
        reply.status(500).send({ error: err.message })
    }
})

server.post('/categorias', async (req, reply) => {
    const { nome } = req.body;

    try {
        const resultado = await pool.query(
            'INSERT INTO CATEGORIAS (nome) VALUES ($1) RETURNING *',
            [nome]
        )
        reply.status(200).send(resultado.rows[0])
    } catch (e) {
        reply.status(500).send({ error: e.message })
    }
})

server.put('/categorias/:id', async (req, reply) => {
    const { nome } = req.body;
    const id = req.params.id;
    try {
        const resultado = await pool.query(
            'UPDATE categorias set nome=$1 where id=$2 returning *',
            [nome, id]
        )
        reply.status(200).send(resultado.rows[0])
    } catch (e) {
        reply.status(500).send({ error: e.message })
    }
})

server.delete('/categorias/:id', async (req, reply) => {
    const id = req.params.id;
    try {
        await pool.query(
            'Delete from categorias where id=$1',
            [id]
        )
        reply.send({mensagem: "Deu certo!"})
    } catch (err) {
        reply.status(500).send({ error: err.message })
    }
})

server.get('/receitas', async (req, reply) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const allowedOrder = ['id', 'nome']
    const sort = allowedOrder.includes(req.query.sort) ? req.query.sort : 'id'
    const order = req.query.order === 'desc' ? "DESC" : "ASC"

    try {
        const resultado = await pool.query(`SELECT * FROM receitas ORDER BY 
            ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`)

        reply.send(resultado.rows)
    } catch (err) {
        reply.status(500).send({ error: err.message })
    }
})

server.post('/receitas', async (req, reply) => {
    const { 
        nome, modo_preparo, ingredientes, usuario_id, 
        categoria_id, porcoes, tempo_preparo_minutos } = req.body;

    try {
        const resultado = await pool.query(
            'INSERT INTO RECEITAS (nome, modo_preparo, ingredientes, porcoes, tempo_preparo_minutos, usuario_id, categoria_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nome, modo_preparo, ingredientes, porcoes, tempo_preparo_minutos, usuario_id, categoria_id ]
        )
        reply.status(200).send(resultado.rows[0])
    } catch (e) {
        reply.status(500).send({ error: e.message })
    }
})


server.listen({
    port: 3000,
    host: '0.0.0.0'
})