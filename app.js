var vesselLocations = require('./data/vesselLocations.json');
var vesselInfo = require('./data/vesselInfo.json');
var _ = require('lodash');

var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs');

var app = express();
var port = process.env.PORT || 3030;


app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static(__dirname + '/public'));

app.get('/vessel-locations', function(req, res){
    res.send(vesselLocations);
});

app.get('/vessel-info', function(req, res){
    res.send(vesselInfo);
});

app.post('/vessel-info', function(req, res){
    var data = req.body;
    var index = _.findIndex(vesselInfo, _.pick(data, '_id'));
    if( index !== -1) {
        vesselInfo.splice(index, 1, data);
    } else {
        vesselInfo.push(data);
    }

    fs.writeFile('./data/vesselInfo.json', JSON.stringify(vesselInfo), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('vesselInfo.json successfully edited!');
        res.send(vesselInfo);
    });
});

app.get('/biggest-ship', function(req, res){
    res.send( _.maxBy(vesselInfo, function(o) { return o.size; }));
});

app.listen(port, function(){
    console.log('Gulp is running my app on port: ' + port);
});


module.exports = app;