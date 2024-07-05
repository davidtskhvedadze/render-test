const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://davidtskhvedadze:${password}@david.hnynaog.mongodb.net/Phonebook?retryWrites=true&w=majority&appName=David`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(() => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    console.log(`phonebook:\n${persons.map(p => `${p.name} ${p.number}`).join('\n')}`)
    mongoose.connection.close()
  })
} else {
  console.log('Incorrect number of arguments.')
  mongoose.connection.close()
}


