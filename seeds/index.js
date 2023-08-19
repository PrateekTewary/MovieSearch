const mongoose = require('mongoose');
const MovieSeeds = require('./movieSeeds');
const MovieSchema = require('../models/movie');

mongoose.connect('mongodb://127.0.0.1:27017/movieApp');

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});

const seedDB = async () => {
    await MovieSchema.deleteMany();
    for( let Movie of MovieSeeds ){

        let Cast="";
        for( let temp of Movie.cast )
            Cast+=temp;
        //console.log(Cast);
        const newMovie = new MovieSchema({
            title:`${Movie.title}`,
            year:Movie.year,
            image:`${Movie.thumbnail}`,
            cast: `${Cast}`
        })

        await newMovie.save();
    }
}


seedDB().then( () => {
    mongoose.connection.close();
});