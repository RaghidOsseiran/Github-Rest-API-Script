

const buttonRequest = document.getElementById("item-in-URL")
buttonRequest.addEventListener("click", () => sendRequest("https://api.github.com"))

const requestTypes = ["Commits", "Repositories", "Issues"]
const toCall = [sendCommitsRequest, sendRepoRequest, sendIssuesRequest]

const info_text = document.getElementById("info-div");



function sendRequest(URL = "https://api.github.com"){
    const reqType = document.getElementById("search-input")
    if (reqType == null){
        console.log("no value in search input")
        return 
    }
    for(let i = 0; i < requestTypes.length; i++){
        if (requestTypes[i] == reqType.value){
            const username = document.getElementById("url-input")
            toCall[i](URL, username.value)
            return
        }
    }
    console.log("invalid request")
}



//https://api.github.com/search/issues?q=author:RaghidOsseiran


function buildCommitsRequest(URL, username){
    return (URL + "/search/commits?q=author:"+username)
}

async function sendCommitsRequest(URL, username){
    clear();
    const new_url = buildCommitsRequest(URL, username)
    console.log(new_url)
    const headers = {
        "Accept": "application/vnd.github+json"
    }
    const response = await fetch(new_url, {
        "method": "GET",
        "headers": headers
    })
    const result = await response.json()
    result.items.forEach( i => {
        const anchor = document.createElement("a")
        anchor.href = i.html_url;
        anchor.textContent = i.commit.message.substr(0, 120) + "..."
        info_text.appendChild(anchor)
        info_text.appendChild(document.createElement("br"))
    })
    return
}








async function sendRepoRequest(URL, username){
    clear();
    const new_url = buildRepoRequest(URL, username)

    return
}


async function sendIssuesRequest(URL, username){
    console.log("3")
    return
}


function clear(){
    while(info_text.firstChild){
        info_text.removeChild(info_text.firstChild);
    }
}