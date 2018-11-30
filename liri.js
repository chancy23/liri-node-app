//all the required NPMs===============================================================================
var dotenv = require("dotenv").config();
var fs = require("fs");
var request = require("request");
var moment = require("moment");
var keys = require("./keys.js");

//NPM to the node-spotify-api
var Spotify = require("node-spotify-api");
//inputting the key and secret for the authoriziation
var spotify = new Spotify({id:keys.spotify.id, secret:keys.spotify.secret});

//input and command variables==========================================================================
//var to get the command type.
var command = process.argv[2]; 
//var for the song, band, or movie title.
var input = process.argv[3];

//functions=============================================================================================
//function if input is left blank when spotifying
function spotifyDefault() {
    spotify.request('https://api.spotify.com/v1/search?q=track:"the+sign"&artist:"ace+of+base"&type=track&limit=2')
    .then(function(data) {
        var trackData = data.tracks.items;
        var output = "Artist: " + JSON.stringify(trackData[1].artists[0].name, null, 2) +
            "\nSong Title: " + JSON.stringify(trackData[1].name, null, 2) +
            "\nPreview: " + JSON.stringify(trackData[1].preview_url, null, 2) +
            "\nAlbum: " + JSON.stringify(trackData[1].album.name, null, 2) +
            "\n= = = = = = = = = = = = = = = = = = = =\r";

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
                
                for (var i = 0; i < trackData.length; i++) {
                    var output =  i + 1 +
                        "\nArtist: " + JSON.stringify(trackData[i].artists[0].name, null, 2) +
                        "\nSong Title: " + JSON.stringify(trackData[i].name, null, 2) +
                        "\nPreview: " + JSON.stringify(trackData[i].preview_url, null, 2) +
                        "\nAlbum: " + JSON.stringify(trackData[i].album.name, null, 2) +
                        "\n= = = = = = = = = = = = = = = = = = = =\r";

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
    if (input !== undefined) {
        var movie = input;
    }
    else {
        var movie = "Mr. Nobody";
    };
    
    var omdbKey = keys.omdb.id;
    var omdbRequestURL = "http://www.omdbapi.com/?apikey=" + omdbKey + "&t=" + movie;

    request(omdbRequestURL, function (error, response, body) {
        if (error) {
            return console.log("Error occurred: " + error); 
        }
        else {
            // console.log("full data: " + JSON.stringify(body, null, 2)); //testing data
            var output = "\nTitle: " + JSON.parse(body).Title +
                "\nReleased in: " + JSON.parse(body).Year +
                "\nIMDB Rating: " + JSON.parse(body).imdbRating +
                "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value +
                "\nCountry of Production: " + JSON.parse(body).Country +
                "\nLanguages: " + JSON.parse(body).Language +
                "\nPlot: " + JSON.parse(body).Plot +
                "\nActors: " + JSON.parse(body).Actors +
                "\n= = = = = = = = = = = = = = = = = = = =\r ";

            console.log(output);
            //append to the log.txt file using the function
            appendResult(output);
        };
    });
};

//concert-this command to call BIT API
function concertThis() {
    var bandsKey = keys.bands.id;
    var bandsRequestURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=" + bandsKey;
    console.log(bandsRequestURL);

    request(bandsRequestURL, function (error, response, body) {
        if (error) {
            return console.log("Error occurred: " + error); 
        }
        else {
            var parsedBody = JSON.parse(body);
            for (var i = 0; i < parsedBody.length; i++) {
                var dateFormatted = moment(parsedBody[i].datetime).format("MM/DD/YYYY");
                var output = i+1 + 
                    "\nVenue: " + parsedBody[i].venue.name + 
                    "\nLocation: " + parsedBody[i].venue.city + ", " + parsedBody[i].venue.country + 
                    "\nDate: " + dateFormatted +
                    "\n= = = = = = = = = = = = = = = = = = = =\r ";

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
            var txtArray = data.split(",");
            //Update the global variables to hold the new strings in the array
            command = txtArray[0];
            input = txtArray[1];
            //Run the commands using the new variable values.
            runCommands();
        };
    });
};

//function to append the output to the log.txt file
function appendResult(output) {
    var text = output;
    fs.appendFile("log.txt", text, function(error) {
        if (error) {
            console.log("Error occurred: " + error);
        };
    });
};
  
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

runCommands();



