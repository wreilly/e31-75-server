var express = require('express')
var apiArticlesRouter = express.Router()

var middlewareTrimHere = require('../../middleware/trim-url-is-all')
/* ################################################################## */
/*
var middlewareMulterHere = require('../../middleware/my-multer')
*/
/* ################################################################## */

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


/* ################################################################## */
/* ###############  BRING MULTER BACK IN TO ROUTER, SIMPLY ########## */
/* ################################################################## */
/*
 Re: POST '/api/v1/articles/articleimages' (below?) << Triggered by "Choose Files"

 Goal is to simplify, no longer import a module, etc.
 That way my POST line here in the router can just directly invoke the Multer
 object. I wonder will that help. Ye gods.
 That is:
 IS NOW:        middlewareMulterHere.myMultify,
 SHOULD BECOME: myPhotosUploadMulter.array('file', 3)

 cf. usage in older simpler project:
 /Users/william.reilly/dev/JavaScript/CSCI-E31/07-Week-POST/wr-02-nytimes
 The multer object is right here in the Route POST / line:
 articlesRouter.post('/postarticlesmulter', myUpload.array('articlePhotoFiles_nameM'), (req, res, next) => {
 */

var myMulter = require('multer');
var myMkdirp = require('mkdirp')

var myDiskStorage = myMulter.diskStorage({
    destination: myDestinationFunction,
    filename: myFilenameFunction
})

var myPhotosUploadMulter = myMulter({
    storage: myDiskStorage,
    fileFilter: myFileFilterFunction
})

function myDestinationFunction(req, file, callback) {
    const destination = 'public/img';

    myMkdirp(destination, function(err) {
        if(err) {
            console.log('dang. myMkdirp failed. ', err)
        } else {
            console.log('good. myMkdirp destination is: ', destination)
            callback(null, destination)
        }
    })
}


function myFilenameFunction(req, file, callback) {
    callback(null, 'sometimes__' + Date.now() + '_' + file.originalname)
}

function myFileFilterFunction(req, file, callback) {
    // TODO filter on .JPG, .PNG etc. T.B.D.
    callback(null, true) // Just accept anything, for now
}


// Sorry. Max of 3 photos per Article
/* myPhotosUploadMulter.array('file', 3) */
/*
 myPhotosUploadMulter.array('articlePhotos_name', 3)
 */

/* ################################################################## */
/* ###############  /BRING MULTER BACK IN TO ROUTER, SIMPLY ########## */
/* ################################################################## */




/* ************************************************** */
/* ******** POST '/api/v1/articles/articleimages'  ************ */
/* ************************************************** */
apiArticlesRouter.post(
    '/articleimages',
/* Did NOT work to factor Multer out to another module/file/thing. No.
    middlewareMulterHere.myMultify,
*/

// NEW: 20180510-0639. Do note: Multer setup code must be ABOVE this line! o la.
    myPhotosUploadMulter.array('file', 3),
    function(req, res, next) {
/*  NO LONGER LOG this VERY VERY VERY Long thing (req)
        console.log('REST API ROUTER POST /articleimages req ? has what? ', req) //
*/
        /* KEY FINDING:
        1) If you invoke this Route off the "Choose Files" click ... it works for the files.   (Body empty because you have no fielded data)
        2) If you invoke this Routes off the "Submit whole Form" click ... it does not work for the files. The fielded data is successfully on the body.
*/
         /*   # 1 :  Off the "Choose Files" click:  BODY = NO, FILES = YES
         IncomingMessage
         baseUrl
         :
         "/api/v1/articles"
         body
         :
         {} ...
         FINALLY! has files: []  Davvero.
         */

/*
# 2)  Off "Submit whole Form" click: BODY = YES, FILES = NO
         REST API ROUTER POST /articleimages req ? has what?
         IncomingMessage
         baseUrl
         :
         undefined
         body
         :
         articlePhotos_name
         :
         "C:\fakepath\010006-MexAmerican.jpg"
         articleTitle_name
         :
         "we are in the house"
         articleUrl_name
         :
         "http://nytimes.com"
         file
         :
         "C:\fakepath\010006-MexAmerican.jpg"
         client
         :
         Socket {connecting: false, _hadError: false, _handle: null, _parent: null, _host: null, …}
         complete
         :
         true
         connection
         :
         Socket {connecting: false, _hadError: false, _handle: null, _parent: null, _host: null, …}
         domain
         :
         null
         files
         :
         Array(0)
         length
         :
         0
         */

        console.log('REST API ROUTER POST /articleimages req.files ? has what? ', req.files) // undefined << Not any more! :o)
        /*
        OMG IT WORKED. YE GODS DAVVERO.


         REST API ROUTER POST /articleimages req.files ? has what?
         [{…}]
         0
         :
         destination
         :
         "public/img"
         encoding
         :
         "7bit"
         fieldname
         :
         "file"
         filename
         :
         "sometimes__1525949021227_010006-MexAmerican.jpg"
         mimetype
         :
         "image/jpeg"
         originalname
         :
         "010006-MexAmerican.jpg"
         path
         :
         "public/img/sometimes__1525949021227_010006-MexAmerican.jpg"
         size
         :
         115777

AND, LOOKEE HERE:
         WREILLY-MC-L:e31-75-server william.reilly$ ls public/img/
         sometimes__1525949021227_010006-MexAmerican.jpg

A PICTURE! How nice.
         */

        console.log('REST API ROUTER POST /articleimages req.body ? has what? ', req.body) // empty {}
        apiArticleControllerHereInApi.apiUploadedArticleImagesNowDoNothing(req, res, next)
    }
)
/*  MULTER-TIME *****
 We are now (trying to) use a Middleware here to do MULTER stuff
 on the uploaded photo(s)...
 */

/* ************************************************** */
/* ******** POST '/api/v1/articles/'  ************ */
/* ************************************************** */
apiArticlesRouter.post(
    '/',
    // NEW 20180510-0801 whoa.
    // Hmm. We used Multer on previous step (/articleimages ).
    // That worked. We have the file(s) now at /public/img
    // We have no need to run Multer again here. Commenting out.
    /*
    Hmm. With it Commented out, wasn't getting nothing:
     REST API ROUTER POST / req.files ? has what?  undefined
     REST API ROUTER POST / req.body ? has what?  {}
     */
    // Not so fast, keemosabbie.
    myPhotosUploadMulter.array('file', 3),
    /*
    That's better!  (NOT Commented Out)
     REST API ROUTER POST / req.files ? has what?  []
     REST API ROUTER POST / req.body ? has what?  { articleUrl_name: 'http://nytimes.com',
     articleTitle_name: 'gtyhnn',
     articlePhotos_name: 'C:\\fakepath\\010006-MexAmerican.jpg',
     file: 'C:\\fakepath\\010006-MexAmerican.jpg' }
     */
/*    middlewareMulterHere.myMultify, // << Did NOT work to factor Multer out to another module/file/thing. No. */
    // TEMPORARY CUT IT OUT . I don't know why not working. Was in past. Sheesh.
    middlewareTrimHere.myMiddlewareTrimUrl,
    function(req, res, next) {
        console.log('REST API ROUTER POST / req.files ? has what? ', req.files) // []  empty :o(
        console.log('REST API ROUTER POST / req.body ? has what? ', req.body)
        /*
         { articleUrl_name: 'http://nytimes.com',
         articleTitle_name: 'gt',
         articlePhotos_name: 'C:\\fakepath\\010006-MexAmerican.jpg',
         file: 'C:\\fakepath\\010006-MexAmerican.jpg' }
         */

        apiArticleControllerHereInApi.apiCreateArticle(req, res, next)
    }
    )
/*  MULTER-TIME *****
We are now (trying to) use a Middleware here to do MULTER stuff
on the uploaded photo(s)...
 */
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
