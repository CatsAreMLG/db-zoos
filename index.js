const express = require('express')
const helmet = require('helmet')
const knex = require('knex')

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
}
const db = knex(knexConfig)

const server = express()

server.use(express.json())
server.use(helmet())

// endpoints here

//post
server.post('/api/zoos', async (req, res) => {
  if (req.body.name) {
    try {
      const [id] = await db('zoos').insert(req.body)
      const zoo = await db('zoos')
        .where({ id })
        .first()
      res.status(201).json(zoo)
    } catch (e) {
      const message = e[e.errno] || 'We ran into an error'
      res.status(500).json({ message })
    }
  } else {
    res.status(500).json({ message: 'Please provide a name' })
  }
})

//get all
server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos')
    res.status(200).json(zoos)
  } catch (e) {
    res.status(500).json(e)
  }
})

server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zoo = await db('zoos')
      .where({ id: req.params.id })
      .first()
    zoo
      ? res.status(200).json(zoo)
      : res.status(404).json({ error: 'Animal not found' })
  } catch (e) {
    res.status(500).json(e)
  }
})

server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
      .where({ id: req.params.id })
      .del()
    count
      ? res.status(204).end()
      : res.status(404).json({ error: 'Animal not found' })
  } catch (e) {
    res.status(500).json(e)
  }
})

const port = 3300
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`)
})
