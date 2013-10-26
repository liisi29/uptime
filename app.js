var express = require('express');
var http = require('http');
var ejs = require('ejs');
var app = express();
var data = require('./lib/data');



// all environments
app.set('port', process.env.PORT || 4000);

// Häälesta vaadete süsteem.
// Kasuta EJS-i.

app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);

ejs.open = '<ejs>';
ejs.close = '</ejs>';

//Häälesta middleware
	// annab expressi faviconi
 app.use(express.favicon());	
 app.use(express.json()); 
 app.use(express.urlencoded());
	//http://stackoverflow.com/questions/12695591/node-js-express-js-how-does-app-router-work
 app.use(app.router); 
	//jagab tavalisi faile public kaustast
 app.use(express.static('public'));

app.get('/', function(req, res) {
	data.getData(function(err, newest, marketing, cloud, technology, gadget){
		if (err) {
			console.error(new Date() + ' ' + err);
			// FIXME Saada üldisele vealehele.
			res.send(500);
		} else {
			res.render('task.html', {
				newest: newest, 
				marketing: marketing, 
				cloud: cloud, 
				technology: technology, 
				gadget: gadget
			}); 
			
		}
	});
});

// Käivitab serveri.

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});