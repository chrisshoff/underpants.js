var url = require("url"),
    Feature_Manager = require("./feature_manager.js").Feature_Manager,
    sample_features = require("./sample_features.js");

function Features(db) {
    Feature_Manager.setDB(db);
    Feature_Manager.load_sample_features(sample_features.get_sample_feature_list());

    this.parse_url = function(url_string, parse_qs) { return url.parse(url_string, parse_qs); }

    this.execute = function(req, res, callback) {
        var path = this.parse_url(req.url, false).pathname;
        var method = req.method;
        var success;
        var msg = "";

        console.log("Executing feature for path: " + method + path);
        Feature_Manager.find(path, method, function(the_feature) {
            if (the_feature) {
                the_feature.execute(Feature_Manager, req, res, function(feature_success) {
                    if(feature_success) {
                        msg = "Feature executed successfully.";
                        success = true;
                    } else {
                        msg = "Feature not executed successfully.";
                        success = false;
                    }
                    callback(msg, success);
                });

            } else {
                msg = "Feature not found.";     
                success = false;
                callback(msg, success); 
            }
        });
    }
}

exports.Features = Features;
