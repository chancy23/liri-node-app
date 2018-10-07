# liri-node-app

This is a node.js based app that takes in commands from the terminal/bash window and outputs the results, based on the Command and the input value.

The commands are:
   * `concert-this`
   * `spotify-this-song`
   * `movie-this`
   * `do-what-it-says`

### What Each Command Should Do

Each of the above commands will output the below information

1. `concert-this <artist/band name here>`

   * Searches the Bands in Town Artist Events API for an artist and renders the following information about each event:
      * Name of the venue
      * Venue location
      * Date of the Event (uses moment.js to format as "MM/DD/YYYY")
       * Screenshot of command and output:  [Click here to view screenshot](screenshots/concertThis_screenshot.png)

2. `spotify-this-song "<song name here>"`

   * Searches the Spotify API and shows the following information about the song:
      * Artist(s)
      * The song's name
      * A preview link of the song from Spotify (if available)
      * The album that the song is from
        * Screenshot of command and output: [Click here to view screenshot](screenshots/spotifyThisSong_screenshot.png)

   * If no song is provided (input is undefined) then it defaults to "The Sign" by Ace of Base.
    * Screenshot of command and output:[Click here to view screenshot](screenshots/spotifyThisSong_blank.png)

3. `movie-this "<movie name here>"`

   * Searchs the oMDB API and shows the following information:
      * Title of the movie.
      * Year the movie came out.
      * IMDB Rating of the movie.
      * Rotten Tomatoes Rating of the movie.
      * Country where the movie was produced.
      * Language of the movie.
      * Plot of the movie.
      * Actors in the movie.
        * Screenshot of command and output: [Click here to view screenshot](screenshots/movieThis_screenshot.png) 
  
   * If the user doesn't type a movie in (input is undefined), the program will output data for the movie 'Mr. Nobody.'
    * Screenshot of command and output: [Click here to view screenshot](screenshots/movieThis_blank_screenshot.png)

4. `do-what-it-says`

   * LIRI will take the text inside of random.txt file and then use it to call one of LIRI's commands.
     * The default is set to run `spotify-this-song` for "I Want it That Way," (as follows the text in `random.txt`).
     * Screenshot of command and output: [Click here to view screenshot](screenshots/doWhatItSays_screenshot.png)

5. You can also checkout out the log.txt file for previous searches.

