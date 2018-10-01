
// Read and set environment variables
var dotenv = require("dotenv").config();

//require to read from the other files
var fs = require("fs");

//require to get the requests from the apis
var request = require("request");

//require to run the command line prompts
var inquirer = require("inquirer");

//loads the key file
var keys = require("./keys.js");

//npm to the node-spotify-api
var Spotify = require("node-spotify-api");
//inputting the key and secret for the authoriziation
var spotify = new Spotify({id:keys.spotify.id, secret:keys.spotify.secret});


//var to get the command type...this will tell the app what function to run/API to call
var command = process.argv[2]; 
//var for the song, band, or movie title...this needs to go to the search for the API call
var input = process.argv[3];

//if movoe
function movieThis() {
    //take input and add to omdb request URL that includes API key
    var omdbKey = keys.omdb.id;
    var omdbRequestURL = "http://www.omdbapi.com/?apikey=" + omdbKey + "&t=" + input;
    // send request to omdb to get the result
    request(omdbRequestURL, function (error, body) {
        if (error) {
        return console.log("error: " + error); // Print the error if one occurred
        }
        else {
        // console.log("statusCode: " + response && response.statusCode); // Print the response status code if a response was received
        console.log("body: " + JSON.stringify(body, null, 2));
        };
    });
};

// //empty array to hold the command and input strings
// var totalRequest = [];
// totalRequest.push(command + ", " + input);
// console.log("this is the request array: " + totalRequest);


if (command === "spotify-this-song") {
    //function to search spotify with type of track and the query
    spotify.search({type: "track", query: input, limit: 1}, function(err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
        else {
        console.log("this is all the data: " + JSON.stringify(data.tracks.items.album.name, null, 2)); 
        }
    });
}
else if (command === "movie-this") {
    movieThis();
}
// else if (command === "concert-this") {
//     //call the bands in town api
//     //return concert info
// }

// else if (command === "do-what-it-says") {
//     //have it read the random.txt file and then run search spotify function
// };

//create prompts for each request
// inquirer
//   .prompt([
//     //basic text prompt.
//     {
//       type: "input",
//       message: "Type in one: 'concert-this', 'spotify-this-song', 'movie-this, or 'do-what-it-says",
//       name: "userInput"
//     },
// ]).then(function(response){
// //switch/case to run throug the different commands
// })


// test
//console.log("keys: " + JSON.stringify(keys, null, 2));






//functions for each command line inquirer
 

    //if bands

    //if do this thing
