import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import path from 'node:path'

const database = new Database()

export const routes = [
 {

    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req,res) => {
        const { title,description } = req.query
      let filters = null

      if (title || description) {
        filters = {}

        if (title) {
          filters.title = title
        }

        if (description) {
          filters.description = description
        }
      }
      // const tasks = database.select('tasks', search? {
      //   title : search, 
      //   description : search
      // }: null)
      const tasks = database.select('tasks', filters)

      return res.end(JSON.stringify(tasks))
    }
 },
 {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req,res) => {
        const {title,description} = req.body 
    const dateNow = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo"
    });
        const task = {

          id: randomUUID(), 
          title,
          description,
          created_at: dateNow,
          updated_at: dateNow,
          completed_at: null

        }
        
        database.insert('tasks', task)

        return res.writeHead(201).end()

    }
 },
 {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) => {
        const { id } = req.params
        const { title,description } = req.body
        const dateNow = new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo"
        });
        if(database.select('tasks',{id}).length === 0){
          return res.writeHead(404).end(
            JSON.stringify({message: 'Task not found!'})
          )
        } 
        else {

          database.update('tasks', id, {
              title,
              description,
              updated_at: dateNow
            })
      }
        return res.writeHead(204).end()
    }
 },
 {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req,res) => {
        const { id } = req.params
        const dateNow = new Date().toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo"
        });
        if(database.select('tasks',{id}).length === 0){
          return res.writeHead(404).end(
            JSON.stringify({message: 'Task not found!'})
          )
        }
        else {

          const task = database.select('tasks',{id})[0]
          const isTaskCompleted = !!task.completed_at

          database.update('tasks', id, {
              ...task,
              completed_at: isTaskCompleted ? null : dateNow
            })
        }
        return res.writeHead(204).end()
    }
 },
 {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) => {
        const { id } = req.params

        if(database.select('tasks',{id}).length === 0){
          return res.writeHead(404).end(
            JSON.stringify({message: 'Task not found!'})
          )
        } else {

           database.delete('tasks', id)
        }

        return res.writeHead(204).end()
    }
    
 }
]