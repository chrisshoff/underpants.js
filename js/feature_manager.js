var Log = require('./log.js');

log = new Log(Log.INFO);

// Access db stuff for features.
var Feature_Manager = {
    
    db : undefined,
    connection : undefined,
    sample_features : undefined,
    
    setDB : function(a_db) {
        this.db = a_db;
    },
    
    setConnection : function(the_connection) {
        this.connection = the_connection;
    },
    
    // Grabs the features collection.
    _get_feature_collection : function(callback) {
        // If we have a connection, use it
        if (this.db.state == 'connected') {
            this.db.collection('features', function(err, collection) {
                callback(collection);
            });
        } else {
            this.db.open(function(err, the_db) {
                the_db.collection('features', function(err, collection) {
                    callback(collection);
                });
            });
        }
    },
    
    // Saves a feature. MmmHmm.
    save : function(feature, callback) {
        this._get_feature_collection(function(collection) {
            collection.insert(feature);
            callback(true);
        });
    },
    // Retrieves all features. Duh.
    get_all : function(get_all_callback) {
        this._get_feature_collection(function(collection) {
            collection.find(function(err, cursor) {
                var features = [];
                cursor.each(function(err, item) {
                    if (item != null) {
                        features.push(item);
                    } else {
                        get_all_callback(features);
                    }
                });
            });
        });  
    },

    // Removes the features collection.
    clear_all : function() {
        this._get_feature_collection(function(collection) {
            collection.remove(function(err, collection) {
                log.info('Features db collection has been cleared.');
            });
        });
    },
    // Finds a feature by path and method
    find : function(path, method, find_callback) {
            var feature_list = this.get_sample_features();
            this.get_all(function(features) {
                var found_feature;
                for (feature in features) {
                    if (feature.path == path && feature.method == method) {
                        found_feature = feature;
                    }
                }
                if (found_feature) {
                    find_callback(found_feature);
                } else {
                    find_callback(feature_list[path] && feature_list[path][method]);         
                }
            });
    },
    // Adds the fake feature.
    add_fake_feature : function() {
        this.save(test_feature, function(status) {
            if (status) {
                log.debug("Feature was saved and we're done.");        
            } else {
                log.debug("Feature didn't save correctly");
            }
        });
    },
    
    load_sample_features : function(feature_list) {
        this.sample_features = feature_list;
    },
    
    get_sample_features : function() {
        return this.sample_features;
    }
}

// Used when adding a fake feature.
var test_feature = {
    name : "test_feature",
    url : "/test",
    method : "GET",
    code : "{execute:function(){alert('did something');},doc:function(){return 'this is a test';}}"
};

exports.Feature_Manager = Feature_Manager;
