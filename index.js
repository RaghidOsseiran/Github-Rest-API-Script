import express from 'express'
import { Octokit } from 'octokit'
import dotenv from 'dotenv'
import fetch from 'node-fetch'

dotenv.config()

const octokit = new Octokit({ auth: process.env.GITHUB_AUTH_TOKEN });

const app = express()

app.use(express.json()) // lets us parse JSON from the request body



app.get('/modules', async (req, res) => {
    const query = 'module-info.java+language:Java'
    const { data } = await octokit.request('GET /search/commits', {
        accept: 'application/vnd.github.text-match+json',
        q: query
    })
    res.json(data)
    }
)



app.listen(3000, () => {
    console.log('Server is running on port 3000')
}
)