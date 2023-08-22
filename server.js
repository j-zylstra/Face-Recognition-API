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
    host: "ec2-52-0-187-246.compute-1.amazonaws.com",
    PORT: 5432,
    user: "tuuhhdkwmgiqdy",
    password: "6de02f7db7c653d805f9b7ebff4408bae73d1d57eefa31aff4e0747f8b8c4fc3",
    database: "d1qhioh20f58mo",
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors({origin: "https://vast-caverns-20756-f8729b26975b.herokuapp.com"}));


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