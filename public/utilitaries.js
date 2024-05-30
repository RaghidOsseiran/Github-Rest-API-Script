import {fetchRepoAuthContent} from './client.js'


////////////////////// ALL UTIL //////////////////////


export function notNull(item) {
    return item !== null && item !== undefined;
}



////////////////////// CODE REQUEST UTILITARY FUNCTIONS //////////////////////


export function filterCodeResponse(data){
    let paragraphRes = document.createElement("p")
    let textRes = ''
    data.items.forEach((item) => {
        if (item.name.includes("module-")){
            textRes+= `
                <h1>Path: ${item.path}</h1>
                <button>Code link:<a href="${item.html_url}">Click here</a></button> <br><br>
                => Brief description: ${item.repository.description} <br><br>
                <h2>Repository details:</h2> 
                => Full repository path: ${item.repository.full_name} <br><br>
                => Repository link: <a href="${item.repository.html_url}">Click here</a> <br><br>
                <p>---------------------------------------------<p><br><br>
                `
        }
    }) 
    paragraphRes.innerHTML = textRes
    return paragraphRes
}


////////////////////// ISSUES REQUEST UTILITARY FUNCTIONS //////////////////////



export function getUserRepoFromUrl(issueRepoURL){
    if (notNull(issueRepoURL)){
    return{
            user: issueRepoURL.split('/')[3],
            repo: issueRepoURL.split('/')[4]
        }
    }
    throw new Error('cannot split an empty object')
}


export async function possiblyValidPr(issueItem, baseURL){
    const {user, repo} = getUserRepoFromUrl(issueItem.html_url)
    const url_Req = baseURL+"code?q=user:"+user+"+repo:"+user+"/"+repo+"+requires+language:Java"
    const response = await fetchRepoAuthContent(url_Req)
    console.log(response.total_count > 0)
    return (response.total_count > 0)
}


export async function issuesFilterByRepoContent(issueRepo, baseURL){
    if (notNull(issueRepo)){
        const paragraphRes = document.createElement("p")
        let textRes = ''
        for(const item of issueRepo.items){
            const isValid = await possiblyValidPr(item, baseURL)
            if (isValid) {
                textRes += `
                <h1> Pull request title: ${item.title} </h1>
                => Brief description: ${item.body+"..."}
                <h2> Pull request information: </h2>
                => User: <b> ${item.user.login} </b> <br><br>
                => Pr link: <a href="${item.html_url}">Click here</a> <br><br>
                => Pr state: ${item.state}<br><br>
                => Creation date: ${item.created_at}<br><br>
                `
            }
        }
        paragraphRes.innerHTML = textRes
        return paragraphRes
    }
    throw new Error('Invalid issue repo request')
}


////////////////////// COMMITS REQUEST UTILITARY FUNCTIONS //////////////////////


export async function possiblyValidCommit(issueItem, baseURL){
    const {user, repo} = getUserRepoFromUrl(issueItem.repository.html_url)
    const url_Req = baseURL+"code?q=user:"+user+"+repo:"+user+"/"+repo+"+requires+language:Java"
    const response = await fetchRepoAuthContent(url_Req)
    return (response.total_count > 0)
}



export async function commitsFilterByRepoContent(issueRepo, baseURL) {
    if (notNull(issueRepo)) {
        const paragraphRes = document.createElement("p");
        let textRes = '';

        for (const item of issueRepo.items) {
            const isValid = await possiblyValidCommit(item, baseURL);
            if (isValid) {
                textRes += `
                <h1> Commit message: ${item.commit.message} </h1>
                <h2> Commit information: </h2>
                => Commiter: <b> ${item.commit.committer.name} </b> <br><br>
                => Commit link: <a href="${item.html_url}">Click here</a> <br><br>
                => Repository of commit link: <a href="${item.repository.html_url}">Click here</a><br><br>
                => Commit date: ${item.commit.author.date}<br><br>
                `;
            }
        }
        paragraphRes.innerHTML = textRes;
        return paragraphRes;
    }
    throw new Error('Invalid issue repo request');
}



////////////////////// REQUEST BUILDERS //////////////////////


export function codeRequestBuilder(baseURL, username){
    return baseURL+"code?q=user:"+username+"+extension:java+exports"
}


export function issuesRequestBuilder(baseURL, username){
    return baseURL+"issues?q=user:"+username+"+type:pr+module+language:Java"
}

export function commitsRequestBuilder(baseURL, username){
    return baseURL+"commits?q=user:"+username+"+module"
}