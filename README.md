### Backend Project of reactmovietime
This is a Node.js x Express project created by express-generator. It's used to build a application server of reactmovietime.


### API
## GET

GET /theaters
retrieve the theaters nearby
GET /movies
retrieve the movies currently on nearby(distance configurable if is registered)
GET /about
about page.
GET /poster?filmID=
retrieve specific film poster
GET /movie?filmID=

GET /search?partialFilmNameInZH_TW
elasticsearch/sonic ?
## POST

POST /login
check if already, use passport.js?
POST /koremitai/filmID
check if already, add to the movie's fav counter
POST /logout

POST /forgetpwd
send reset mail.
## PATCH

PATCH /user/userID
update user profile

## DELETE

DELETE /koremitai/filmID
check if already
DELETE /user/userID
check if logged in.


###Contents Utilities

## getMovies.js

#Crawl film ID ():
http://www.atmovies.com.tw/movie/now/1/
$('#quickSelect select option')
ex:
NOTE: first element is not movie title.
<option value="http://www.atmovies.com.tw/movie/{filmID}/">{film title(ZH_TW)}</option>

#Crawl Movie data
http://www.atmovies.com.tw/movie/{filmID}/

const raw = $('#filmTagBlock span:nth-child(3)')[0].innerText.split(' ')[0]
const [overview, length] = raw.split('片長：');
const className = $('.filmTitle img')[0].src.split('images/'); // "cer_ff.gif"
let classing;
switch (className) {
    case 'cer_P.gif':
        classing = "保護級";
        break;
    case 'cer_G.gif':
        classing = "普遍級";
        break;
    case 'cer_F2.gif':
        classing = "輔導級";
        break;
    case 'cer_R.gif':
        classing = "限制級";
        break;
    default:
        throw `Error classifying movie : ${filmID}`;
}
return {
    title: $('.filmTitle a')[0].text(),
    filmID : filmID,
    overview: overview,
    length: length,
    teaser_uri = $('.video_view iframe')[0].attr('src'),
    classing: classing,
}


## getShowtime.js

#Crawl Showtime

