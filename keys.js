console.log('this is loaded');

//this pulls the IDs from the .env file and exports the API ID (and Secret) to the liri.js file for the variables
exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET,
  token: process.env.SPOTIFY_TOKEN
},

//for omdb
exports.omdb = {
    id: process.env.OMDB_ID
},

//for Bands In Town
exports.bands = {
    id: process.env.BANDS_ID
}