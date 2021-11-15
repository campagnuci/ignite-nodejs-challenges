const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function verifyIfUserExists (request, response, next) {
  const { username } = request.headers
  const currentUser = users.find( (user) => user.username === username )

  if (!currentUser) {
    return response.status(404).json({ error: 'User not found' })
  }
  request.user = currentUser
  return next()
}

app.post('/users', (request, response) => {
  try {
    const { name, username } = request.body
    if (!name || !username) {
      return response.status(400).json({ error: 'Parameters missing' })
    }
    const userExists = users.some( (user) => user.username === username )
    if (userExists) {
      return response.status(400).json({ error: 'User already exists' })
    }
    const user = {
      id: uuidv4(),
      name,
      username,
      todos: []
    }
    users.push(user)
    return response.status(201).send(user)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Something went wrong' })
  }
});

app.get('/todos', verifyIfUserExists, (request, response) => {
  try {
    const { user } = request
    return response.status(200).json(user.todos)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Something went wrong' })
  }
});

app.post('/todos', verifyIfUserExists, (request, response) => {
  try {
    const { user } = request
    const { title, deadline } = request.body
    if (!title || !deadline) {
      return response.status(400).json({ error: 'Parameters missing' })
    }
    const todo = {
      id: uuidv4(),
      title,
      done: false,
      deadline: new Date(deadline),
      created_at: new Date()
    }
    user.todos.push(todo)
    return response.status(201).send(todo)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Something went wrong' })
  }
});

app.put('/todos/:id', verifyIfUserExists, (request, response) => {
  try {
    const { user } = request
    const { id } = request.params
    const { title, deadline } = request.body
    const todo = user.todos.find( (t) => t.id === id )
    if (!todo) {
      return response.status(404).json({ error: 'Todo does not exist' })
    }
    if (title || deadline) {
      todo.title = title
      todo.deadline = deadline
    }
    return response.status(201).send(todo)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Something went wrong' })
  }
});

app.patch('/todos/:id/done', verifyIfUserExists, (request, response) => {
  try {
    const { user } = request
    const { id } = request.params
    const todo = user.todos.find( (t) => t.id === id )
    if (!todo) {
      return response.status(404).json({ error: 'Todo does not exist' })
    }
    todo.done = true
    return response.status(200).send(todo)
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Something went wrong' })
  }
});

app.delete('/todos/:id', verifyIfUserExists, (request, response) => {
  try {
    const { user } = request
    const { id } = request.params
    const todo = user.todos.find( (t) => t.id === id )
    if (!todo) {
      return response.status(404).json({ error: 'Todo does not exist' })
    }
    user.todos.splice(todo, 1)
    return response.status(204).json()
  } catch (error) {
    console.error(error)
    return response.status(500).json({ error: 'Something went wrong' })
  }
});

module.exports = app;
