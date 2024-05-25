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
    return (URL + "/search/commits?q=user:"+username+" module-info.java")
}


function isImportantCommit(commit) {
    const message = commit.message.toLowerCase();
    const isModuleInfoRelated = message.includes("module-info.java");
    return isModuleInfoRelated;
}

async function sendCommitsRequest(URL, username){
    clear();
    const new_url = buildCommitsRequest(URL, username)
    const headers = {
        "Accept": "application/vnd.github.cloak-preview",
    }
    const response = await fetch(new_url, {
        "method": "GET",
        "headers": headers
    })


    const result = await response.json()
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





    // const link = response.headers.get("link")
    // let urls = null;
    // if(link != null){
    //     const links = link.split(",")
    //     urls = links.map(a=> {
    //         return {
    //             url: a.split(";")[0].replace(">","").replace("<",""),
    //             title:a.split(";")[1]
    //         }
    //     })
    // }

    // result.items.forEach( i => {
    //     const anchor = document.createElement("a")
    //     anchor.href = i.html_url;
    //     anchor.textContent = i.commit.message.substr(0, 120) + "..."
    //     info_text.appendChild(anchor)
    //     info_text.appendChild(document.createElement("br"))
    // })

    // if (link != null){
    //     urls.forEach(u => {
    //         const btn = document.createElement("button")
    //         btn.textContent = u.title;
    //         btn.addEventListener("click", () => sendCommitsRequest(u.url, username))
    //         info_text.appendChild(btn);
    //     })
    // }
    return
}




function buildRepoRequest(URL, username){
    return (URL+"/search/repositories?q=user:"+username+"+language:Java+module")
}



async function sendRepoRequest(URL, username){
    clear();
    const new_url = buildRepoRequest(URL, username)
    console.log(new_url)
    const headers = {
        "Accept": "application/vnd.github+json",
    }
    const response = await fetch(new_url, {
        "method": "GET",
        "headers": headers
    })
    const result = await response.json()
    result.items.forEach( i => {
        console.log(i)
        const anchor = document.createElement("a")
        anchor.href = i.html_url;
        anchor.textContent = i.name
        info_text.appendChild(anchor)
        info_text.appendChild(document.createElement("br"))
    })
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
