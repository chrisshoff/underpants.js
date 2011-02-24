
// Access db stuff for features.
var Feature_Manager = {
    
    db : undefined,
    connection : undefined,
    
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
            this.db.open(function(err, db) {
                db.collection('features', function(err, collection) {
                    callback(collection);
                });
            });
        }
    },
    
    // Saves a feature. MmmHmm.
    save : function(feature, callback) {
        this._get_feature_collection(function(collection) {
            collection.insert(feature);
            console.log('Feature has been persisted.');
            callback(true);
        });
    },
    // Retrieves all features. Duh.
    get_all : function(callback) {
        this._get_feature_collection(function(collection) {
            collection.count(function(err, count) {
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
    },
    // Removes the features collection.
    clear_all : function() {
        this._get_feature_collection(function(collection) {
            collection.remove(function(err, collection) {
                console.log('Features db collection has been cleared.');
            });
        });
    },
    // Finds a feature by path and method
    find : function(path, method, feature_list, callback) {
            this.get_all(function(features) {
                for (feature in features) {
                    if (feature.path == path && feature.method == method) callback(feature);
                }
                callback(feature_list[path] && feature_list[path][method]);         
            });
    },
    // Adds the fake feature.
    add_fake_feature : function() {
        this.save(test_feature, function(status) {
            if (status) {
                console.log("Feature was saved and we're done.");        
            } else {
                console.log("Feature didn't save correctly");
            }
        });
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