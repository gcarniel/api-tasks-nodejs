import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      console.log(req.query)

      const { search } = req.query

      const searchBy = search ? { title: search, description: search } : null

      const tasks = database.select('tasks', searchBy)

      return res.end(JSON.stringify(tasks))
    },
  },

  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description } = req.body
      const { id } = req.params

      if (!id) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'id is required' }))
      }

      if (!title && !description) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'title or description is required' }))
      }

      const task = {
        id,
        title,
        description,
        updated_at: new Date().getTime(),
      }

      const response = database.update('tasks', id, task)

      if (response.success) {
        return res.writeHead(200).end()
      }

      return res.writeHead(404).end(JSON.stringify(response.error))
    },
  },

  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      if (!id) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'id is required' }))
      }

      const response = database.delete('tasks', id)

      if (response.success) {
        return res.writeHead(204).end()
      }

      return res.writeHead(404).end(JSON.stringify(response.error))
    },
  },

  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      if (!id) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'id is required' }))
      }

      const task = {
        id,
        updated_at: new Date().getTime(),
        completed_at: new Date().getTime(),
      }

      const response = database.complete('tasks', id, task)

      if (response.success) {
        return res.writeHead(200).end()
      }

      return res.writeHead(404).end(JSON.stringify(response.error))
    },
  },

  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'title is required' }))
      }

      if (!description) {
        return res
          .writeHead(404)
          .end(JSON.stringify({ error: 'description is required' }))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    },
  },
]
