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


async function fetchRepoContent(url){
    const headers = {
        "Accept": "application/vnd.github+json",
    }
    const response = await fetch(url, {
        "method": "GET",
        "headers": headers
    })
    if (!response.ok) throw new Error('Error fetching data')
    return await response.json()
}


// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content FOR THE CONTENT INSIDE THE REPOSITORIES

async function fetchContent(url, owner, repo, path){
    console.log(owner+','+repo+','+path)
    const headers = {
        "Accept": "application/vnd.github+json",
    }
    const response = await fetch(url, {
        "method": "GET",
        "headers": headers ,
        "owner": owner,
        "repo": repo,
        "path": path
    })
    if (!response.ok) throw new Error('Error fetching data')
    return await response.json()
    
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
    const result = fetchRepoContent(new_url)
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





// FUNCTION TO BE ABLE TO SEND THE REQUEST TO GET THE CONTENT
function split_And_Correct(url){
    let parts = url.split('/')
    parts.pop()
    return parts.join('/')
}






// RECURSIVE ALGORITHM TO FIND ALL MODULES-INFO.JAVA FILES (CAN BE OPTIMISED)

async function findModuleInfoFiles(baseUrl, path, owner, repoName) {
    let url = ''
    if (path != ''){
        url = `${baseUrl}/${path}`;
    } else {
        url = baseUrl
    }
    console.log('in recursive:' + url)
    const contents = await fetchContent(url, owner, repoName, path);
    let moduleInfoFiles = [];

    for (const item of contents) {
        if (item.type === 'dir') {
            const subPath = item.path;
            const subFiles = await findModuleInfoFiles(baseUrl, subPath, owner, repoName);
            moduleInfoFiles = moduleInfoFiles.concat(subFiles);
        } else if (item.type === 'file' && item.name === 'module-info.java' && item.name != 'outDir') {
            moduleInfoFiles.push(item.path);
        }
    }
    return moduleInfoFiles;
}



async function searchForModuleInfoFiles(url, owner, repoName){
    const moduleInfoFiles = await findModuleInfoFiles(url, '', owner, repoName)
    return moduleInfoFiles
}

/////////////////////////////////////////////////////////////////////////////////////////////





// CORRECTLY BUILDING THE PATHS TO ALL MODULE-INFO.JAVA FILES 
function construct_paths(all_path, base){
    return all_path.map(path => base+'/'+path)
}





function buildRepoRequest(URL, username){
    return (URL+"/search/repositories?q=user:"+username+"+language:Java+module")
}


async function sendRepoRequest(URL, username){
    clear();
    const new_url = buildRepoRequest(URL, username)
    const result = await fetchRepoContent(new_url)
    console.log(result)
    result.items.forEach(async (i) => {


        const up_url = split_And_Correct(i.contents_url)


        const all_path = await searchForModuleInfoFiles(up_url, i.owner.login, i.name)
        all_path = construct_paths(all_path, i.html_url)

        
        const message = document.createElement("p")
        message.innerHTML = `
        <h1>Repository: ${i.name}</h1> 
        Repo description: ${i.description}<br><br>
        Repo URL: <a href="${i.html_url}">Go to Page</a><br><br>
        Content URL: <a href="${up_url}">Go to Page</a><br><br>
        Number of issues linked to repo: ${i.open_issues_count}<br><br>
        Created at: ${i.created_at}<br><br>
        Last updated at: ${i.updated_at}<br><br>
        Paths to all module-info.java: ${all_path.join('<br>')}<br><br>
        `
        info_text.appendChild(message)
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
