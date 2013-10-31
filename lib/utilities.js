var request = require('request');

exports.find = function (url, cb) { 
    request(url, function (error, response, body) {        
        if (error) {            
            cb(error);            
        } else if (response.statusCode !== 200) {            
            cb(new Error('Status code not 200'));            
        } else {            
            cb(null, JSON.parse(body));
        }
    } );
}