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
app.use(express.static(__dirname + '/build'))

//create new user
app.post('/users', (req, res) => {
  const { username } = req.body
  chatkit
    .createUser({
      id: username,
      name: username
    })
    .then(() => res.sendStatus(201))
    .catch(error => {
      if (error.error_type === 'services/chatkit/user_already_exists') {
        res.sendStatus(200)
      } else {
        res.status(error.status).json(error)
      }
    })
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

// Default port 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
