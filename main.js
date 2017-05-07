const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {authenticate} = require('./ad')
const {token} = require('./fb')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))

app.post('/token', authenticate, token, (req, res) => res.send(req.token))

app.listen(process.env.PORT || 3000)
