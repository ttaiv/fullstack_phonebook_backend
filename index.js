const express = require('express')
const app = express()
app.use(express.json())

const morgan = require('morgan')
app.use(morgan('tiny'))

const cors = require('cors')
app.use(cors())

let persons = [
    {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
    },
    {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
    },
    {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
    },
    {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
    }
]

const generateId = () => Math.floor(Math.random() * 500)

app.get('/api/persons', (req, res) => {
    res.json(persons)
})
app.get('/info', (req, res) => {
    res.send(`
        <div>
            <p> Phonebook has info for ${persons.length} people. </p>
            <p> ${new Date()} </p>
        </div>`
    )
})
app.get('/api/persons/:id', (req, res) => {
    const wanted_id = Number(req.params.id);
    const person = persons.find(person => person.id === wanted_id);
    if (person)
        res.json(person)
    else
        res.status(404).end()
})
app.delete('/api/persons/:id', (req, res) => {
    const id_toDelete = Number(req.params.id)
    const index_toDelete = persons.findIndex(person => person.id === id_toDelete)
    if (index_toDelete === -1)
        res.status(404).end()
    else {
        persons.splice(index_toDelete, 1)
        res.status(204).end()
    }
})
app.post('/api/persons/', (req, res) => {
    const name = req.body.name
    const number = req.body.number
    if (!name || !number)
        res.status(400).json({error: 'Name or number missing.'})
    else if (persons.some(person => person.name === name))
        res.status(400).json({error: `${name} is already in the phonebook.`})
    else {
        const newPerson = {name, number, id: generateId()}
        persons = persons.concat(newPerson)
        res.json(newPerson)
    }
})
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})