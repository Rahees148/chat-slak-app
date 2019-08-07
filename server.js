const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require('pusher-chatkit-server')

const app = express()

const chatkit = new Chatkit.default({
  instanceLocator: 'v1:us1:fcd7894c-a727-4d63-94c2-df6d38f01a04',
  key: 'bf47b500-7570-4709-80fb-7cdf26f5d33b:+VI+OVtybwMssuUhYOLHA9blIvuuEQc2NRUs8qZwRfg=',
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/build'));
//create new user
app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => {
      console.log('User created successfully');
    }).catch((err) => {
      console.log(err);
    });
})
//create new Room
app.post('/createTeam', (req, res) => {
  const { username } = req.body
  chatkit.createRoom({
    creatorId: username,
    name: 'my room',
  })
    .then(() => {
      console.log('Room created successfully');
    }).catch((err) => {
      console.log(err);
    });
})

app.post('/authenticate', (req, res) => {
  const authData = chatkit.authenticate({ userId: req.query.user_id })
  res.status(authData.status).send(authData.body)
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, err => {
  if (err) {
    console.error('error-rayees', err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})