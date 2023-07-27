const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require ('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
//const Clarifai = require("Clarifai");
const db = knex({
    client: 'pg',
    connection: {
      host : 'postgresql-elliptical-45204',
      user : 'postgres',
      password : 'password123',
      database : 'smart-brain'
    }
  });

  
const app = express();


app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => { res.send('it is working') })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfile(db))
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

 


app.listen(process.env.PORT || 3001, ()=> {
    console.log('app is running on port ${process.env.PORT}');
})

