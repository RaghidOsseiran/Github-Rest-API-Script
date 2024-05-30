
// https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-repository-content FOR THE CONTENT INSIDE THE REPOSITORIES

export const URL = "https://api.github.com"



export async function fetchContent(url, owner, repo, path=''){
    console.log("in fetch content"+ owner+','+repo+','+path)
    const headers = {
        "Accept": "application/vnd.github+json",
    }
    const response = await fetch(url, {
        "method": "GET",
        "headers": headers ,
    })
    if (!response.ok) throw new Error('Error fetching data')
    return await response.json()
    
}



export async function fetchRepoContent(url){
    const headers = {
        "Accept": "application/vnd.github+json"
    }
    const response = await fetch(url, {
        "method": "GET",
        "headers": headers
    })
    if (!response.ok) throw new Error('Error fetching data')
    return await response.json()
}


//https://api.github.com/search/issues?q=author:RaghidOsseiran







export function isImportantCommit(commit) {
    const message = commit.message.toLowerCase();
    const isModuleInfoRelated = message.includes("module-info.java");
    return isModuleInfoRelated;
}

export function isImportantIssue(issue_body){
    if (issue_body != null){
        const is_important = issue_body.includes("module-info.java");
        return is_important;
    }
    return false;
}

export function filter_result(data){
    return {
        total_count: data.total_count,
        items: data.items.filter(item => item.name === 'module-info.java')
    };
}



////////////////////////// URL MANIPULAITON FUNCTIONS




// FUNCTION TO BE ABLE TO SEND THE REQUEST TO GET THE CONTENT (REMOVES THE ${/path})
export function split_And_Correct(url){
    let parts = url.split('/')
    parts.pop()
    parts.pop()
    return parts.join('/')
}


// CORRECTLY BUILDING THE PATHS TO ALL MODULE-INFO.JAVA FILES  (FOR RECURSIVE ALGORITHM)
export function construct_paths(all_path, base){
    return all_path.map(path => base+'/'+path)
}




// BUILDS THE CORRECT REPOSITORY REQUEST TO SEND TO THE GITHUB API
export function buildRepoRequest(username){
    return (URL+"/search/repositories?q=user:"+username+"+language:Java+module")
}

export function buildIssueRequest(username){
    return (URL+"/search/issues?q=owner:"+username+"+language:Java+type:pr+module-info.java")
}


// BUILDS THE CORRECT COMMITS REQUEST TO SEND TO THE GITHUB API
export function buildCommitsRequest(username){
    return (URL + "/search/commits?q=user:"+username+"+ module-info.java")
}


// https://api.github.com/search/code?q=repo%3ARaghidOsseiran%2FJava-fac+language%3AJava&type=code


export function buildCodeRequest(username, repo){
    return (URL+"/search/code?q=repo%3A"+username+"/"+repo+"+language:Java&type=code")
}

export function initRequest(URL, i){
    const url_info = URL.split('/').slice(i).join('/')
    return ("https://api.github.com/repos/"+url_info)
}


///////////////////////////////////////////////////////////////////////


// RECURSIVE ALGORITHM TO FIND ALL MODULES-INFO.JAVA FILES (CAN BE OPTIMISED)

// async function findModuleInfoFiles(baseUrl, path, owner, repoName) {
//     let url = ''
//     if (path != ''){
//         url = `${baseUrl}/${path}`;
//     } else {
//         url = baseUrl
//     }
//     console.log('in recursive:' + url)
//     const contents = await fetchContent(url, owner, repoName, path);
//     let moduleInfoFiles = [];

//     for (const item of contents) {
//         if (item.type === 'dir') {
//             const subPath = item.path;
//             const subFiles = await findModuleInfoFiles(baseUrl, subPath, owner, repoName);
//             moduleInfoFiles = moduleInfoFiles.concat(subFiles);
//         } else if (item.type === 'file' && item.name === 'module-info.java' && item.name != 'outDir') {
//             moduleInfoFiles.push(item.path);
//         }
//     }
//     return moduleInfoFiles;
// }



// async function searchForModuleInfoFiles(url, owner, repoName){
//     const moduleInfoFiles = await findModuleInfoFiles(url, '', owner, repoName)
//     return moduleInfoFiles
// }

/////////////////////////////////////////////////////////////////////////////////////////////
