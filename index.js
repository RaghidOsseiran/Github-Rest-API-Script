import express from 'express';
import {filter_result, buildCodeRequest, fetchContent, fetchRepoContent, initRequest, URL} from './public/utilitaries.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()


const token = process.env.GITHUB_AUTH_TOKEN

const app = express()


app.set('view engine', 'ejs')
app.use(express.static("public"))


app.get('/', (req, res) => {
    res.render("index", {apiKey: token})
})


export async function fetchRepoAuthContent(url){
    const headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${token}`
    }
    const response = await fetch(url, {
        "method": "GET",
        "headers": headers
    })
    if (!response.ok) throw new Error('Error fetching data')
    return await response.json()
}




app.get('/commitdetails*', async (req, res) => {
    const url_info = initRequest(req.url, 5)
    const apiUrl = url_info.replace("commit","commits")
    try{
        const commitDetails = await fetchRepoContent(apiUrl)
        res.send(`
        <div class="commit-container">
            <h1>Commit Details</h1>
            <div class="commit-message">->Message: ${commitDetails.commit.message}</div><br><br>
            <div class="commit-author">->Author: ${commitDetails.commit.author.name} (${commitDetails.commit.author.email})</div><br><br>
            <div class="commit-date">->Date: ${new Date(commitDetails.commit.author.date).toLocaleString()}</div><br><br>
            <h2>Files Changed:</h2>
            ${commitDetails.files.map(file =>  
                `<div class="commit-file">->File: ${file.filename}<br><br>
                Status: ${file.status}<br><br>
                additions: ${file.additions}<br><br>
                deletions: ${file.deletions}<br><br>
                changes: ${file.changes}<br><br>
                Content: <a href="${file.raw_url}">See content</a><br><br></div><br><br>`).join('')}
        <Button> <a href="/">Back to page </a></Button></div>
    `)
    } catch(error){
        console.log('Error')
        res.status(500).send('Internal server error')
    }
})

// https://api.github.com/search/code?q=repo%3ARaghidOsseiran/Test-usage-module+language:Java&type=code
// https://api.github.com/search/code?q=repo%3AJava-fac+language:Java&type=code
// https://api.github.com/search/code?q=repo%3ARaghidOsseiran%2FInit-to-Ocaml+language%3AOCaml&type=code

app.get('/repocontent*', async (req, res) => {
    const url_parts = req.url.split('/')
    const owner = url_parts[6]
    const repo = url_parts[7]
    const url_info = buildCodeRequest(owner, repo)
    let main_div = "<div>"
    try{   
        let repo_content = await fetchRepoAuthContent(url_info)
        repo_content = filter_result(repo_content)
        if (repo_content.total_count == 0){
            res.send("No content currently available using the GitHub Rest API, code might be in index phase, try again later.")
            return
        } else if (repo_content.items.length == 0) {
            res.send("No module-info.java in this repo")
            return
        }
        repo_content.items.forEach(async (i) => {
            const message = `<p>
            <h1>Filename: ${i.name}</h1> 
            File path: ${i.path}<br><br>
            Code URL: <a href="${i.html_url}">Go to Page</a><br><br></p>
            `
            main_div += message + "<br><br>"
        })
        main_div+= "</div>"
        res.send(main_div)
    } catch(error){
        console.log('Error in repoContent')
        res.status(500).send('Internal server error')
    }
})




app.listen(3000)