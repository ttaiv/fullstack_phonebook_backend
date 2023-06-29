const mongoose = require('mongoose')

const setConnection = () => {
    const password = process.argv[2]
    const url = `mongodb+srv://ttaiv:${password}@chulligan.bmyeuzo.mongodb.net/phonebookApp?retryWrites=true&w=majority`
    mongoose.set('strictQuery', false)
    mongoose.connect(url)
}
const constructModel = () => {
    const personSchema = new mongoose.Schema({
        name: String,
        number: String
    })
    const Contact = mongoose.model('Contact', personSchema)
    return Contact
}

const argsCount = process.argv.length
if (argsCount === 5) {
    setConnection()
    const Contact = constructModel()
    const name = process.argv[3]
    const number = process.argv[4]
    const newContact = new Contact({name, number})
    newContact.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
else if (argsCount == 3)  {
    setConnection()
    const Contact = constructModel()
    console.log('Phonebook:')
    Contact.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
else
    console.log('Wrong number of arguments')



