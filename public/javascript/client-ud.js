/*
 https://medium.com/codingthesmartway-com-blog/getting-started-with-axios-166cb0035237
 */

/*  !!  This File  !!
    CLIENT-UD.JS = Update, Delete  ('UD' from CRUD)

Brought into HTML file:
- /views/articleedit.pug
- div#postEditResult

(See also CLIENT-CR.JS = Create, Read ('CR' from CRUD))
 */

// btw, AXIOS was brought in via the <script> tag in the Footer.



/* ####################################### */
/* **********   TOC  CLIENT-UD.JS  ********* */
/* ####################################### */


/* ########  PUT EDIT ARTICLE ############# */
/*
 document.getElementById('apiPut')
 .addEventListener('submit', performPutRequest) ...
 */


/* ########  POST DELETE ARTICLE ############# */
/*
 document.getElementById('apiDelete')
 .addEventListener('submit', performDeleteRequest) ...
 */



/* ####################################### */
/* **********   /TOC  CLIENT-UD.JS  ********* */
/* ####################################### */



var apiVersion = 'api/v1'


/* ####################################### */
/* ########  PUT EDIT ARTICLE ############# */ // << NEW
/* ####################################### */
document.getElementById('apiPut')
    .addEventListener('submit', performPutRequest)

function performPutRequest(event) {
    event.preventDefault()
    editArticle(event)
}

function editArticle(eventPassedIn) {

    // ELEMENT TO SHOW RESULT:
    var elementPutResult = document.getElementById('putResult')
    elementPutResult.innerHTML = '' // init, re-init

    // ID of ARTICLE (via Hidden input)
    // var articleIdVar = eventPassedIn.target.articleId_query.value
    var articleIdVar = eventPassedIn.target.articleId_id.value


    // FORM DATA TO POST:
    var articleEditedToPut = { } // init
    articleEditedToPut.articleTitle_name = eventPassedIn.target.articleTitle_name.value

/*  OLD:
    Note, the need to insert a "Verb" (/edit/) into the URI. Not Good.
    axios.post(`http://0.0.0.:8089/${apiVersion}/articles/edit/${articleIdVar}`,
*/
// NEW: "PUT"  No "Verb" in the URI. Good.
// Verb is the HTTP method: 'PUT'. Good.
    axios(
        {
            // url: `http://0.0.0.0:8089/${apiVersion}/articles/${articleIdVar}`,
            // relative path:
            url: `/${apiVersion}/articles/${articleIdVar}`,
            method: 'put',

            // ------------------------
            // https://github.com/axios/axios#using-applicationx-www-form-urlencoded-format
            // AXIOS SENDS application/json BY DEFAULT
            // Yields: Content-Type: application/json;charset=UTF-8

            // But we can add this header in here "manually" ...
            // - Note that the below no longer gets the ';charset=UTF-8' that Axios apparently also automatically puts on. Interesting.
            headers: {
               // JUST TESTING. THIS OF COURSE DOES NOT WORK:
                // 'Content-Type': 'application/x-www-form-urlencoded' // Yields: Content-Type: application/x-www-form-urlencoded << NOPE.

                'Content-Type': 'application/json' // Yields: Content-Type: application/json << CORRECT
            },
            // ------------------------

            data: articleEditedToPut
        }
    )
        .then(
            (whatIGot) => {
                // fulfilled/resolved
                console.log('here we are back up in client-ud.js and whatIGot is ', whatIGot)
                var whatToDisplay = generateSuccessfulHTMLOutput(whatIGot)
                whatToDisplay = `
                       <h3>Below, The Article You Edited via API:</h3>
                       <p>(Refresh page to see the same new edit in the article display up above, via the Express app.)</p>
                        ` + whatToDisplay
                elementPutResult.innerHTML = whatToDisplay
            },
            (problemo) => {
                // rejected
                console.log(' problemo: ', problemo)
            }
        )
        .catch((err) => {
            console.log('CATCH err: ', err)
        })

}
/* ########  /PUT EDIT ARTICLE ############# */



/* ####################################### */
/* ########  DELETE ARTICLE ############# */
/* ####################################### */

document.getElementById('apiDelete')
    .addEventListener('submit', performDeleteRequest)

var elementDeleteResult = document.getElementById('deleteResult')
elementDeleteResult.innerHTML = '' // init, re-init

function performDeleteRequest(eventPassedIn) {
    eventPassedIn.preventDefault()
    deleteArticle(eventPassedIn.target.articleId_id.value)
}

function deleteArticle(idPassedIn) {

    /* DELETE with Axios:
     https://github.com/axios/axios/issues/736
     https://github.com/axios/axios#axiosdeleteurl-config-1
     See also:
     https://github.com/axios/axios#handling-errors
     */

    axios(
        // Axios Config. https://github.com/axios/axios#request-config
        {
            // url: `http://0.0.0.0:8089/${apiVersion}/articles/${idPassedIn}`,
            url: `/${apiVersion}/articles/${idPassedIn}`,
            method: 'delete'
        }
    )
        .then(
            (axiosResponse) => {
            // fulfilled/resolved
                var whatToDisplay = generateSuccessfulHTMLOutput(axiosResponse)
                elementDeleteResult.innerHTML = `
              <h3>Article You Just Deleted</h3>
              ${whatToDisplay}
`
            }
        )
        .catch ((err) => console.log('Client JS Delete CATCH err: ', err))
}

/* ########  /DELETE ARTICLE ############# */