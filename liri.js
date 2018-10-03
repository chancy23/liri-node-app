//all the required NPMs===============================================================================
// Read and set environment variables (the API key values)
var dotenv = require("dotenv").config();

//require to read from the other files (randomtext)
var fs = require("fs");

//require to get the requests from the apis
var request = require("request");

//require to get moment.js
var moment = require("moment");

//loads the key file
var keys = require("./keys.js");

//npm to the node-spotify-api
var Spotify = require("node-spotify-api");
//inputting the key and secret for the authoriziation
var spotify = new Spotify({id:keys.spotify.id, secret:keys.spotify.secret});

//input and command variables==========================================================================
//var to get the command type...this will tell the app what function to run/API to call
var command = process.argv[2]; 
//var for the song, band, or movie title...this needs to go to the search for the API call
var input = process.argv[3];

//functions=============================================================================================

//function if input is left blank when spotifying, currently works with "" but not if nothing is entered.
function spotifyDefault() {
    spotify.request('https://api.spotify.com/v1/search?q=track:"the+sign"&artist:"ace+of+base"&type=track&limit=2')
    .then(function(data) {
        var trackData = data.tracks.items;
        console.log("\r\n");
        console.log("=====================================");
        console.log("It looks like you didn't say a song, so I picked one for you!");
        console.log("Artist(s): " + JSON.stringify(trackData[1].artists[0].name, null, 2));
        console.log("Song Title: " + JSON.stringify(trackData[1].name, null, 2));
        console.log("Preview: " + JSON.stringify(trackData[1].preview_url, null, 2));
        console.log("Album: " + JSON.stringify(trackData[1].album.name, null, 2));
        console.log("=====================================");
        console.log("\r\n");
    })
    .catch(function(err) {
    console.error('Error occurred: ' + err); 
    });
};

//spotify-this-song when there is an input
function spotifyThis() {
    //determine if there is a string for input if not call the default spotify
    if (input === "") {
        spotifyDefault();
        return;
    }
    else {
        spotify.search({type: "track", query: input, limit: 10}, function(err, data) {
            if (err) {
                return console.log("Error occurred: " + err);
            }
            else {
                //console.log("this is all the data: " + JSON.stringify(data, null, 2)); //test
                var trackData = data.tracks.items;
                //loop through all track info to get the required data
                for (var i = 0; i < trackData.length; i++) {
                    //add a number for each index (plus 1 to start at 1)
                    console.log(i + 1);
                    //print each required item, use stringify to make the result a string (Parse won't work here?)
                    console.log("Artist(s): " + JSON.stringify(trackData[i].artists[0].name, null, 2));
                    console.log("Song Title: " + JSON.stringify(trackData[i].name, null, 2));
                    console.log("Preview: " + JSON.stringify(trackData[i].preview_url, null, 2));
                    console.log("Album: " + JSON.stringify(trackData[i].album.name, null, 2));
                    console.log("=====================================");
                };
            };
        });
    };
};

//movie-this command
function movieThis() {
    //determine if there is a string for input
    if (input !== "") {
        var movie = input;
    }
    // if not then supply a movie Mr Nobody
    else {
        var movie = "Mr. Nobody";
    };
    //take input and add to omdb request URL that includes API key
    var omdbKey = keys.omdb.id;
    var omdbRequestURL = "http://www.omdbapi.com/?apikey=" + omdbKey + "&t=" + movie;

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

//concert-this to call BIT API
function concertThis() {
    //get key from key file
    var bandsKey = keys.bands.id;
    //request URL to send to the API
    var bandsRequestURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=" + bandsKey + "&date=upcoming";

    request(bandsRequestURL, function (error, response, body) {
        if (error) {
            // Print the error if one occurred
            return console.log("There was an error: " + error); 
        }
        else {
            //creat a variable to hold the parsed body content
            var parsedBody = JSON.parse(body);
            //loop through all of the parsed array to get the actual fields and console log them
            for (var i = 0; i < parsedBody.length; i++) {
                //create a variable to hold the date in the correct format using moment.js
                var dateFormatted = moment(parsedBody[i].datetime).format("MM/DD/YYYY");
                //outputs
                console.log(i+1);
                console.log("Venue: " + parsedBody[i].venue.name);
                console.log("Location: " + parsedBody[i].venue.city + ", " + parsedBody[i].venue.country);
                console.log("Date: " + dateFormatted);
                console.log("\r\n");
                console.log("= = = = = = = = = = = = = = = = = = = = ");
                
            };
        };
    });
};

//do-what-it-says
function doThis() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log("There was an error: " + error)
        }
        else {
            // console.log("this is the random text data: " + data); //test
            //create an array to hold the data by splitting it at the comma
            var txtArray = data.split(",");
            //update the global variables to hold the new strings in the array
            command = txtArray[0];
            input = txtArray[1];
            //run the commands using the new variable values.
            runCommands();
        };
    });
};

//function to hold all the commands so can be reused in the do this function
//try reformatting to a switch/case to run throug the different commands
function runCommands() {
    if (command === "spotify-this-song") {
        spotifyThis();
    }
    else if (command === "movie-this") {
        movieThis();
    }
    else if (command === "concert-this") {
        concertThis();
    }
    else if (command === "do-what-it-says") {
        doThis()
        //have it read the random.txt file and then run search spotify function
    };
};

//runs all the commands from the command line
runCommands();



