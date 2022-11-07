const express = require('express');
const app = express(),
      bodyParser = require("body-parser");
const port = 3080;
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const { parse } = require('path');

const YELP_AUTH_KEY = 'Bearer eltP76N376mghdWzP1rniJqT-AavUFpjIkvmgkcH_HHGJAlpeA6FdD8sdukTQRsNq-yjKu91zLzKwEs-aBvj5Y41O5x39nvOJIVAOH7T8msYETHzbwGsvqC727gzY3Yx';

// app.use(express.static(process.cwd()+"/dist/hw8/"));

// app.get('/', (req,res) => {
//     res.sendFile(process.cwd() + "/dist/hw8/index.html");
// });

// app.get('/search', (req,res) => {
//     res.send('search');
// });

// app.get('/bookings', (req,res) => {
//     res.send('booking');
// });

app.use(cors({
    origin: '*'
}));

app.get('/', (req,res) => {
    res.send('index');
});

app.get('/search', (req,res) => {
    let term = req.query['term'];
    let latitude = req.query['latitude'];
    let longitude = req.query['longitude'];
    let categories = req.query['categories'];
    let radius = req.query['radius'];
    let location = req.query['location'];
    let checkbox = req.query['checkbox'];

    if(radius == 'undefined') {
        radius = 10;
    }

    console.log(term, latitude, longitude, categories, radius, location, checkbox);
        
    if(checkbox == 'false') {
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address : location,
                key : 'AIzaSyBoQj67B2dyysSyGHFNtrhKJ_cuDnUdjls'
            }
        })
        .then(res => {
            console.log("CALL GOOGLE MAP API");
            latitude = res.data.results[0].geometry.location.lat;
            longitude = res.data.results[0].geometry.location.lng;
        })
        .catch((e) => {
            console.log("GOOGLE MAP GET IP ERROR!", e);
        });
    }

    radius = parseFloat(radius);
    radius = radius * 1609.34;
    radius = parseInt(radius);
    radius = radius + "";

    axios.get('https://api.yelp.com/v3/businesses/search', {
        headers: {
            'Authorization' : YELP_AUTH_KEY
        },

        params: {
            term : term,
            latitude : latitude,
            longitude : longitude,
            categories : categories,
            radius : radius
        }
    })
    .then(response => {
        console.log("CALL YELP API");
        res.send(response.data);
    })
    .catch((e) => {
        console.log("YELP GET IP ERROR!", e);
    });

});

app.get('/detail', (req,res) => {
    let id = req.query['id'];

    axios.get('https://api.yelp.com/v3/businesses/' + id, {
        headers: {
            'Authorization' : YELP_AUTH_KEY
        }
    })
    .then(response => {
        console.log("CALL YELP API");
        res.send(response.data);
    })
    .catch((e) => {
        console.log("YELP DETAIL GET IP ERROR!", e);
    });

});


app.get('/review', (req,res) => {
    let id = req.query['id'];

    axios.get('https://api.yelp.com/v3/businesses/' + id +'/reviews', {
        headers: {
            'Authorization' : YELP_AUTH_KEY
        }
    })
    .then(response => {
        console.log("CALL YELP API");
        res.send(response.data);
    })
    .catch((e) => {
        console.log("YELP REVIEW GET IP ERROR!", e);
    });

});



app.listen(port, () => {
    console.log(`1`);
});


