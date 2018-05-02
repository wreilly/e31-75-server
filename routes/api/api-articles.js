var express = require('express')
var apiArticlesRouter = express.Router()

var middlewareTrimHere = require('../../middleware/trim-url-is-all')

var apiArticleControllerHereInApi = require('../../controllers/api/api-articleController')

// CORS. Middleware to run on every request to this (API) Router:
apiArticlesRouter.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers'
    })
    console.log('API ROUTER. req.method: ', req.method)
    // PRE-FLIGHT check:
    if(req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    next()
})

// TOC = Table Of Contents

/* $$$$$   TOC   $$$$$$$$$$$$$$$$$

 * apiArticlesRouter.get('/edit?articleId_query', ...)
 *
 * NEW: 2018-04-20
 * apiArticlesRouter.get('/first-n?howMany_query', ...)
 *
 * apiArticlesRouter.get('/:idHere', ...) << f.y.i.: Works, but, NOT USED by the WEB APP's "API TEST HARNESS", fwiw.
 *
 * apiArticlesRouter.get('/', ...)
 *
 * apiArticlesRouter.post('/', ...)
 *
 * apiArticlesRouter.put('/:idToEditHere', ...)
 *
 * apiArticlesRouter.delete('/:idToDeleteHere', ...)

 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */

/* "SKINNY" ROUTER; "FAT" CONTROLLER */


/*  Note:
 * ('/') --> '/api/v1/articles'
 */


/* ******* !! Put this more SPECIFIC Route FIRST !! **** */

/* ************************************************** */
/* *****  GET '/api/v1/articles/edit?articleId_query=5ab99...' ************ */
/* ************************************************** */
apiArticlesRouter.get('/edit', function(req, res, next) {

    /* GET with Hidden Field:

     This is the "funny/odd route," whereby the calling HTML page (article.pug),
     on the Form there, we use a GET, with a Hidden field
     (name="articleId_query"), to pass the _id as a Query Parameter
     down here to the REST API router.

     This is step 1 in a 2-step process to Edit.

     Then, the Router passes to the Controller, the Controller invokes the Data Service which (re)-finds that Article, the document for which we pass back up to the web app which renders it on another HTML page, in an editable Form.

     Then, as step 2, the 'submit' click on *that* Form triggers a POST to yet another REST API URI route (e.g. '/api/v1/articles/edit/12345'), which saves the update to the database. Cheers.
     */


    apiArticleControllerHereInApi.apiGetArticleToEdit(req, res, next)
    // Towards the goal of keeping this Router very "skinny",
    // we'll do the work of getting the ID Param off this req object
    // over in the Controller ("fat") instead.
})


/* ******* !! Also put this more SPECIFIC Route FIRST (ahead of GET /:idHere) !! **** */

/* ************************************************** */
/* *****  GET '/api/v1/articles/first-n?howMany_query=3' ************ */
/* ************************************************** */
apiArticlesRouter.get('/first-n', function(req, res, next) {
    /*
    GET with not quite an Express/Pug/HTML "form" "hidden" input field ...
    ... but instead simply an Angular component.html "input" w. "#ref" & "button" combo, to emulate a sort of "pseudo-form",
        to collect our "how many" number (E.g. 3) from the user on the user interface

     FINDING/LEARNING:  (See also Assignment 6 /src/app/article.service.ts)

        - When you do use HTML "form" and "hidden input field" ... You get (for free as it were)
            a **NAME=VALUE** PAIR
        - When you do (like I did) on the Angular "pseudo-form" combo bit, construct on your own
            the GET URL to pass a query parameter, you do **NOT** get (for free) that "name=value" pairing.
            What I had done was baldly, blindly, badly JUST SEND THE "value"
            I failed to provide it a "name=" side of things.
            O well.

     */
    console.log('Do we get what we hoped for? req.query.howMany_query: ', req.query.howMany_query) // undefined
    // Better! Do we get what we hoped for? req.query.howMany_query:  4
    apiArticleControllerHereInApi.apiGetFirstNArticles(req, res, next)

})



/* ************************************************** */
/* ******** GET '/api/v1/articles/12345' ************ */
/* ************************************************** */
apiArticlesRouter.get('/:idHere', function(req, res, next) {
    console.log('API Router. GET /:idHere')
    // This is the "skinny" router. From here, we just fire. Nothing returns. Go see Controller...
    apiArticleControllerHereInApi.apiGetArticleById(req, res, next)
})




/* ************************************************** */
/* ******** GET '/api/v1/articles/' ************ */
/* ************************************************** */
apiArticlesRouter.get('/', function(req, res, next) {
    apiArticleControllerHereInApi.apiGetAllArticles(req, res, next)
 })




/* ************************************************** */
/* ******** POST '/api/v1/articles/'  ************ */
/* ************************************************** */
apiArticlesRouter.post('/', middlewareTrimHere.myMiddlewareTrimUrl, function(req, res, next) {
    apiArticleControllerHereInApi.apiCreateArticle(req, res, next)
})
 /*
     We here use a Middleware, to simply trim the URL
 */




/* ************************************************** */
/* ******** PUT '/api/v1/articles/:idToEditHere'  ************ */
/* ************************************************** */
apiArticlesRouter.put('/:idToEditHere', function (req, res, next) {

    apiArticleControllerHereInApi.apiUpdateArticle(req, res, next)
    // We'll get the _id off the URI params over in the Controller (FAT) not here in the Router (SKINNY)
})



/* ************************************************** */
/* ******** DELETE '/api/v1/articles/:idToDeleteHere'  ************ */
/* ************************************************** */
apiArticlesRouter.delete('/:idToDeleteHere', function(req, res, next) {
    apiArticleControllerHereInApi.apiDeleteArticle(req, res, next)
})


module.exports = apiArticlesRouter



/*   NO LONGER USED   'PUT' now instead. See above.

// Here, POST for "PUT" and UPDATE does work.
// But we have (above) improved on that, to a PUT
// Note that here, the "Verb" is in the URI. Not good.
// Instead use the HTTP method 'PUT' to be the Verb. See below.
/!* ************************************************** *!/
/!* ******** POST '/api/v1/articles/edit/:idToEditHere'  ************ *!/
/!* ************************************************** *!/
apiArticlesRouter.post('/edit/:idToEditHere', function (req, res, next) {

    apiArticleControllerHereInApi.apiUpdateArticle(req, res, next)
    // We'll get the _id off the URI params over in the Controller (FAT) not here in the Router (SKINNY)
})
*/
