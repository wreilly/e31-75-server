/*
 https://medium.com/codingthesmartway-com-blog/getting-started-with-axios-166cb0035237
 */

/*  !!    This File     !!
   CLIENT-CR.JS = Create, Read ('CR' from CRUD)

Brought into HTML file:
- /views/articles.pug
- div#postAllResult
- div#postNewArticleResult

 (See also CLIENT-UD.JS = Update, Delete  ('UD' from CRUD))
 */

// btw, AXIOS was brought in via the <script> tag in the Footer.

/* ####################################### */
/* ###########   TOC  CLIENT-CR.JS  ########### */
/* ####################################### */

/* ###########  GET ALL ARTICLES ########### */
/*
document.getElementById('apiAllClick')
    .addEventListener('submit', performGetAllRequest) ...
*/


/* ###########  POST CREATE ARTICLE ########### */
/*
var myClientJsFormElement = document.getElementById('clientJsForm')
myClientJsFormElement.addEventListener('submit', performPostRequest) ...
*/

/* ####################################### */
/* ########  /TOC  CLIENT-CR.JS  ######### */
/* ####################################### */


var apiVersion = 'api/v1'




/* ####################################### */
/* #####    GET ALL ARTICLES  ###########  */
/* ####################################### */
document.getElementById('apiAllClick')
    .addEventListener('submit', performGetAllRequest)

document.getElementById('apiNoneClick')
    .addEventListener('submit', performClearArticles)

function performClearArticles(e) {
    e.preventDefault()
    var elementWhereListIs = document.getElementById('postAllResult')
    elementWhereListIs.innerHTML = '' // clear it
}

function performGetAllRequest(event){
    event.preventDefault()
    getArticles()
}

function getArticles() {

    var elementForList = document.getElementById('postAllResult')
    elementForList.innerHTML = '' // init, re-init

    // axios.get(`http://0.0.0.0:8089/${apiVersion}/articles/`)
    axios.get(`/${apiVersion}/articles/`)
        .then(
            (whatIGot) => {
                // fulfilled/resolved
                console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&')
                console.log('Here in client-cr.js whatIGot (from axios) : ', whatIGot)
                console.log('&&&&&&&&&&&&&&&&&&&&&&&&&&&')
                /*
                {
                   status: 200,
                   config: {},
                   headers: {},
                   data: [{},{}], ...
                }
                 */
                var stuffToShow = generateSuccessfulHTMLOutput(whatIGot)
                // elementForList.innerHTML = whatIGot // No. [object Object]
                // elementForList.innerHTML = whatIGot.data // No.  [object Object],[object Object],[object Object]...
                // elementForList.innerHTML = whatIGot.JSON.stringify(data) // No.  Cannot read property 'stringify' of undefined
                // var quickJSON = JSON.stringify(whatIGot.data)
                // elementForList.innerHTML = quickJSON // YES.
                // var quickStuffToShow = generateSuccessfulHTMLOutput(quickJSON)
              //  elementForList.innerHTML = quickStuffToShow // NO. you can't send just the stringified JSON of the array of articles data, over to the "generateHTML" function.
                // Why?
                // Because it expects a full Axios response object, with headers, status, data etc. Cheers.

                elementForList.innerHTML = stuffToShow // YES.
            },
            (problemo) => {
                // rejected
                console.log('Client.js axios Get All Articles rejected problemo: ', problemo)
            }
        )
        .catch((err) => {
            console.log('CATCH Client.js axios Get All Articles rejected problemo: ', err)
        })
}
/* #####  /GET ALL ################## */




/* ####################################### */
/* #####    POST CREATE ARTICLE  ###########  */
/* ####################################### */
var myClientJsFormElement = document.getElementById('clientJsForm')
myClientJsFormElement.addEventListener('submit', performPostRequest)

function performPostRequest(event) {
    event.preventDefault()
    createArticle(event)
}

function createArticle(eventReceived) {

    var resultElement = document.getElementById('postNewArticleResult')
    resultElement.innerHTML = '' // init, re-init

    /* Assemble the form data from the Event Target into an object to post via axios.

     Note: I did try using FormData but was not having success.
           https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
     */
    var articleToSaveFromClient = {
        articleUrl_name: eventReceived.target.articleUrl_id.value,
        articleTitle_name: eventReceived.target.articleTitle_id.value
    }

    // axios.post(`http://0.0.0.0:8089/${apiVersion}/articles`,
    axios.post(`/${apiVersion}/articles`,
        articleToSaveFromClient
    )
        .then(
            (responseFromAxios) => {
                console.log('CLIENT.JS we just posted responseFromAxios is ', responseFromAxios)

                var whatToOutput = `<h4>Article You Just Added</h4>`
                whatToOutput += generateSuccessfulHTMLOutput(responseFromAxios)
                resultElement.innerHTML = whatToOutput
            },
            (error) => {
                console.log('client-cr createArticle Rejected', error)
            }
        )
        .catch(
            (error) => {
                console.log('client-cr createArticle Catch error', error)
            }
        )

}
/* #########  /POST CREATE ARTICLE ############# */




/* Just a note to self ...

 WELCOME BACK to Client-side JavaScript Programming.

 New Finding (for me)
 - This client-side code is effectively like a ROUTER and a CONTROLLER

 That is, as is found in your:
   /routes/api/api-articles.js
   /controllers/api/api-articleController.js,
 likewise here in good old:
   /public/javascript/client-cr.js,
 you have:

 1) ROUTER
 a sort of "router" via the eventListener we attach to the Form. On submit/click, (kinda like visiting a URL), it kicks off a route/path/thing/action
 1.A.) what it kicks off is my skinny-router-like function "performPostRequest". Kinda like the Express router (api-articles.js), this simply passes along sort of "system info":
 -- Express router passes (req, res, next), and that 'req' has .body and that .body has my Form fields: articleUrl_name...
 -- Client-side listener function receives and passes along 'event' and that 'event' has 'target' and target has my Form fields: articleUrl_name...


 2)  CONTROLLER
 Here in client-side that "router-like" function (skinny!) passes to the "controller-like" function here (Fat) for all the work:
 -- A. createArticle(getsEvent)
 -- B. build up the articleToSave from the event.target form fields
 -- C. invoke AXIOS to go hit our awaiting Express REST API with a POST to /api/v1/articles
 -- D. get back the whole document
 -- E. stick it (the document) onto a previously identified and variableized DOM element to Get It Onto The Page!

 DONE

 *** NOTE on a NAMING CONVENTION (I use) ***
 * articleUrl      <<< in database
 * articleUrl_name <<< on form input field
 *
 * Even though here in Client.js we do sort of have a "controller"-like thing going on ...
 * You still MUST be passing the named fields along with the '_name' convention I have been using, as seen on the <form> fields. (e.g. 'name="articleUrl_name"', not 'articleUrl')
 * Why?
 * Because though here in Client.js we already sort of did ONE "transfer" from a "router"-like thing over to a "controller"-like thing, ...
 * ... in now going down to the API POST '/articles', we are about to ...
 * ... enter into a SECOND "router-to-controller" situation, on the REST API code
 * And so, that second router (the API POST '/articles'), well it TOO expects the form fields to be named like so: 'articleUrl_name', not 'articleUrl'
 * It is only on the FINAL step that we change the name from 'articleUrl_name' to 'articleUrl' - when we are just about to save it to the database.
 * **************************
 */
