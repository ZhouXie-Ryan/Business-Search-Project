const express = require('express');
const app = express();
const port = (process.env.PORT) || 8080;
const path = require('path');
// const cors = require('cors');
const axios = require('axios');
const publicPath = path.join(__dirname, "/dist/hw8");
const YELP_AUTH_KEY = 'Bearer eltP76N376mghdWzP1rniJqT-AavUFpjIkvmgkcH_HHGJAlpeA6FdD8sdukTQRsNq-yjKu91zLzKwEs-aBvj5Y41O5x39nvOJIVAOH7T8msYETHzbwGsvqC727gzY3Yx';

app.use(express.static(publicPath));

// app.use(cors({
//     origin: '*'
// }));

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/dist/hw8/index.html");
});

app.get('/search', (req,res) => {
    res.sendFile(__dirname + "/dist/hw8/index.html");
});

app.get('/booking', (req,res) => {
    res.sendFile(__dirname + "/dist/hw8/index.html");
});

app.get('/query', (req,res) => {
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
    radius = parseFloat(radius);
    radius = radius * 1609.34;
    radius = parseInt(radius);
    radius = radius + "";
        
    if(checkbox == 'false') {
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address : location,
                key : 'googleapikey'
            }
        })
        .then(resp => {
            console.log("CALL GOOGLE MAP API");
            latitude = resp.data.results[0].geometry.location.lat;
            longitude = resp.data.results[0].geometry.location.lng;
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
        })
        .catch((e) => {
            console.log("GOOGLE MAP GET IP ERROR!", e);
        });
    } else {
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
    }

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


app.get('/autocomplete', (req,res) => {
    let inputValue = req.query['inputValue'];

    axios.get('https://api.yelp.com/v3/autocomplete?text=' + inputValue , {
        headers: {
            'Authorization' : YELP_AUTH_KEY
        }
    })
    .then(response => {
        res.send(response.data);
    })
    .catch((e) => {
        console.log("YELP AUTOCOMPLETE GET ERROR!");
    });

});



app.listen(port, () => {
    console.log(`1`);
});


