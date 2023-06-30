const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

// Middlewares
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan('tiny'))

// Database connection
require('dotenv').config()
const Contact = require('./models/contact')

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') 
        return response.status(400).send({ error: 'malformatted id' })

    next(error)
}
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

// Routes
app.get('/api/persons', (req, res) => {
    Contact.find({}).then(persons =>
        res.json(persons)
    )
})

app.get('/info', (req, res) => {
    Contact.count({}).then(result => 
    res.send(`
        <div>
            <p> Phonebook has info for ${result} people. </p>
            <p> ${new Date()} </p>
        </div>`
    ))
})

app.get('/api/persons/:id', (req, res, next) => {
    const wanted_id = req.params.id
    Contact.findById(wanted_id)
        .then(person => res.json(person))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id_toDelete = req.params.id
    Contact.findByIdAndDelete(id_toDelete)
        .then(result => res.status(204).end())
        .catch(error => next(error))
})

app.post('/api/persons/', (req, res) => {
    const name = req.body.name
    const number = req.body.number
    if (!name || !number)
        return res.status(400).json({error: 'Name or number missing.'})

    const existingPersons = Contact.find({})
    existingPersons.then(persons => {
        if (persons.some(person => person.name === name))
            res.status(400).json({error: `${name} is already in the phonebook.`})
        else {
            const newContact = new Contact({name, number})
            newContact.save().then(result => {
                console.log(`added ${name} number ${number} to phonebook`)
                res.json(newContact)
            })
        }
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const id_toModify = req.params.id
    const newPerson = {
        name: req.body.name,
        number: req.body.number
    }
    Contact.findByIdAndUpdate(id_toModify, newPerson, { new: true })
        .then(updatedPerson => res.json(updatedPerson))
        .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})