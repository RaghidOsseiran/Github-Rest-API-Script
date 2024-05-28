import {fetchContent, fetchRepoContent, buildCommitsRequest, isImportantCommit, split_And_Correct, construct_paths, buildRepoRequest, initRequest, URL} from './utilitaries.js'

const buttonRequest = document.getElementById("item-in-URL")
buttonRequest.addEventListener("click", () => sendRequest())

const requestTypes = ["Commits", "Repositories", "Issues"]
const toCall = [sendCommitsRequest, sendRepoRequest, sendIssuesRequest]

const info_text = document.getElementById("info-div");


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



async function sendRepoRequest(username){
    clear();
    const new_url = buildRepoRequest(username)
    const result = await fetchRepoContent(new_url)
    result.items.forEach(async (i) => {


        const up_url = split_And_Correct(i.contents_url)
        console.log("new url: "+up_url)


        // const all_path = await searchForModuleInfoFiles(up_url, i.owner.login, i.name)
        // all_path = construct_paths(all_path, i.html_url)


        // Paths to all module-info.java: ${all_path.join('<br>')}<br><br></br>
        
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
    console.log("3")
    return
}


function clear(){
    while(info_text.firstChild){
        info_text.removeChild(info_text.firstChild);
    }
}
