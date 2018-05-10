/*
  ############################################
  NOTE: NO LONGER USED
  We have "re-factored" all this BACK INTO the
  Router file api-articles.js
  No longer using Multer from this "middleware" file.
  20180510-0704
  ############################################
 */


// MULTER-TIME *****


/* SEE:
 $ pwd
 /Users/william.reilly/dev/JavaScript/CSCI-E31/07-Week-POST/wr-02-nytimes/
 /routes/articles.js
 /controllers/articleController.js
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


var myMulterMiddleware = { }

myMulterMiddleware.myMultify = function(req, res, next) {
    console.log('here in Multer middleware ... body params... ')
    console.log('req ', req) // Yes, req gets here, but nothing on body, no files
    /*  POST '/articlesimage'
     IncomingMessage {_readableState: ReadableState, readable: true, domain: null, _events: {…}, _eventsCount: 0, …}
     baseUrl
     :
     "/api/v1/articles" ...
     */
    console.log('req.body ', req.body) // empty Object  POST '/articlesimage'
    console.log('req.params ', req.params) // empty Object POST '/articlesimage'
    /* Bueno: (earlier...) from POST '/'
     { articleUrl_name: 'http://nytimes.com',
     articleTitle_name: 'We Have No Photosssscdfre' }
     {}
     */

    console.log('BEFORE req.files ? ', req.files) // undefined
    // Sorry. Max of 3 photos per Article
    myPhotosUploadMulter.array('file', 3)
/*
    myPhotosUploadMulter.array('articlePhotos_name', 3)
*/
    console.log('AFTER Multer Upload ? req.files ? ', req.files) // undefined

    next()
}

module.exports = myMulterMiddleware