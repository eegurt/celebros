const express = require('express')
const axios = require('axios')
const ejs = require('ejs')
const format = require('./scripts/format')
const wiki = require('./scripts/wiki')

const app = express()
const PORT = process.env.PORT
const viewDir = __dirname + '/views'

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.render(viewDir + '/main.ejs')
})

app.get('/about', (req, res) => {
  res.render(viewDir + '/about.ejs')
})

app.get('/auth/registration', (req, res) => {
  res.render(viewDir + '/registration.ejs')
})

app.get('/auth/login', (req, res) => {
  res.render(viewDir + '/login.ejs')
})

app.post('/result', (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://celebrity-by-api-ninjas.p.rapidapi.com/v1/celebrity',
    params: { name: `${req.body.dd}` },
    headers: {
      'X-RapidAPI-Host': 'celebrity-by-api-ninjas.p.rapidapi.com',
      'X-RapidAPI-Key': 'ed04e19701msh5b1ef1bad158febp1ac3f0jsn08bb7653a75c'
    }
  }

  axios
    .request(options)
    .then(function (response) {
      const name = response.data[0].name
      const age = response.data[0].age
      const birthdy = response.data[0].birthdy
      const gender = response.data[0].gender
      const occupation = response.data[0].occupation

      async function getWikiOutput() {
        const wikiOutput = await wiki.fetchWikiExtract(name)
        console.log(wikiOutput)
      }
      // getWikiOutput()

      res.render(viewDir + '/result.ejs', {
        name: name,
        age: age,
        birthdy: birthdy,
        gender: gender,
        occupation: occupation,
        format: format
      })
    })
    .catch(function (error) {
      console.error(error)
    })
})

app.use(express.static(__dirname + '/public/styles'))

// app.listen(port, () => {
//   console.log(`Example app listening on port http://localhost:${port}`);
// });

app.listen(PORT || 3000, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`)
})

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
mongoose.connect(
  'mongodb+srv://adilkhan-back:Aitu2003@cluster0.dfuz8.mongodb.net/backend-db?retryWrites=true&w=majority'
)

const authRouter = require('./auth-router')
app.use('/auth', authRouter)
const RegRoute = require('./auth-router')
const { json } = require('express/lib/response')
app.use('/', RegRoute)
const notesSchema = {
  username: String,
  password: String
}
