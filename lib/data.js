
exports.getData = function(cb, list){
	var dataUrl = 'http://88.196.48.87:8888/solr/select?q=*%3A*&rows=200&wt=json&indent=true';
	var request = require('request');
	request(dataUrl, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			// calls out data(body)
			cb(body, list)
		}
	});	
}

exports.data = function(body, cd){
	// gets the data
	var data = JSON.parse(body);
	// takes the posts from data
	var allPosts = data.response.docs;
	// specifies the lists to show
	var specialPosts = {
		'newest' : [],
		'marketing' : [],
		'cloud': [],
		'technology' : [],
		'gadget' : [],
	}
	// clean posts from html trash
	var cleanedPosts = cleanDescription(allPosts);
	// sorts all posts by date: newest first
	sortByDate(cleanedPosts);
	// specifies how many posts you want to show
	var nrOfNew = 5;
	// pushes the fresh posts to newest
	for (var fresh = 0; fresh < nrOfNew + 1; fresh++){
		specialPosts.newest.push(cleanedPosts[fresh]);
	}
	// specifies important tags
	var tags = ['marketing','cloud','technology','gadget'];
	// makes the lists of posts with the tags
	for (var x = 0; x < cleanedPosts.length; x++){
		searchCat(cleanedPosts[x], tags, specialPosts);
	}
	console.log(specialPosts.marketing.length);
	cd(specialPosts);
}

function list(s){
	return s
}

function cleanDescription(allPosts){
	var cleanedPosts = [];
	for (var x = 0; x < allPosts.length; x++){
		var desc = allPosts[x].description;
		//returns a new string
		var StrippedString = allPosts[x].description.replace(/<\/?[^>]+(>|$)/g, '');
		allPosts[x].description = StrippedString;
		cleanedPosts.push(allPosts[x]);
	}
	return cleanedPosts

}

function removeHTMLTags(){
	if(document.getElementById && document.getElementById("input-code")){
		var strInputCode = document.getElementById("input-code").innerHTML;
		/* 
			This line is optional, it replaces escaped brackets with real ones, 
			i.e. &lt; is replaced with < and &gt; is replaced with >
		*/	
		strInputCode = strInputCode.replace(/&(lt|gt);/g, function (strMatch, p1){
			return (p1 == "lt")? "<" : ">";
		});
		var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
		alert("Input code:\n" + strInputCode + "\n\nOutput text:\n" + strTagStrippedText);	
	}	
}

function sortByDate(array){
	array.sort(function(a,b){
		var x = new Date(a.date);
		var xTime = x.getTime();
		var y = new Date(b.date);
		var yTime = y.getTime();
		return yTime - xTime;
	});
}

function searchCat(onePost, tags, specialPosts){	
	var cats = onePost.category;
	if(typeof cats === 'undefined'){
		return
	} else {
		for (var x = 0; x < cats.length; x++){
			for (var y = 0; y < tags.length; y++){
				var tag = tags[y];
				if(cats[x].toLowerCase() === tags[y].toLowerCase()){
					specialPosts[tag].push(onePost);
				}
			}
		}
	}
}



	


