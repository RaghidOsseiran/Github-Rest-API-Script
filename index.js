import express from 'express'
import { Octokit } from 'octokit'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const octokit = new Octokit({ auth: process.env.GITHUB_AUTH_TOKEN });

const app = express()

app.use(express.json()) // lets us parse JSON from the request body

app.get('/', (req, res) => {
    res.json('Hello World!')
}
)


app.get('/repos', async (req, res) => {
    const { data } = await octokit.request('GET /user/repos')
    res.json(data)
}
)


app.get('/modules', async (req, res) => {
    const query = 'path:**/module-info.java+language:Java'
    const { data } = await octokit.request('GET /search/code', {
        q: query
    })
    res.json(data)
}
)



app.listen(3000, () => {
    console.log('Server is running on port 3000')
}
)