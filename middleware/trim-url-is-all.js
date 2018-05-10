

/*
 Middleware, to simply trim the usually long NYTimes URL.
 * Used in:
  * API Router
  * Express Web App Router
 */

var middlewareModule = {}

middlewareModule.myMiddlewareTrimUrl = function(req, res, next) {
// Clean up the NY Times URL
    /*
     * Typical Input:
     https://www.nytimes.com/2018/03/26/world/europe/trump-russia-diplomats-expulsion.html?hp&action=click&pgtype=Homepage&clickSource=story-heading&module=first-column-region&region=top-news&WT.nav=top-news

     * Desired Output:
     https://www.nytimes.com/2018/03/26/world/europe/trump-russia-diplomats-expulsion.html

     * RegEx: */
// NAIVELY FIRST THOUGHT:       string.replace(/(.)\?/, $1)
// AFTER MUCH STRUGGLE, SEARCH: string.replace(/(.*?\?(?:(?!\?))).*/, '$1')
    // btw,  it is the *2nd* '?' question mark in that crazy string
//        that represents the '?' in the NYTimes URL we are trying to find. Cheers.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace
//

    console.log('PRE-REGEX! req.body.articleUrl_name as passed in was: ', req.body.articleUrl_name)
    // Wherefore the 'bang' ! ?
/* Yah. That G.D. bang was messing it up. How did it get there ??? O la.
    req.body.articleUrl_name = req.body.articleUrl_name.replace(/(.*?\?(?:(?!\?))).*!/, '$1')
*/
// Bang-free: YES. WORKS. LOVELY.
    req.body.articleUrl_name = req.body.articleUrl_name.replace(/(.*?\?(?:(?!\?))).*/, '$1')

    console.log('MIDDLEWARE! POST-REGEX! req.body.articleUrl_name now is: ', req.body.articleUrl_name)

// .replace(/(.*?\?(?:(?!\?))).*/, '$1')
// WE GET:   https://www.nytimes.com/section/politics?  << Note the final ? is still on the string.
// HAD BEEN: https://www.nytimes.com/section/politics?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=Politics&WT.nav=page

    // IF we have a pasted-in URL that does end in '?',
    // THEN let's get rid of that last character ? we couldn't kill in the regex
    if(req.body.articleUrl_name.substr(req.body.articleUrl_name.length - 1) === '?') {
        req.body.articleUrl_name = req.body.articleUrl_name.slice(0, -1)
        // https://stackoverflow.com/questions/952924/javascript-chop-slice-trim-off-last-character-in-string
        console.log('MIDDLEWARE! POST-SLICE(0, -1)!? req.body.articleUrl_name now is: ', req.body.articleUrl_name)
    } else {
        console.log('url did not end in ? - we didn\'t alter it')
    }

    next();

}

module.exports = middlewareModule