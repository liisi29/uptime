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

ejs.open = '{{';
ejs.close = '}}';

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
	//moodul kus on eraldi funktsioon andmete andmebaasist võtmiseks
	// funktsiooni v2lja kutsumine (defineeritakse public.js-s)
/*	data.getData(data.data, function(cd){
		res.render('task.html', { 
			newest: cd.newest, 
			marketing: cd.marketing,
			cloud: cd.cloud, 
			technology: cd.technology, 
			gadget: cd.gadget  
		});
	});
*/
	data.getData(data.data, function(cd){
		res.send('data.js', { 
			newest: cd.newest, 
			marketing: cd.marketing,
			cloud: cd.cloud, 
			technology: cd.technology, 
			gadget: cd.gadget  
		});
	});
});


	
// Käivitab serveri.

app.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});