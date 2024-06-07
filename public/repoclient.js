import { baseURL, timeoutDuration, fetchRepoAuthContent} from './client.js'
import { commitsRepoRequestBuilder, getAndSplit, buildResponseCommit, timeout, issuesFilterByRepoContent } from './utilitaries.js'


const butRequest = document.getElementById("sub-but")
butRequest.addEventListener("click", () => initiateRequest())
const apiKey = document.getElementById("container").innerHTML
const tableInfo = document.getElementById("table-info")


////////////////////// HTML PAGE //////////////////////



function clear(){
    if (tableInfo){
        tableInfo.innerHTML = ""
    }
}


function updatePage(data){
    if (tableInfo){
        let oldContent = tableInfo.innerHTML
        tableInfo.innerHTML = oldContent + data
    }
}


function initTable(){
    tableInfo.innerHTML += 
    `
    <tr>
        <th>Type</th>
        <th>Date</th>
        <th>Link</th>
        <th>State</th>
        <th>Message</th>
    </tr>
    `
}


////////////////////////////////////////////////////////



function initiateRequest(){
    clear()
    const repoString = document.getElementById("repoString")
    if (repoString == null) throw new Error("Cannot send request to invalid repo");
    const {username, repo} = getAndSplit(repoString.value)
    const metaData = {
        username : username,
        repo: repo, 
    }
    initTable()
    sendCommitRequest(metaData.username, metaData.repo)
}



////////////////////// COMMITS /////////////////////////////////////////

async function sendCommitRequest(username, repo){
    const urlReq = commitsRepoRequestBuilder(baseURL, username, repo)
    // let result = await fetchRepoAuthContent(urlReq)
    // let response = await buildResponseCommit(result, repo)
    try{
        let result = await Promise.race([
            fetchRepoAuthContent(urlReq),
            timeout(timeoutDuration)
        ])

        
        let response = await Promise.race([
            buildResponseCommit(result, repo),
            timeout(timeoutDuration)
        ])
        updatePage(response)
    } catch(error){
        console.log('Error')
    }
}