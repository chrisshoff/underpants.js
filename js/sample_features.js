var querystring = require('querystring');
    

hello_world = { 
    execute : function(features, req, res, callback) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end("Hello, World!");
        callback(true); 
    },
    doc : function() {
        return "Displays a greeting message to the user.";
    }
};

add  = {
    execute : function(features, req, res, callback) {
        
        req.addListener('data', function (POST) {
            new_feature = {}
            post_data = querystring.parse(POST);

            new_feature["name"] = post_data.name;
            new_feature["url"] = post_data.url;
            new_feature["method"] = post_data.method;
            new_feature["code"] = post_data.code;
            
        }).addListener('end', function () {
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write("Successfully added");
            res.end();
            callback(true);
        });
    },
    doc : function() {
        return "<p>Adds a new feature to the feature list.</p>" +
                "<p>The follow are required:</p>" +
                "<ul>" +
                    "<li>name [string] - unique feature name</li>" +
                    "<li>url [string] - URL to call this feature</li>" +
                    "<li>method [string] - HTTP method to use when calling this feature</li>" +
                    "<li>code [string] - js object with execute [fn] and doc [fn] attributes</li>" +
                "</ul>";
    }
}

fetch_all = {
    execute : function(features, req, res, callback) {
        feature_list = features.feature_list;
        features.db.get_all_features(features.db, function(stored_feature_list) {
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write("<h1>Available Features:</h1>");
            for (p in feature_list) {
                for (m in feature_list[p]) {
                    link = "<a href='" + p + "'>" + p + "</a> (" + m + ")";
                    res.write(link + " : " + features.feature_list[p][m].doc() + "<br />");
                }
            }

            for (q in stored_feature_list) {
                feature = stored_feature_list[q];
                try {
                    feature_code = eval('(' + feature.code + ')');
                    res.write(feature.name + " : " + feature_code.doc() + "<br />");
                } catch(e) {
                    res.write(feature.name + " :  Could not evaluate feature.<br />");                    
                }
            }
            res.end();
            callback(true); 
        });
    },
    doc : function() {
        return "Displays all current server features.";
    }
};

clear_db = {
    execute : function(features, req, res, callback) {
        features.db.clear_features(features.db);
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write("Database has been cleared.");
        res.end();
        callback(true);
    },
    doc : function() {
        return "Removes persisted features."
    }
}

test_db = {
    execute : function(features, req, res, callback) {
        features.db.add_fake_feature(features.db);
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write("New test feature added.");
        res.end();
        callback(true);
    },
    doc : function() {
        return "Adds a fake feature."
    }
}

hello_name = {
    execute : function(features, req, res, callback) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        qs = features.parse_url(req.url, true).query;
        if (qs && qs.n) {
            res.write("Hello, " + qs.n);
        } else {
            res.write("Value for name not defined. URL structure should be:<br /><br />/name?n=&lt;your_name&gt;");
        }
        res.end();
        callback(true);
    },
    doc : function() {
        return "Displays a customized greeting. Requires a querystring value for parameter 'name' (ie ?name=Bob)."
    }
};

exports.get_sample_feature_list = function() {
    return {
        "/" : {
            "GET" : fetch_all,
            "POST" : add
            },
        "/db/clear" : { "POST" : clear_db },
        "/db/test" : { "POST" : test_db },
        "/hello" : { "GET" : hello_world },
        "/name" : { "GET" : hello_name }
    };
}
