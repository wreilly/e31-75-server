
/* $$$$$   TOC   $$$$$$$$$$$$$$$$$

 * articlesRouter.get('/', ...) >> articleController.getAllArticles
 *
 * articlesRouter.get('/:idInRouter', ...) >> articleController.getOneArticle
 *
 * articlesRouter.post('/', ...) >> articleController.createArticle
 *
 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */


var mongoose = require('mongoose')
/*
 NOTE TO SELF re: DATABASE Stuff lingering here in Controller ("anti-pattern")

 - YES, I *could* remove mongoose and "model" and data stuff from this Controller file now.
 All the data service stuff is now instead in /data-service/articleService.js.
 BUT. I below have a *LOT* of trial-and-error learning that went on, much of it going to mongoose directly, prior to getting the data service in place.
 So. I'll LEAVE IT. Cheers.
 */

var articleModelHereVar = require('../models/articleModel')
// console.log('hmm articleModelHereVar is ', articleModelHereVar)
/*
 function model(doc, fields, skipId) {
 if (!(this instanceof model)) {
 return new model(doc, fields, skipId); }
 Model.call(this, doc, fields, skipId); }
 */

var articleDataServiceHere = require('../data-service/articleService')





var articleController = {}
/* WORKS. A. */
// https://javascript.info/class#static-methods

// ALSO WORKS. B. V. cool.
/*
function articleController() {}
*/

// ALSO ALSO WORKS. C.
/*
class articleController { static myStaticMethod() {...} }
*/
// See especially the learning and findings from /controllers/api/api-articleController.js
// And they ALL simply use: module.exports = articleController


/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  articleController.createArticle  SAVE One Article POSTed here !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
articleController.createArticle = function(req, res, next) {

    var articleToSave = {}
    var articleUrlToSave = req.body.articleUrl_name
    var articleTitleToSave = req.body.articleTitle_name

    articleToSave.articleUrl = articleUrlToSave
    articleToSave.articleTitle = articleTitleToSave

    articleDataServiceHere.saveArticle(articleToSave)
        .then(
            (whatIGot) => {
                // fulfilled/resolved
                console.log('articleController SAVE :o) article whatIGot: ', whatIGot)

/* NO! Not "render". That tries to find a VIEW by that path. NO.
                res.render(`/articles/${whatIGot._id}`)
*/
// Use "redirect". THAT simply feeds a URL, which the router figures out what to do with (e.g. , go *render* the right View. Sheesh.
                res.redirect(`/articles/${whatIGot._id}`)

            },
            (problemo) => {
                // rejected
                console.log('articleController SAVE :o( article problemo: ', problemo)
            }
        )
        .catch((err) => {
            console.log('articleController SAVE try/catch err: ', err)
            throw new Error('ArticleSAVE', err)
        })
}






/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  articleController.getOneArticle  GET One Article by _id !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* ***  GET '/:idInRouter' = /articles/12345 *** */
articleController.getOneArticle = function(req, res, next) {
    console.log('articleController GET one article. req.params.idInRouter is ', req.params.idInRouter)
    /*
    DATABASE TIME.
    1. Just get this Express App Router/(Controller) to talk directly to Mongoose, hence to MongoDB database.
    2. Finally! April 4th: New & Improved: "Data Service" (a.k.a. "DAO" = Data Access Object). That is, get this Express App Router/(Controller) to talk instead to our new (& improved) *REST API*, which in turn talks to Mongoose, hence to MongoDB database.
     */
    var dbAccessHereInController = false // true
    var dbAccessDownInService = true // false

    var articleToRender = {} // li'l ol' object-y-poo

    // 1. I do it myself, with my hand:
    // Hmm. Not quite right: No. No "new", thanks.
/*
    var myArticleModel = new articleModelHereVar()
    console.log('1. myArticleModel just newed() up be: ', myArticleModel) // { _id: 5abf71235b134804c078dbca }
*/


    // hahd-code th' suckah:
//    myArticleModel.articleTitle = "NYTimes has this to say about that."


/* No. "find is not a function, kid"
Q. wtf?
A. hwl. (hard-won learning) find() is function on Model.prototype, not Model. Ya need an Instance. Not the Class. Cheers.

    myArticleModel.find({_id: req.params.idHere}, function(err, result) {
*/
//    var myArticleModelQuery =
    // MIT CALLBACK:
    // .find() returns [{}]
    // .findById() returns {}


    // NO LONGER USED. Good.
    if(dbAccessHereInController) {
        articleModelHereVar.findById({_id: req.params.idInRouter}, function(err, result) {
            if(err) console.log('ERR getOneArticle so sad. err: ', err)
            console.log('db result for getOneArticle ', result) // []
            // No. Don't "return". Here deeply nested in this wretched callback, right here, just do the deed. Render
            // return result
            res.render('article', { article: result } ) // result[0] } ) // [0] i think << yah, for .find(), but not for .findById(). Cheers.
        })
    }

    // YES. NOW USING THIS. Good.
    if(dbAccessDownInService) {
/* No. You do NOT get back, directly, the data object for the article.
No. You instead "get back" a *Promise*.
You must code for that in an asynchronous way. Not just "whamma-jamma" the expected value onto a variable, and then in the very next line you proceed to *use* that variable. Hah! It ain't gonna have a *value*! Joke's on you.
        var articleToRender = articleDataServiceHere.findArticleById(req.params.idInRouter)
*/
/* Better: */
        articleDataServiceHere.findArticleById(req.params.idInRouter)
            .then(
                (articleIGot) => {
                    /*
                     Son, we are not "rendering" to a URL. We already got the URL (from the router) that got us here (e.g. '/articles/12345').
                     Now it is time to use our Pug engine "views" configuration to render a template. That template is called 'article' (article.pug). We pass the template data, the article data we just got out of the database.
                     */
                    // No. res.render(`/${req.params.idInRouter}`, { article: articleToRender })
                    res.render('article', { article: articleIGot })
                },
                (problemo) => {
                    console.log('Rejected Promise - App Controller Get One Article. problemo: ', problemo)
                }
            )
            .catch((err) => {
                console.log('Catch Err App Controller Get One Article. Err: ', err)
                throw new Error('Thrown Error. Catch Err App Controller Get One Article', err) // TODO make more better. need an error code/msg of sorts.
            })
    }


} // /getOneArticle()



/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* !!!!!  articleController.getAllArticles  GET All Articles !!!!! */
/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
/* ***  GET '/' = /articles/ *** */
/* Works: */
articleController.getAllArticles = function (req, res, next) {

/*
Going a little CRAZY re: "static" methods.
Q. Possible? That the above line is ALREADY a "static" method ??
A. *I think* = YES. You just made yourself a nice little static method, by whamma-jamma-ing it DIRECTLY onto the class, the function, the "articleController" here.
Be that:
A. var articleController = {} // POJSO Plain Old JavaScript Object
B. function articleController() {} // POJSF Plain Old JavaScript function
C. class articleController {} // POJSC Plain Old JavaScript Class (I guess)
*I think* MBU. ("My Best Understanding")
See: https://javascript.info/class#static-methods
-------
1. SAME AS 2. "static" BELOW:
---------
1.
 function User() { }

 User.staticMethod = function() {
 alert(this === User);
 };
 ----------
 2.
 class User {
 static staticMethod() {
 alert(this === User);
 }
 }

 User.staticMethod(); // true
 ------------
 */
// static getAllArticles =  function (req, res, next) {
    console.log('We hear you /articles (sez getAllArticles from Controller)')

    var runModelCallback = false // Callback, on Model
    var runModelPromises = false // Promises, on Model
    var runModelPromisesFromService = false // Promises, on Model - FROM SERVICE

    /* VELLY INTELLESTING
    You really ought not have BOTH these bad boys set to true.
    But, it does sort of work.
    Occasional hiccup.
    App shows JSON (occasionally)
    API GET shows rendered HTML (occasionally)
    Mostly, they both DO THE RIGHT THING.
    Cheers.
    TODO time to make a FAT CONTROLLER for API.
    Cheers encore une fois.
    201804011148
     */
    var runModelPromisesFromServiceRenderHereInAppController = true // whoa
    var runModelPromisesFromServiceApiResSendHereInAppController = false // okay we'll turn it OFF now. // true // double whoa





    var runQueryCallback = false // Callback, on Query
    var runQueryPromises = false // Promises, on Query

    var articlesFromDb = []

    // http://mongoosejs.com/docs/queries.html
    if(runModelCallback) {
        console.log('runModelCallback time!')
        // First, a callback
        articleModelHereVar.find({}, ' ', function(err, articlesFound) {
            if(err) { console.log('ERR!', err); next(); }
            console.log('SUCCESS! articlesFound[0] are: ', articlesFound[0]) // YES
            articlesFromDb = articlesFound // whamma-jamma Array ?
            res.render('articles', { articles: articlesFromDb })

            /*
             [ { _id: 5ab991ab176b6011a4c561c2,
             articleUrl: 'https://www.nytimes.com/2018/03/26/world/asia/hong-kong-housing-crisis-ideas.html',
             articleTitle: 'Live in a Drainpipe? Five EDITED Quirky Ideas to Solve Hong Kong’s Housing Crisis',
             articleCategory: 'World',
             __v: 0 },
             */
        })
    }

    if(runModelPromisesFromServiceApiResSendHereInAppController) {
        console.log('runModelPromisesFromServiceApiResSendHereInAppController time!')

        articleDataServiceHere.findAllArticles()
            .then((whatIGotFromService) => {
                // resolved. let's do API res.send [] array data already!
                console.log('app controller! whatIGotFromService[0] ', whatIGotFromService[0])
                res.send(whatIGotFromService)
                next()
            },
                (problemoFromService) => {
            // rejected hmm?
                })
    }


    if(runModelPromisesFromServiceRenderHereInAppController) {
        console.log('runModelPromisesFromServiceRenderHereInAppController time!')

//        return articleDataServiceHere.findAllArticles()
        articleDataServiceHere.findAllArticles()
            .then((whatIGotFromService) => {
                    // resolved. let's render app page already!
                    console.log('app controller! whatIGotFromService[0] ', whatIGotFromService[0])
                    res.render('articles', { articles: whatIGotFromService})
                /* YES
                "render" is not (apparently) a "terminal" line, like a "return" would be.
                who knew?
                 */
                console.log('REALLY CWAZY. App Controller. Whoa. Are we (really?) about to do "next()"? Huh? Are we?')
                // IF WE COMMENT IT OUT? (wtf? it still puts the article in to the database. hmm . how . wtf . ).
                    //    next() // >> A. YAS WE DO. << Q. ?? ever get to this line? doubt it. (upon error perhaps?)
                },
                (problemoFromService) => {
                    // rejected hmm?
                    /* What is the story with this error:
                    - from "down" in articleService...
                    - findAllArticles()
                    - rejected Promise
                    - "up" here in the calling articleController...
                    - getAllArticles()
                    - we also (?) receieve this rejected Promise (?)
                    ?
                     */
                    throw new Error('AllArticlesGetError',  problemoFromService)
                    /*
                    For convenience, just posting here: what fuller human-readable (sorta) language is found over in the Router's catch-all Error Handler:
                    For this "message/code": AllArticlesGetError
                    We provide this fuller message:
                     'articleController.getAllArticles calling articleService.findAllArticles rejected Promise.'
                     */
                })
    }



// WORKS 201804011119.tar.gz cheers.
    if(runModelPromisesFromService) {
        console.log('runModelPromisesFromService time!')

        return articleDataServiceHere.findAllArticles()
    }


    if(runModelPromises) {
        console.log('runModelPromises time!')
        return articleModelHereVar.find({})
            .then(
                (whatIGot) => {
                    // resolved
                    console.log('runModelPromises whatIGot[0]? ', whatIGot[0]) // yep
                    console.log('typeof whatIGot ', typeof whatIGot)
                    articlesFromDb = whatIGot
                    console.log('typeof articlesFromDb ', typeof articlesFromDb)
                    var yeppers = articlesFromDb instanceof Array
                    console.log('articlesFromDb instanceof Array ', yeppers)

                    console.log('runModelPromises articlesFromDb[0]? ', articlesFromDb[0]) // yep
                    return articlesFromDb
                },
                (problemo) => {
                    // rejected
                    console.log('ERR in rejected Promise so sad. problemo: ', problemo)
                }
            )
            /* We Refactor This Back to the ARTICLES.JS Router
             .then((whatIGotHereNow) => {
             res.render('articles', { articles: whatIGotHereNow })
             })
             */
            .catch((err) => {
                console.log('ERR in catch so sad ', err)
            })
    }


    if(runQueryCallback) {
        console.log('runQueryCallback time!')
        var queryHereFromFind = articleModelHereVar.find()
        queryHereFromFind.exec((err, results) => {
            if(err) {console.log('dang! err here: ', err)}
            console.log('results looking pretty good (e.g. [0]: ', results[0])
            res.render('articles', { articles: results })
            }
        )
    }


    if(runQueryPromises) {
        console.log('runQueryPromises time!')
/*
        var queryHereFromFind = articleModelHereVar.find({}) // an actual query e.g. {} gets you all docs
*/
        var queryHereFromFind = articleModelHereVar.find() // empty, I think maybe also gives you default (actual) query, but in any event just executing .find() does return you a Query so there you go.
        console.log('queryHereFromFind is vot? ', queryHereFromFind)




        /*
        Hoot. I do believe I gots one Very Good Reason (To).

        "// You can instantiate a query directly. There is no need to do
         // this unless you're an advanced user with a very good reason to.
         const query = new mongoose.Query();"
         http://mongoosejs.com/docs/api.html#query_Query

My "very good reason (to)" was, well, simply to LEARN about wtf it is and how it works.
See my console.logged() notes in MongooseQUERYfromMODELandfromNEWQUERY.txt
Cheers.
         */
        // NOT USED. Cheers.
        var queryHereFromNew = new mongoose.Query()
/*
        console.log('queryHereFromNew is vot, exacterly? ', queryHereFromNew)
*/
        /*
         queryHereFromNew is vot, exacterly?  Query {
         _mongooseOptions: {},
         op: undefined,
         options: {},
         _conditions: {},
         _fields: undefined,
         _update: undefined,
         _path: undefined,
         _distinct: undefined,
         _collection: undefined,
         _traceFunction: undefined }
         */


        queryHereFromFind
        //.find({}) // << not needed; the "parent" as 'twere model.find() (empty) did run that "get 'em all" (actual) query for me. waddayano.
            .exec()
            .then(
                (whatIGot) => {
                    console.log('whatIGot[0] ', whatIGot[0])
                    return whatIGot
            },
                (problemo) => {
                    console.log('problemo here ', problemo)
                }
            )
            .then((whatIGotHere) => {
                res.render('articles', { articles: whatIGotHere})
            })
    }

}




module.exports = articleController
