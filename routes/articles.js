var express = require('express')
var articlesRouter = express.Router()

var middlewareTrimHere = require('../middleware/trim-url-is-all')

var articleControllerHere = require('../controllers/articleController')

/* $$$$$   TOC   $$$$$$$$$$$$$$$$$

 * articlesRouter.get('/', ...)
 *
 * articlesRouter.get('/:idInRouter', ...)
 *
 * articlesRouter.post('/', ...)
 *
 *
 * articlesRouter.use(function(err, req, res, next) <ERROR HANDLER>

 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */

/* ******* PLEASE. Put this more SPECIFIC Route FIRST **** */



/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@  articlesRouter.get('/') Get All Articles  @@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* *** GET /articles/ *** */
/* USED TO BE:
articlesRouter.get('/', articleControllerHere.getAllArticles);
*/
/* NOW IS: */
articlesRouter.get('/', function (req, res, next) {
    /* Hmm. No. Attempt here at Promise. Hmm. Do I have to *create* a Promise? Here? Over in articleController?? Over in articleService??? Hmm.
    "TypeError: Cannot read property 'then' of undefined"
    OY! I (ONCE AGAIN) FORGOT A "RETURN"
    OY!
     */
/* GOT THIS TO WORK 201804011119.tar.gz cheers
 articleControllerHere.getAllArticles()
        .then((allThoseArticlesFromDb) => {
            res.render('articles', { articles: allThoseArticlesFromDb })
        })
*/

    articleControllerHere.getAllArticles(req, res, next) // let 'er rip. ?
    // DON'T FORGET. YOU MUST pass (req, res, next)
    // Cheers.

});

/*
// No. Solly.
articlesRouter.get('/', articleControllerHere.getAllArticles(req, res, next))
/!* NOPE.
"ReferenceError: req is not defined"
 *!/
*/


/*
    .then((allThoseArticlesFromDb) => {
        /!* Refactored Back Here to the ARTICLES.JS Router, from that durned Controller. cheers *!/
        res.render('articles', { articles: whatIGotHereNow })
    })
*/

/*
setTimeout(function(allThoseArticlesFromDb) {
    console.log('you are two seconds older. and allThoseArticlesFromDb[0] are: ', allThoseArticlesFromDb[0])
},2000)
*/

/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@  articlesRouter.get('/:id') Get One Article  @@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* *** GET /articles/12345 *** */
articlesRouter.get('/:idInRouter', articleControllerHere.getOneArticle)


/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@  articlesRouter.post('/') Create One Article  @@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
articlesRouter.post('/', middlewareTrimHere.myMiddlewareTrimUrl, articleControllerHere.createArticle)




/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
/* @@@@@  articlesRouter.use(ERROR HANDLER)  @@@@@@@@@@@ */
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
articlesRouter.use(function(err, req, res, next){
    // You ONLY GET HERE if you DO HAVE an 'err'. Cheers.
    // TODO Flash messaging ...
    console.error(err.stack) // first things first
    console.log('Welcome to the Error Handler. Your err.message is: ', err.message)
    /*
    E.g. when I request a WRONG _id:

    1) I initially (line above) get CastError from mongoose cast.js etc.
    2) But further below ("catch-all") I am getting the Pug error about trying to render the article.pug and not finding value for 'article'

    Not sure how/why the error reporting switches off, and/or how I can control that to get at the root cause, not just the surface effect. Hmm.
     */

    switch(err.message) {
        case 'ArticleSaveError':
            console.log('Error Handler. We see you hit the ' + err.message + ' error. Sigh.')
            /*
            req.flash('ArticleSaveError', 'Friendlier human-readable error message. Your article couldn\'t be saved...')
             */
            res.redirect('/articles')
            break
        case 'ArticleDeleteError':
            console.log('Error Handler. We see you hit the ' + err.message + ' error. Sigh.')
            /*
             req.flash('ArticleDeleteError', 'Friendlier human-readable error message. Your article couldn\'t be deleted...')
             */
            res.redirect('/articles')
            break
        case 'AllArticlesGetError':
            console.log('articleController.getAllArticles calling articleService.findAllArticles rejected Promise. \'problemoFromService\' is: ', problemoFromService)
        case 'AllArticlesFindError':
            console.log('articleService.findAllArticles, as called by articleController.getAllArticles - rejected Promise. \'problemo\' in Service is: ', problemo)

        default:
            console.log('Error Handler. Default catch-all. Some other error occurred. ', err.message)
            console.log('err.name: ', err.name)
            console.log('err.reason: ', err.reason)
            console.log('err.stringValue: ', err.stringValue)

            res.redirect('/') // TODO '/error' (better: Flash msg)
    }
})

module.exports = articlesRouter

