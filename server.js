const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require ('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
//const portfinder = require('portfinder');
const port = process.env.PORT || 3001;
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB,
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
      "Access-Control-Allow-Methods",
      "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.get('/', (req, res) => { res.send('it is working') })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfile(db))
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})


// async function startServer() {
//   portfinder.getPortPromise()
//     .then(port => {
//       console.log(`Using port: ${port}`);
  
//     })
//     .catch(err => {
//       console.error('Error finding an available port:', err);
//     });
// }

//startServer();
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});