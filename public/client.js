import {fetchContent, fetchRepoContent, buildCommitsRequest, isImportantCommit, split_And_Correct, construct_paths, buildRepoRequest, initRequest, URL, buildIssueRequest, isImportantIssue} from './utilitaries.js'




const buttonRequest = document.getElementById("item-in-URL")
buttonRequest.addEventListener("click", () => sendRequest())

const requestTypes = ["Commits", "Repositories", "Issues"]
const toCall = [sendCommitsRequest, sendRepoRequest, sendIssuesRequest]

const info_text = document.getElementById("info-div");

const apiKey = document.getElementById("apiKey")

function sendRequest(){
    const reqType = document.getElementById("search-input")
    if (reqType == null){
        console.log("no value in search input")
        return 
    }
    for(let i = 0; i < requestTypes.length; i++){
        if (requestTypes[i] == reqType.value){
            const username = document.getElementById("url-input")
            toCall[i](username.value)
            return
        }
    }
    console.log("invalid request")
}


async function sendCommitsRequest(username){
    clear();
    const new_url = buildCommitsRequest(username)
    const result = await fetchRepoContent(new_url)
    result.items.forEach(i => {
        if (isImportantCommit(i.commit)){
            const message = document.createElement("p")
            message.innerHTML = `Commit URL: <a href=${i.html_url}>${i.html_url}</a><br><br>
                                <Button><a href="/commitdetails/${i.html_url}">See commit details</a></button><br><br>
                                 Commit Message: ${i.commit.message}<br><br>
                                 Date: ${i.commit.author.date}<br><br>
                                 Repository URL: <a href=${i.repository.html_url}>${i.repository.html_url}</a><br><br>`
            info_text.appendChild(message)
            info_text.appendChild(document.createElement("br"))
        }
    })
    return
}




async function fetchRepoAuthContent(url){
    const headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${apiKey.innerHTML}`
    }
    const response = await fetch(url, {
        "method": "GET",
        "headers": headers
    })
    if (!response.ok) throw new Error('Error fetching data')
    return await response.json()
}



// async function sendRepoRequest(username){
//     clear();
//     const new_url = buildRepoRequest(username)
//     const result = await fetchRepoAuthContent(new_url)
//     result.items.forEach(async (i) => {
//         if (isImportantIssue(i.name)){
//             console.log("is Important")
//             const message = document.createElement("p")
//             message.innerHTML = `
//             <h1>Repository: ${i.repository.name}</h1> 
//             Repo description: ${i.repository.description}<br><br>
//             Repo URL: <a href="${i.repository.html_url}">Go to Page</a><br><br>
//             Content URL: <Button><a href="/repocontent/${i.html_url}">Go to Page</a></Button><br><br>
//             Created at: ${i.created_at}<br><br>
//             Last updated at: ${i.updated_at}<br><br>
//             `
//             info_text.appendChild(message)
//             info_text.appendChild(document.createElement("br"))
//         }
//         // const up_url = split_And_Correct(i.contents_url)
//     })
//     return
// }



async function sendRepoRequest(username){
    clear();
    const new_url = buildRepoRequest(username)
    const result = await fetchRepoContent(new_url)
    result.items.forEach(async (i) => {


        const up_url = split_And_Correct(i.contents_url)
        const message = document.createElement("p")
        message.innerHTML = `
        <h1>Repository: ${i.name}</h1> 
        Repo description: ${i.description}<br><br>
        Repo URL: <a href="${i.html_url}">Go to Page</a><br><br>
        Content URL: <Button><a href="/repocontent/${up_url}">Go to Page</a></Button><br><br>
        Number of issues linked to repo: ${i.open_issues_count}<br><br>
        Created at: ${i.created_at}<br><br>
        Last updated at: ${i.updated_at}<br><br>
        `
        info_text.appendChild(message)
        info_text.appendChild(document.createElement("br"))
    })
    return
}


async function sendIssuesRequest(username){
    clear()
    const new_url = buildIssueRequest(username)
    const result = await fetchRepoContent(new_url)
    result.items.forEach(async (i) => {
        if(isImportantIssue(i.body)){
            const message = document.createElement("p")
            message.innerHTML = `
            <h1>Issue number ${i.number}</h1><br><br>
            <h1>Title: ${i.title}</h1>
            body: ${i.body}<br><br>
            Merge URL: <a href="${i.html_url}">Go to page</a><br><br>
            State: ${i.state}<br><br>
            Creation date: ${i.created_at}<br><br>
            `
            info_text.appendChild(message)
            info_text.appendChild(document.createElement("br"))
        }
    })
    return
}


function clear(){
    while(info_text.firstChild){
        info_text.removeChild(info_text.firstChild);
    }
}
