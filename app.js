var express = require('express');
var http = require('http');
var ejs = require('ejs');
var app = express();

// All environments
app.set('port', process.env.PORT || 4000);

// Set up views

app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);

// Set up ejs

ejs.open = '<ejs>';
ejs.close = '</ejs>';

//Set up middleware
app.use(express.favicon());	
app.use(express.json()); 
app.use(express.urlencoded());
app.use(app.router); 
app.use(express.static('public'));

// Reads the routes
require('./routes/original')(app);
require('./routes/different')(app);

// Creates server
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});