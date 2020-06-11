require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// define the port
const PORT = process.env.PORT || 3000;

// set view engine to ejs
app.set('view engine', 'ejs');

// body parser middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// static folder
app.use(express.static('public'));

// connect to mongodb
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASS+"@"+
    process.env.MONGO_HOSTNAME+":"+process.env.MONGO_PORT+"/"+process.env.MONGO_DB+
    "?authSource=admin", { useMongoClient: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

const Prayer = require("./models/Prayer");

// get request for all the prayers
app.get("/", function(req, res){
    
    // get all the prayer times and render them
    Prayer.find(function(err, prayers){
        if(err){ console.log(err); }
        else{
            let fajr = prayers[0],
                dhuhr = prayers[1],
                asr = prayers[2],
                isha = prayers[3],
                jumuah = prayers[4];
            
            res.render('index', { fajr, dhuhr, asr, isha, jumuah }); 
        }
    });

});

// updates the prayer and reloads the page
app.post("/update/:id", function(req, res){
    const {hour, minute} = req.body;
    const time = hour + " : " + minute;

    let salah = { $set: { time: time }};
    let query = {_id: req.params.id};

    Prayer.updateOne(query, salah, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

server.listen(PORT, () => {
    console.log(`listening to requests on ${server.address().port}`)
});