// Access db stuff for features.
var Feature_Manager = {
    // Saves a feature. MmmHmm.
    save : function(feature, the_db, callback) {
            the_db.open(function(err, db) {
                the_db.collection('features', function(err, collection) {
                    collection.insert(feature);
                    log.info('Feature has been persisted.');
                    callback(true);
                });
            });
    },
    // Retrieves all features. Duh.
    get_all : function(the_db, callback) {
                the_db.open(function(err, db) {
                    the_db.collection('features', function(err, collection) {
                        collection.count(function(err, count) {
                            log.info("There are " + count + " records");
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
    },
    // Removes the features collection.
    clear_all : function(the_db) {
                    the_db.open(function(err, db) {
                        the_db.collection('features', function(err, collection) {
                            collection.remove(function(err, collection) {
                                log.info('Features db collection has been cleared.');
                            });
                        });
                    });
    },
    // Adds the fake feature.
    add_fake_feature : function(the_db) {
                        Feature_Manager.save(test_feature, the_db, function(status) {
                            if (status) {
                                log.info("Feature was saved and we're done.");        
                            } else {
                                log.info("Feature didn't save correctly");
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
