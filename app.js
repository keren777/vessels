var vesselLocations = require('./data/vesselLocations.json');
var vesselInfo = require('./data/vesselInfo.json');

var express = require('express'),
    bodyParser = require('body-parser');


var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

/* this is good for simple straight forward routes */
app.get('/', function(req, res){
    res.send('Welcome to my API!!!');
});

app.get('/vessel-locations', function(req, res){
    res.send(vesselLocations);
});

app.get('/vessel-info', function(req, res){
    res.send(vesselInfo);
});

app.listen(port, function(){
    console.log('Gulp is running my app on port: ' + port);
});


module.exports = app;