const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'jon',
            password:'safe',
            email: 'jon@gmail.com',
            entries: 0,
            joined: new Date()
        },
    
        {
            id: '124',
            name: 'sally',
            password: '999',
            email: 'sally@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
      {
        id:'987',
        has: '',
        email: 'jon@gmail.com'
      }
    ]
}


app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if (
      req.body.email === database.users[0].email &&
      req.body.password === database.users[0].password
    ) {
      res.json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Error logging in' });
    }
  });
  

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        console.log(hash);
    })
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(users => {
        if (users.id === id) {
            found = true;
            return res.json(users);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(users => {
        if (users.id === id) {
            found = true;
            users.entries++
            return res.json(users.entries);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.listen(3001, ()=> {
    console.log('app is running on port 3001');
})

