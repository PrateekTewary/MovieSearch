const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const Movie = require('./models/movie');
const Comment = require('./models/comment');



mongoose.connect('mongodb://127.0.0.1:27017/movieApp');
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected");
});


const app = express();
app.use(express.json());
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.render('home');
})

app.get( '/search', async (req,res)=>{
    const {query} = req.query;
    //console.log(query);
    // const {query} = req.params;
    const results = await Movie.find({title:{$regex:`.*${query}.*`, $options:'i'}});
    res.render('searchResult',{results});
    console.log(results);
})
app.get( '/search/:id', async(req,res) => {
    const {id} = req.params;
    const movie = await Movie.findById(id).populate('comments');
    
    res.render('movieWithComment',{movie});
})
app.post('/search/:id/comment', async(req, res) => {
    const data = req.body;
    const {id} = req.params;
    const movie = await Movie.findById(id);

    const newComment = new Comment({
        userName: data.userName,
        comment: data.comment
    });
    movie.comments.push(newComment);
    
    await movie.save();
    await newComment.save();

    res.redirect(`/search/${id}`);
})

// app.all( '*', (req,res,next) )=>({
//      res.render('home');
// })










app.listen( 3000, ()=>{
    console.log('Serving on port 3000');
})