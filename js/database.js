var sys = require('sys'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSONNative;


var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

var db = new Db('dynamic-node-server-mongo', new Server(host, port, {}), {native_parser:true});


// Just a simple test to verify it's working.
db.open(function(err, db) {
    db.collection('features', function(err, collection) {
        collection.insert({'a':1});
        console.log('sample record added to db');
        collection.remove(function(err, collection) {
            console.log('sample record removed from db');
        });
    });
});

exports.db = db;
