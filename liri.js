
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

//function for spotify this commmand
function spotifyThis() {
    //function to search spotify with type of track and the query
    spotify.search({type: "track", query: input, limit: 10}, function(err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
        else {
            //*******need to do a for loop to loop thorugh the 10 results and display each line below
            // console.log("this is all the data: " + JSON.stringify(data, null, 2)); //test
            console.log("Artist(s): " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
            console.log("Song Title: " + JSON.stringify(data.tracks.items[0].name, null, 2));
            console.log("Preview: " + JSON.stringify(data.tracks.items[0].preview_url, null, 2));
            console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
        }
    });
}

//function for movie this command
function movieThis() {
    //take input and add to omdb request URL that includes API key
    var omdbKey = keys.omdb.id;
    var omdbRequestURL = "http://www.omdbapi.com/?apikey=" + omdbKey + "&t=" + input;
    // send request to omdb to get the result
    request(omdbRequestURL, function (error, response, body) {
        if (error) {
            // Print the error if one occurred
            return console.log("error: " + error); 
        }
        else {
            // take the body and parse out the required key data
            // console.log("full data: " + JSON.stringify(body, null, 2)); //testing data
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Released in: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country of Production: " + JSON.parse(body).Country);
            console.log("Languages: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        };
    });
};

// //empty array to hold the command and input strings
// var totalRequest = [];
// totalRequest.push(command + ", " + input);
// console.log("this is the request array: " + totalRequest);

//actually runs the functions based on the command
if (command === "spotify-this-song") {
    spotifyThis();
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
