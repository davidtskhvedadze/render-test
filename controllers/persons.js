const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then((persons) => {
      response.json(persons)
    })
})

personsRouter.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if(!name || !number) {
    return response.status(400).json({ error: 'Name or number is missing' } )
  }

  Person.findOne({ name: name })
    .then(foundPerson => {
      if (foundPerson) {
        return response.status(400).json({ error: 'Name already exists' })
      } else {
        const person = new Person({
          name: name,
          number: number
        })

        person.save()
          .then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => next(error))
      }
    })
})

personsRouter.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

personsRouter.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  Person.findByIdAndUpdate(request.params.id, body, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.status(201).json(updatedPerson)
    })
    .catch(error => next(error))
})

personsRouter.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.get('/info', (request, response, next) => {
  Person.find({})
    .then(persons => {
      const length = persons.length
      const infoContent = `
        <p>Phonebook has info for ${length} people</p>
        <br/>
        <p>${new Date()}</p>
       `
      return response.send(infoContent)
    })
    .catch(error => next(error))
})


module.exports = personsRouter