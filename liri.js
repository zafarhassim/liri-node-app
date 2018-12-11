require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var cmmdLine = process.argv[2];

var userResponse = process.argv.slice(3).join(" ");

function liriRun(cmmdLine, userResponse){
    switch(cmmdLine){
        case "spotify-this-song":
            useSpotify(userResponse);
            break
        
        case "concert-this":
            getBandsInTown(userResponse);
            break;
        
        case "do-what-it-says":
            useRandom();
            break;
    
        default:
            console.log("Please enter one of the following commands:");
    }
}

function useSpotify(songName) {

    var spotify = new Spotify(keys.spotify);

    if (!songName){
        songName = "The Sign";
    };

    spotify.search({type: 'track', query: songName}, function(err, data) {
        if (err) {
            return console.log("Error occured: " + err);
        }
        
        console.log("Artist's Name: " + data.tracks.items[0].album.artists[0].name + "\r\n");

        console.log("Song names: " + data.tracks.itmes[0].name + "\r\n");

        console.log("Song preview link" + data.tracks.items[0].href + "\r\n");

        console.log("Album: " + data.tracks.itmes[0].album.name + "\r\n");

        var logSong = "Aritst Log :" + data.tracks.items[0].album.artists[0].name;

        fs.appendFile("log.txt", logSong, function(err) {
            if(err) throw err;

        });
    });
};

function useBandsInTown(movie) {
    if(!movie) {
        movie = "Mr.Nobody";
    }
    var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.request(movieQueryUrl).then(
        function (response){
            console.log(" Tile: " + response.data.Title + "\r\n");
            console.log("Year :" + response.data.Year + "\r\n");
            console.log(" IMDB Rating: " + response.data.imdbRating[1].Value + "\r\n");
            console.log("Rotten Tomatoes: " + response.data.Rating[1].Value + "\r\n");
            console.log(" country : " + response.data.Country + "\r\n");
            console.log("Language: " + response.data.Language + "\r\n");
            console.log("Plot: " + response.data.Plot + "\r\n");
            console.log(" Actors: " + response.data.Actors + "\r\n");

            var logMovie = "Movie title" + response.data.Title; 

            fs.appendFile("log.txt", logMovie, function(err) {
                if(err) throw err;
            });
        });
    };

function useRandom (){
    fs.readFile("random.txt", "utf8", function(error,data){
        if(error) {
            return console.log(error);
        } else{
            console.log(data);
            
            var randomData = data.split(",");
            liriRun(randomData[0], randomData[1]);
        }
    });
};

function showResult(data) {
    fs.appendFile("log.txt", data, function (err){
        if(err) throw err;
    });
};

liriRun(cmmdLine, userResponse);