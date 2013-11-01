var uti = require('./utilities');
var async = require('async');

var api = 'https://www.readability.com/api/content/v1/parser?url=';
var key = '7e9cbe5c8206c5e58b4f937d938543141271b45c';



//Waterfall: Runs an array of functions in series, each passing their results to 
//the next in the array. One error calls general error
//waterfall(tasks, [callback])

//Parallel: Run an array/ object of functions in parallel, without waiting until the previous 
//function has completed. One error immediately calls the main error. 
//Once the tasks have completed, the results are passed to the final callback as an array/ object.
//parallel(tasks, [callback])

//Apply: Determines the best order for running functions based on their requirements. 
//Each function can optionally depend on other functions being completed first,
// and each function is run as soon as its requirements are satisfied.
//apply(function, arguments..)

exports.showPost = function (link, callback){
	var url = api + link + '&token=' + key;
	async.waterfall(
		[            
			async.apply(uti.find, url),
			
			function(results, cb) {
				var post = {
					author: results.author,
					title: results.title,
					content: results.content,
					date: results.date_published,
					link: results.short_url
				};
				post = organize(post);
				
				cb(null, post);
			}		
		], 
		function(err, post) {    
			if (err) {        
				console.error('Error: ' + err);
				callback(err);
			} else {
				callback(null, post);
			}
		}
	);
};

function organize(post){
	var obj = {};
	
	if (typeof post.author !== 'undefined' && post.author !== null) {
		obj.author = cleanAuthor(post.author);
	} else {
		obj.author = 'Not specified';
	}
	
	if (typeof post.title !== 'undefined' && post.title !== null) {
		obj.title = post.title;
	} else {
		obj.title = 'Not specified';
	}
	
	if (typeof post.content !== 'undefined' && post.content !== null) {
		obj.content = post.content;
	} else {
		obj.content = 'Not specified';
	}

	if (typeof post.date !== 'undefined' && post.date !== null) {
		obj.date = dateify(post.date);
	} else {
		obj.date = 'Not specified';
	}
	
	if (typeof post.link !== 'undefined' && post.link !== null) {
		//encodes the post link it to normal looks. something like: ZGFua29nYWk
		obj.link = post.link;
	} else {
		obj.link = 'Not specified';
	}
		
	
	return obj;
}

// makes the UTC date to syntax: 2013-01-01
function dateify(date) {
	var shortDate = date.slice(0, 10);
	return shortDate;
}

// readability tends to have utc time string within author string
// gets rid of utc time string
function cleanAuthor(string) {
	var utc = string.indexOf('UTC', 0);
	if (utc === -1) {
		return string;
	} else {
		var yearIndx = string.indexOf('20', 0);
		var clean = string.slice(0, yearIndx);
		return clean;
	}
}