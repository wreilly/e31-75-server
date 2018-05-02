
/*
 https://medium.com/codingthesmartway-com-blog/getting-started-with-axios-166cb0035237
 */

/* ******** UTILITY *************** */
function generateSuccessfulHTMLOutput(responseFromAxiosPassedIn) {

    var bigOlString = ''

    /*
     responseFromAxiosPassedIn.status
     responseFromAxiosPassedIn.headers
     responseFromAxiosPassedIn.data
     */

    var stringifiedHeaders = JSON.stringify(responseFromAxiosPassedIn.headers)
    var stringifiedData = JSON.stringify(responseFromAxiosPassedIn.data)


    bigOlString = `
      <div>Status: <pre>${responseFromAxiosPassedIn.status} \| ${responseFromAxiosPassedIn.statusText}</pre></div>
      <div>Headers: <pre class="wrap-please">${stringifiedHeaders}</pre></div>
`

    // Handle either: 1) Create/Edit/Delete Individual Article OR 2) Get All Articles:
    // Further - if it was a Delete, don't show "links" to the now-deleted Some Times entry.
    if (responseFromAxiosPassedIn.data.articleUrl) {
        // 1)
        bigOlString += `
            <div>N.Y. Times Article Link: <a href="${responseFromAxiosPassedIn.data.articleUrl}" target="nyt_tab_blank">${responseFromAxiosPassedIn.data.articleUrl}</a></div>
            `
        if (responseFromAxiosPassedIn.config.method === 'delete') {
            bigOlString +=
                `
            <div>Some Times Entry Link WAS: <span class="headline">${responseFromAxiosPassedIn.data.articleTitle}</span></div>
            <div>(JSON entry as rendered to browser via API WAS): <span class="headline">/api/v1/articles/${responseFromAxiosPassedIn.data._id}</span></div>
            `
        } else {
            bigOlString +=
                `
  <div>Some Times Entry Link: <a href="/articles/${responseFromAxiosPassedIn.data._id}" target="_self">${responseFromAxiosPassedIn.data.articleTitle}</a></div>
            <div>(See JSON entry as rendered to browser via API): <a href="/api/v1/articles/${responseFromAxiosPassedIn.data._id}" target="api_tab_blank">/api/v1/articles/${responseFromAxiosPassedIn.data._id}</a></div>
            `
        }
   } else {  // For the LIST of all articles, 'data' is an Array of article objects [{},{}]. It won't have 'data.articleUrl'
        // 2)
        bigOlString += `
            <div>API Data: <pre class="wrap-please">${stringifiedData}</pre></div>
            `
    }
    return bigOlString
}

