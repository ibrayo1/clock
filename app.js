require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const ejs = require('ejs');
const mongoose = require('mongoose');

// define the port
const PORT = process.env.PORT || 3000;

// set view engine to ejs
app.set('view engine', 'ejs');

// static folder
app.use(express.static('public'));

// connect to mongodb
mongoose.connect("mongodb://"+process.env.MONGO_USERNAME+":"+process.env.MONGO_PASS+"@"+
    process.env.MONGO_HOSTNAME+":"+process.env.MONGO_PORT+"/"+process.env.MONGO_DB+
    "?authSource=admin", { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

const Prayer = require("./models/Prayer");

// render the index file
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

server.listen(PORT, () => {
    console.log(`listening to requests on ${server.address().port}`)
});