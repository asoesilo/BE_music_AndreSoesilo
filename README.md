BE Music API
===================

BE Music is a recommendation system for a social music player system. This API is developed in NodeJS, Express and Mongo DB.

It currently have three endpoints:
* POST /follow, which accepts two params in the request body: from <user ID> and to <user ID>. It adds 'to' user ID into the 'from' user's followee list.
* POST /listen, which accepts two params in the request body: user <user ID> and music <music ID>. It adds 'music' into the list of music, which user has listened to.
* GET /recommendations, which accepts one param in the request body: user <user ID>. It returns 5 music recommendations to this user.

MongoDB is expected to run in ./data folder, so please create this folder and set the --dbpath for mongo to this folder. The commands for this are:
> mkdir ./data
>
> mongod --dbpath ./data

To run the server, use the following command:
> node app.js

The tests are written in mocha, so use the following command to run tests:
> mocha ./test

To run the script that returns the list of recommended music for user 'a', use the folowing command:
> mocha ./test/script.js