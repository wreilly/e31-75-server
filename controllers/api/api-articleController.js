var articleDataServiceHereInApiController = require('../../data-service/articleService')

// TOC = Table Of Contents

/* $$$$$   TOC   $$$$$$$$$$$$$$$$$

 * apiArticlesRouter.get('/edit?articleId_query', ...)  >> apiArticleController.apiGetArticleToEdit
 *
 * NEW: 2018-04-20
 * apiArticlesRouter.get('/first-n?howMany_query', ...) >> apiArticleController.apiGetFirstNArticles
 *
 * apiArticlesRouter.get('/:idHere', ...)  >> apiArticleController.apiGetArticleById
 *
 * apiArticlesRouter.get('/', ...) >> apiArticleController.apiGetAllArticles
 *
 * apiArticlesRouter.post('/', ...) >> apiArticleController.apiCreateArticle
 *
 * apiArticlesRouter.put('/:idToEditHere', ...) >> apiArticleController.apiUpdateArticle
 *
 * apiArticlesRouter.delete('/:idToDeleteHere, ...) >> apiArticlesController.apiDeleteArticle

 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */


var apiArticleController = {}
/* MODULE AS PLAIN OLD JAVASCRIPT OBJECT. EXPORT AS POJSO. STATIC METHODS. */

/* Trying to use module as function was causing Trouble.
See bottom of file for notes.

 function apiArticleController() {
 VERY HELPFUL:
 https://stackoverflow.com/questions/20534702/node-js-use-of-module-exports-as-a-constructor
 Node.js - use of module.exports as a constructor
 According to the Node.js manual: If you want the root of your module's export to be a function (such as a constructor) or if you want to export a complete object in one assignment instead of ...
 */


/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController.apiGetArticleToEdit   !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiGetArticleToEdit = function(req, res, next) {

    var articleIdToEdit = req.query.articleId_query
    // From article.pug form hidden input field

    articleDataServiceHereInApiController.findArticleById(articleIdToEdit)
        .then(
            (whatIGot) => {
                // fulfilled/resolved
                /*
                Please note: Even though we are in the *API* Controller,
                 for THIS step 1 part of Edit, we DO want to still use Express App Router Render.
                 On the SUBSEQUENT step part 2 of Edit, we *will* just "Send data" via HTTP from the API back to client-side JavaScript.

                 That is:
                 - 1. THIS step is: Pls render me a web app page with the "Edit Article" form in it, populated with this article.
                 - 2. NEXT step will be upon 'submit' of that form, to "just send" data, and that data will just be stuck on the page (added to DOM) by client-side JavaScript.
                 */
                res.render('articleedit.pug', { article: whatIGot})
            },
            (problemo) => {
                // rejected
                console.log('api Controller find article to edit rejected. problemo: ', problemo)
            }
        )
        .catch((err) => console.log('CATCH api Controller find article to edit. err: ', err))
}



/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController.apiGetFirstNArticles  !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiGetFirstNArticles = function(req, res, next) {

    var howManyToGet = req.query.howMany_query
    // For Assignment 5 (Express, no Angular): On article.pug form, hidden input field
    // For Assignment 6 (Angular): On app.component.html, button on-click ... (t.b.d. ?)

    articleDataServiceHereInApiController.findFirstNArticles(howManyToGet)
        .then(
            (whatIGot) => {
                // resolved
                console.log('First N - First N ? whatIGot ', whatIGot) // Boo. It is ALL 17, not first 2.
                res.send(whatIGot) // "first n articles ..."
            },
            (problemo) => {
                // rejected
                console.log('First N - problemo in rejected Promise ', problemo)
            }
        )
        .catch((err) => console.log('First N - Err in Catch API Controller ', err))
}





/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController.apiGetArticleById   !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiGetArticleById = function (req, res, next) {

    var idThisTime = req.params.idHere
    articleDataServiceHereInApiController.findArticleById(idThisTime)
        .then(
            (whatIGot) => {
                if(!whatIGot) {
                    // empty document. found nothing. 0 results
                    console.log("404 sorry not for that id: " + idThisTime)
                    res.status(404).send("sorry not for that id: " + idThisTime)
                }
                res.send(whatIGot)
            },
            (problemo) => {
                // rejected
                console.log('api Controller getArticleById problemo ', problemo)
            }
        )
        .catch((err) => console.log('catch err ', err))
} // /get article by _id





/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController.apiGetAllArticles   !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiGetAllArticles = function (req, res, next) {

    articleDataServiceHereInApiController.findAllArticles()
        .then(
            (whatIGot) => {
                // resolved

                // Note: My client-side JavaScript does do JSON.stringify().
                // /public/javascript/utils.js
                // So it does work to just send the JavaScript Object (whatIGot)
                // res.send(whatIGot)
                console.log('1. Controller whatIGot (from data service) ', whatIGot)
                /*
                A JavaScript OBJECT:
                 whatIGot
                 :
                 Array(20)
                 0
                 :
                 model {$__: InternalCache, isNew: false, errors: undefined, _doc: {…}, $init: true}
                 1
                 :
                 model
                 $__
                 :
                 InternalCache {strictMode: true, selected: {…}, shardval: undefined, saveError: undefined, validationError: undefined, …}
                 $init
                 :
                 true
                 articleTitle
                 :
                 "Expelling, well, kinda not really 01234567896553 MODERATE Russians was the Right Thing do do"
                 articleUrl
                 :
                 "https://www.nytimes.com/2018/03/26/world/europe/europe-russia-expulsions.html"
                 errors
                 :
                 undefined
                 */
                var strungWhatIGot = JSON.stringify(whatIGot)
                console.log('2. strungWhatIGot ', whatIGot)
                /* Yes, a STRING. Out of all the extra data in that Object, here is the sort of ".toString()" version, at least of the whatIGot.data I guess, that JSON.stringify apparently delivers:
                 "[{"_id":"5ab991e7176b6011a4c561c3","articleUrl":"https://www.nytimes.com/video/us/100000005813009/stephon-clark-killed-police-sacramento...}]"
                 */
                res.send(JSON.stringify(whatIGot)) // YES (so long as client-side correctly set up)
                // res.send(strungWhatIGot) // YES same story
                // res.send(whatIGot) // YES also (even not "stringified()")
            },
            (problemo) => {
                // rejected
                console.log('problemo in rejected Promise ', problemo)
            }
        )
        .catch((err) => console.log('Err in Catch API Controller ', err))
}



/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController.apiCreateArticle   !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiCreateArticle = function(req, res, next) {

    /* Note on using CURL:
     $ curl --data "articleUrl_name=http://nytimes.com/curl234&articleTitle_name=Our Curled Headline With Spaces AND MORE_name" http://0.0.0.0:8089/api/v1/articles/

     {"_id":"5aca109b01c8184ec530f4be","articleUrl":"http://nytimes.com/curl234","articleTitle":"Our Curled Headline With Spaces AND MORE_name","__v":0}
     */

    var articleToSave = {}
    articleToSave.articleUrl = req.body.articleUrl_name
    articleToSave.articleTitle = req.body.articleTitle_name

    articleDataServiceHereInApiController.saveArticle(articleToSave)
        .then(
            (whatIGot) => {
                console.log('Article Saved! ', whatIGot)
                res.send(whatIGot)
            },
            (problemo) => {
                console.log('Rejected Promise API Create Article. problemo: ', problemo)
            }
        )
        .catch((err) => {
            console.log('Catch Err API Create Article. err: ', err)
            throw new Error('Thrown Error. API Create Article', err)
        })
}



/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController.apiUpdateArticle      !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiUpdateArticle = function(req, res, next) {
    /*
     https://canvas.harvard.edu/courses/35096/pages/week-9-rest-api-routes?module_item_id=369603
     http://mongoosejs.com/docs/documents.html#updating
     */

    // GET _ID OFF URI PARAM
    var idForUpdate = req.params.idToEditHere

    // Get Form Data off req.body
    var articleDataToUpdate = {}
    /* Note: Naming Convention
    You must keep this naming convention I use TO THE END:
    - form field name I use: name="articleTitle_name"
    - that name ("articleTitle_name") is the variable, pointer to, the string value
    - KEEP that name (articleTitle_name) TO THE END of all this app processing
    - Only on the last place where you finally actually put the value onto what is HEADED TO THE DATABASE do we finally drop the suffix "_name" and just call it "articleTitle"
    - Why?
    - Because it is (only) over in the database that it is actually called "articleTitle"
    - Everything out in the app enroute to the database (create/save, edit/update) I use this naming convention of calling it "articleTitle_name"
     */
    articleDataToUpdate.articleTitle_name = req.body.articleTitle_name

    return articleDataServiceHereInApiController.updateArticle(idForUpdate, articleDataToUpdate)
        .then((whatIGot) => {
            res.send(whatIGot)
    })
}



/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  apiArticleController.apiDeleteArticle      !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
apiArticleController.apiDeleteArticle = function(req, res, next) {

    var idSomething = req.params.idToDeleteHere
    console.log('idSomething is sure ', idSomething)

    // http://mongoosejs.com/docs/api.html#findbyidandremove_findByIdAndRemove
    articleDataServiceHereInApiController.deleteArticle(idSomething)
        .then(
            (returnedDocument) => {
                res.send(returnedDocument) // back to client-side JavaScript
            }
        )
        .catch((err) => console.log('apiController Delete CATCH err: ', err))
}





module.exports = apiArticleController


/*   Notes:

MODULE AS FUNCTION.
EXPORTS A CONSTRUCTOR I GUESS YOU'D CALL IT.
Then use .PROTOTYPE. METHOD. On the Instance(s) */
/*
 function apiArticleController() {
 // Got It To Work.   I'm to use a .prototype. method (on the instances) Hmm.

 apiArticleController.prototype.apiGetAllArticles = function (req, res, next) {
     articleDataServiceHereInApiController.findAllArticles()
        .then(
            (whatIGot) => {
 // resolved
 res.send(whatIGot)
 },
 (problemo) => {
 // rejected
 console.log('problemo in rejected Promise ', problemo)
 next()
          }
     )
     .catch((err) => console.log('Err in Catch API Controller ', err))
    }
 }

 module.exports = apiArticleController
 */

/*
Related Notes from the Router:
 */
/* FOR CONTROLLER EXPORTED AS FUNCTION/CONSTRUCTOR  -  NEW () .PROTOTYPE. METHOD */
/* YES WORKS
 apiArticlesRouter.get('/', function(req, res, next) {
    console.log('ahoy? 777 FUNCTION CONSTRUCTOR')
    var apiArticleControllerHereInApiInstance = new apiArticleControllerHereInApi()
    apiArticleControllerHereInApiInstance.apiGetAllArticles(req, res, next)
 })
 */

