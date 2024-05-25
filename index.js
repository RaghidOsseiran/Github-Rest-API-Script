import express from 'express';
import fetch from 'node-fetch'
const app = express()

app.set('view engine', 'ejs')
app.use(express.static("public"))


app.get('/', (req, res) => {
    res.render("index")
})


async function send_request(URL){
    const headers = {
        "Accept": "application/vnd.github.cloak-preview",
    }
    console.log(URL)
    const response = await fetch(URL, {
        "method": "GET",
        "headers": headers
    })
    const result = await response.json()
    return result
}


async function fetchRawContent(rawURL){
    const response = await fetch(rawURL)
    if (!response.ok){
        throw new Error(`Error fetching file content: ${response.statusText}`)
    }
    return await response.text();
}

function renderDetails(content){
    try{
        res.render('commitdetails', {content})
    } catch(error){
        console.error('Error in rendering')
        res.status(500).send('Internal server error in content')
    }
}


app.get('/commitdetails*', async (req, res) => {
    const url_info = req.url.split("/").slice(5).join('/').replace("commit","commits")
    const apiUrl = `https://api.github.com/repos/${url_info}`
    try{
        const commitDetails = await send_request(apiUrl)
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




app.listen(3000)