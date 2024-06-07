import express from 'express'
import dotenv from 'dotenv'

dotenv.config()


const app = express()

app.set('view engine', 'ejs')
app.use(express.static("public"))


app.get('/', (req, res) => {
    res.render("index", {apiKey: process.env.GITHUB_AUTH_TOKEN})
})


app.get('/repoRequest', (req, res) => {
    res.render("table", {apiKey: process.env.GITHUB_AUTH_TOKEN})
})

app.listen(3000)