var http = require('http'),
    url = require('url'),
    Features = require('./js/features.js').Features,
    db = require('./js/database.js').db,
    emitter = new(require('events').EventEmitter),
    
features = new Features(db);

var app = http.createServer(function (req, res) {
    features.execute(req, res, function(msg, success) {
        console.log(msg);
        if (!success) {
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write('<h1>Error</h1>');
            res.write(msg);
            res.end();
        }
    });
});
app.listen(8080);
console.log('server running at http://127.0.0.1:8080/');
