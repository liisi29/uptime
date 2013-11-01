var request = require('request');

// finds JSON data by url
// calls back js object with data
exports.find = function (url, cb) { 
    request(url, function (error, response, body) {        
        if (error) {            
            cb(error);            
        } else if (response.statusCode !== 200) {            
            cb(new Error('Request status code not 200'));            
        } else {      
            cb(null, JSON.parse(body));
        }
    } );
};