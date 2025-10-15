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

server.delete('/usuarios/:id', async (req, reply) => {
    const id = req.params.id
    try {
        await pool.query('DELETE FROM USUARIOS WHERE id=$1', [id])
        reply.send({message: 'Usuario Deletado!'})
    } catch (err) {
        reply.status(500).send({ error: err.message })
    }
})

server.put('/usuarios/:id', async (req, reply) => {
    const { nome, senha, email, telefone } = req.body;
    const id = req.params.id;

    try {
        const resultado = await pool.query(
            'UPDATE USUARIOS SET nome=$1, senha=$2, email=$3, telefone=$4 where id=$5 Returning *',
            [nome, senha, email, telefone, id]
        )
        reply.status(200).send(resultado.rows[0])
    } catch (e) {
        reply.status(500).send({ error: e.message })
    }
})


// Categorias

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
            'UPDATE categorias SET nome=$1 where id=$2 Returning *',
            [nome, id]
        )
        reply.status(200).send(resultado.rows[0])
    } catch (e) {
        reply.status(500).send({ error: e.message })
    }
})

server.delete('/categorias/:id', async (req, reply) => {
    const id = req.params.id
    try {
        await pool.query('DELETE FROM categorias WHERE id=$1', [id])
        reply.send({message: 'Usuario Deletado!'})
    } catch (err) {
        reply.status(500).send({ error: err.message })
    }
})

server.listen({
    port: 3000,
    host: '0.0.0.0'
})