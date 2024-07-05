require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static('dist'))
app.use(cors());
app.use(express.json());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
];

const length = phonebook.length;

app.get('/api/persons', (request, response) => {
    return response.status(200).json(phonebook);
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'The name or number is missing' });
    }
  
    const exists = phonebook.some(p => p.name === body.name);
    if (exists) {
      return response.status(400).json({ error: 'Name must be unique' });
    }
  
    const uniqueId = Date.now() + Math.floor(Math.random() * 10000);

    const person = {
      id: uniqueId.toString(),
      name: body.name,
      number: body.number
    };
  
    phonebook.push(person);
  
    return response.status(200).json(person);
})

app.get('/api/persons/:id', (request, response) => {
    const ID = request.params.id;
    const person = phonebook.find(p => p.id === ID);

    if(person) {
       return response.send(person);
    } else {
        return response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const ID = request.params.id;
    const person = phonebook.find(p => p.id === ID);

    if(person) {
        phonebook = phonebook.filter(p => p.id !== person.id);
        return  response.status(204).end();
     } else {
         return response.status(404).end();
     }
});

app.get('/info', (request, response) => {
   const infoContent = `
    <p>Phonebook has infor for ${length} people</p>
    <br/>
    <p>${new Date()}</p>
   `;
   return response.send(infoContent);
});




app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
})