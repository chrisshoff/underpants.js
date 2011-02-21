var sys = require('sys'),
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server,
    BSON = require('mongodb').BSONNative;


var host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? process.env['MONGO_NODE_DRIVER_PORT'] : Connection.DEFAULT_PORT;

var db = new Db('dynamic-node-server-mongo', new Server(host, port, {}), {native_parser:true});

// Just a simple test to verify it's working.
db.test_db = function() {
    db.open(function(err, db) {
        db.collection('features', function(err, collection) {
            collection.insert({'a':1});
            console.log('sample record added to db');
            collection.remove(function(err, collection) {
                console.log('sample record removed from db');
            });
        });
    });
};

/**
* Saves a feature. MmmHmm.
**/
db.save_feature = function(feature, callback) {
    db.open(function(err, db) {
        db.collection('features', function(err, collection) {
            collection.insert(feature);
            console.log('Feature has been persisted.');
            db.close();
            callback(true);
        });
    });
};

/**
* Retrieves all features. Duh.
**/
db.get_all_features = function(callback) {
    
    db.open(function(err, db) {
        db.collection('features', function(err, collection) {
            collection.count(function(err, count) {
                console.log("There are " + count + " records");
                features = [];
                collection.find(function(err, cursor) {
                    cursor.each(function(err, item) {
                        if (item != null) {
                            features.push(item);
                        } else {
                            callback(features);     
                        }
                    });
                });
            });
        });
    });  
};

/**
* Removes the features collection.
**/
db.clear_features = function() {
    db.open(function(err, db) {
        db.collection('features', function(err, collection) {
            collection.remove(function(err, collection) {
                console.log('Features db collection has been cleared.');
            });
        });
    });
};

/**
* Used when adding a fake feature.
*/
var test_feature = {
    name : "test_feature",
    url : "/test",
    method : "GET",
    code : "{ execute: function() {\nalert('did something');\n}, doc: function() {\nreturn 'this is a test';\n}}"
};

/**
* Adds the fake feature.
**/
db.add_fake_feature = function() {
    db.save_feature(test_feature, function(status) {
        if (status) {
            console.log("Feature was saved and we're done.");        
        } else {
            console.log("Feature didn't save correctly");
        }
    });
};

exports.db = db;
