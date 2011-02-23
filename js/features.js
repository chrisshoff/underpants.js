var url = require("url"),
    sample_features = require("./sample_features.js");

function Features(db) {
    this.db = db;
    this.feature_list = sample_features.get_sample_feature_list(this.db);
    this.parse_url = function(url_string, parse_qs) { return url.parse(url_string, parse_qs); }

    this.execute = function(req, res, callback) {
        var path = this.parse_url(req.url, false).pathname;
        var method = req.method;
        var success;
        var msg = "";

        log.info("Executing feature for path: " + method + path);
        var the_feature = this.feature_list[path] && this.feature_list[path][method];
        if (the_feature) {
            the_feature.execute(this, req, res, function(feature_success) {
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
    }
}

exports.Features = Features;
