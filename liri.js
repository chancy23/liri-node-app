//all the required NPMs===============================================================================
// Read and set environment variables (the API key values, to keep them private)
var dotenv = require("dotenv").config();

//require to read from the other files and to append text to the log.txt file
var fs = require("fs");

//require to get the requests from the APIs
var request = require("request");

//require to get moment.js NPM
var moment = require("moment");

//loads the key file
var keys = require("./keys.js");

//NPM to the node-spotify-api
var Spotify = require("node-spotify-api");
//inputting the key and secret for the authoriziation
var spotify = new Spotify({id:keys.spotify.id, secret:keys.spotify.secret});


//input and command variables==========================================================================
//var to get the command type...this will tell the app what function to run/API to call
var command = process.argv[2]; 
//var for the song, band, or movie title...this needs to go to the search for the API calls
var input = process.argv[3];


//functions=============================================================================================
//function if input is left blank when spotifying, currently works with "" but not if nothing is entered.
function spotifyDefault() {
    spotify.request('https://api.spotify.com/v1/search?q=track:"the+sign"&artist:"ace+of+base"&type=track&limit=2')
    .then(function(data) {
        var trackData = data.tracks.items;

        var output = "Artist: " + JSON.stringify(trackData[1].artists[0].name, null, 2) +
            "\nSong Title: " + JSON.stringify(trackData[1].name, null, 2) +
            "\nPreview: " + JSON.stringify(trackData[1].preview_url, null, 2) +
            "\nAlbum: " + JSON.stringify(trackData[1].album.name, null, 2) +
            "\n= = = = = = = = = = = = = = = = = = = =\r";

        //print the output in the terminal
        console.log("\r\n");
        console.log("It looks like you didn't say a song, so I picked one for you!");
        console.log (output);
        //appends the output into the log.txt file
        appendResult(output);

    }).catch(function(err) {
        console.error('Error occurred: ' + err); 
    });
};

//spotify-this-song command when there is an input
function spotifyThis() {
    //determine if there is a string for input, if not (is undefined) call the default spotify
    if (input === undefined) {
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
                    //variable to hold the output data
                    var output =  i + 1 +
                        "\nArtist: " + JSON.stringify(trackData[i].artists[0].name, null, 2) +
                        "\nSong Title: " + JSON.stringify(trackData[i].name, null, 2) +
                        "\nPreview: " + JSON.stringify(trackData[i].preview_url, null, 2) +
                        "\nAlbum: " + JSON.stringify(trackData[i].album.name, null, 2) +
                        "\n= = = = = = = = = = = = = = = = = = = =\r";

                    //print the output in the terminal
                    console.log (output);
                    //appends the output into the log.txt file
                    appendResult(output);
                };
            };
        });
    };
};

//movie-this command
function movieThis() {
    //if there is a string for the movie input (ie if the input is not undefined), use the input as the value
    if (input !== undefined) {
        var movie = input;
    }
    // if not then supply movie value of Mr. Nobody 
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
            return console.log("Error occurred: " + error); 
        }
        else {
            // console.log("full data: " + JSON.stringify(body, null, 2)); //testing data
            //variable to hold the output for termnal and to send to the log.txt file
            // take the body and parse out the required key data
            var output = "\nTitle: " + JSON.parse(body).Title +
                "\nReleased in: " + JSON.parse(body).Year +
                "\nIMDB Rating: " + JSON.parse(body).imdbRating +
                "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +
                "\nCountry of Production: " + JSON.parse(body).Country +
                "\nLanguages: " + JSON.parse(body).Language +
                "\nPlot: " + JSON.parse(body).Plot +
                "\nActors: " + JSON.parse(body).Actors +
                "\n= = = = = = = = = = = = = = = = = = = =\r ";

            //prints output variable to the terminal
            console.log(output);
            //append to the log.txt file using the function
            appendResult(output);
        };
    });
};

//concert-this command to call BIT API
function concertThis() {
    //get key from key file
    var bandsKey = keys.bands.id;
    //request URL to send to the API
    var bandsRequestURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=" + bandsKey;
    console.log(bandsRequestURL);

    request(bandsRequestURL, function (error, response, body) {
        if (error) {
            // Print the error if one occurred
            return console.log("Error occurred: " + error); 
        }
        else {
            //creat a variable to hold the parsed body content
            var parsedBody = JSON.parse(body);
            //loop through all of the parsed array to get the actual fields and console log them
            for (var i = 0; i < parsedBody.length; i++) {
                //create a variable to hold the date in the correct format using moment.js
                var dateFormatted = moment(parsedBody[i].datetime).format("MM/DD/YYYY");

                //create a variable for all the outputs to be used to add to the log.txt file
                var output = i+1 + 
                    "\nVenue: " + parsedBody[i].venue.name + 
                    "\nLocation: " + parsedBody[i].venue.city + ", " + parsedBody[i].venue.country + 
                    "\nDate: " + dateFormatted +
                    "\n= = = = = = = = = = = = = = = = = = = =\r ";
                //print to the console
                console.log(output);
                //append to the log.txt file using the function
                appendResult(output);
            };
        };
    });
};

//do-what-it-says command
function doThis() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log("Error occurred: " + error)
        }
        else {
            //Create an array to hold the data by splitting it at the comma
            var txtArray = data.split(",");
            //Update the global variables to hold the new strings in the array
            command = txtArray[0];
            input = txtArray[1];
            //Run the commands using the new variable values.
            runCommands();
        };
    });
};

//function to append the output to the log.txt file (used in every command function)
function appendResult(output) {
    //get the output from the command that was run
    var text = output;
    // Append the text from the command output into the log.txt file.
    fs.appendFile("log.txt", text, function(error) {

        // If an error was experienced we will log it.
        if (error) {
            console.log("Error occurred: " + error);
        };
    });

};
  

//Function to hold all the commands so can be reused in the doThis function
function runCommands() {
    switch (command) {
        case "spotify-this-song":
            spotifyThis();
            break;
        
        case "movie-this":
            movieThis();
            break;
        
        case "concert-this":
            concertThis();
            break;
        
        case "do-what-it-says":
            doThis();
            break;
    };
};

//Call the function to run all the commands from the command line input
runCommands();



