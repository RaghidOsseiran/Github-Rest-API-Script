import { codeRequestBuilder, commitsFilterByRepoContent, commitsRequestBuilder, filterCodeResponse, issuesFilterByRepoContent, issuesRequestBuilder, notNull } from "./utilitaries.js"




////////////////////////// INDEX PAGE /////////////////////////////////////////

const buttonRequest = document.getElementById("item-in-URL")
if (buttonRequest) {
    buttonRequest.addEventListener("click", () => sendRequest());
}

const reqTab = ["Commits", "Code", "Issues"]
const callTab = [sendCommitsRequest, sendCodeRequest, sendIssuesRequest]

const info_div = document.getElementById("info-div")
const apiKeyEx = document.getElementById("apiKey")
let apiKey = null
if (apiKeyEx){
    apiKey = apiKeyEx.innerHTML
}

export const baseURL = "https://api.github.com/search/"
export const timeoutDuration = 5000

//////////////////////////////////////////////////////////////////////////////////


////////////////////// HTML PAGE //////////////////////



function clear(){
    while(info_div.firstChild){
        info_div.removeChild(info_div.firstChild)
    }
}


function updatePage(data){
    info_div.appendChild(data)
    info_div.appendChild(document.createElement("br"))
}



////////////////////////////////////////////////////////






function sendRequest(){
    const requestType = document.getElementById("search-input")
    if (notNull(requestType)){
        for(let i = 0; i < reqTab.length; i++){
            if (reqTab[i] == requestType.value){
                const username = document.getElementById("url-input").value
                callTab[i](username)
                return
            }
        }
    }
    return
}


export async function fetchRepoAuthContent(url){
    console.log("how many times in here"+ ", current apiKey:"+apiKey)
    const headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${apiKey}`
    }
    const response = await fetch(url, {
        "method": "GET",
        "headers": headers
    })
    if (!response.ok) throw new Error('Error fetching data')
    return response.json()
}



async function sendCommitsRequest(username){
    clear()
    const urlReq = commitsRequestBuilder(baseURL, username)
    let result = await fetchRepoAuthContent(urlReq)
    result = await commitsFilterByRepoContent(result, baseURL)
    updatePage(result)
}



async function sendCodeRequest(username){
    clear()
    const urlReq = codeRequestBuilder(baseURL, username)
    let result = await fetchRepoAuthContent(urlReq)
    result = filterCodeResponse(result)
    updatePage(result)
}

async function sendIssuesRequest(username){
    clear()
    const urlReq = issuesRequestBuilder(baseURL, username)
    let result = await fetchRepoAuthContent(urlReq)
    result = await issuesFilterByRepoContent(result, baseURL)
    updatePage(result)
}

