var mongoose = require('mongoose')

var articleSchema = new mongoose.Schema({
    articleUrl: {
        type: String,
        required: true
    },
    articleTitle: {
        type: String,
        required: true
    },
    // MULTER-TIME *****
    // https://stackoverflow.com/questions/35509611/mongoose-save-array-of-strings
    /* E.g.,
    ['wr__1525770461453-Photo 3.jpg', 'wr__1525770461459-Photo 4.jpg']
     */
    articlePhotos: [String]
})

// console.log('Let\'s de bug a bit.')
/* Naming:

1.  I can use a variable name as I like, here in the code (e.g. "articleModelVarHere"), to make clear to me what is what, how this works. (At least while learning, student projects, etc.)

2.  *But*, I should *not* use a *Model* name of that sort, and should instead put in a plain descriptive name (e.g. "Article"). (Capital letter the convention.)
 * Why?
  * Because that name ("Article") will be used by Mongoose/MongoDB to create for me a Database Collection that is the lower-cased plural of my name choice (e.g. "db.articles").
 */

// A. NOPE: Capital letter 'M'
// var articleModelVarHere = new mongoose.Model('Article', articleSchema)
/*
 TypeError: 2nd argument to `Model` must be a POJO or string, **not** a schema. Make sure you're calling `mongoose.model()`, not `mongoose.Model()`.
 */
// B. NOPE: Lower-case letter 'm'
// var articleModelVarHere = new mongoose.model('Article', articleSchema)
// http://mongoosejs.com/docs/models.html
// "The .model() function makes a copy of schema."
// C. YEP: Lower-case letter 'm', but *without* 'new'
var articleModelVarHere = mongoose.model('Article', articleSchema)


module.exports = articleModelVarHere