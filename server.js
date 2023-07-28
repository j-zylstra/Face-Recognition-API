const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require ('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const portfinder = require('portfinder');



const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    }
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
app.listen(8001, function() {
  console.log("Server is running on port" + 8001);
});