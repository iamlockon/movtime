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

## TESTING

Use Jest with Babel 7. 
