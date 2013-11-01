var uti = require('./utilities');
var async = require('async');

//var url = '/api/content/v1/parser?url=http://blog.readability.com/2011/02/step-up-be-heard-readability-ideas/&token=7e9cbe5c8206c5e58b4f937d938543141271b45c'
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
	
	if (typeof post.author !== 'undefined') {
		obj.author = post.author;
	} else {
		obj.author = 'Not specified';
	}
	
	if (typeof post.title !== 'undefined') {
		obj.title = post.title;
	} else {
		obj.title = 'Not specified';
	}
	
	if (typeof post.content !== 'undefined') {
		obj.content = post.content;
	} else {
		obj.content = 'Not specified';
	}

	if (typeof post.date !== 'undefined') {
		obj.date = dateify(post.date);
	} else {
		obj.date = 'Not specified';
	}
	
	if (typeof post.link !== 'undefined') {
		//encodes the post link it to normal looks. something like: ZGFua29nYWk
		obj.link = post.link;
	} else {
		obj.link = 'Not specified';
	}
		
	
	return obj;
}

function cleanContent(descr){
	// cleans the content string from html trash and [] stuff
	var clean1 = descr.replace(/<\/?[^>]+(>|$)/g, '');
	var clean2 = clean1.replace(/\[.*?\]/g, '');
	
	return clean2;
}
function dateify(date){
	var shortDate = date.slice(0, 10);
	return shortDate;
}