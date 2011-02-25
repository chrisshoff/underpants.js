var querystring = require('querystring');
    

hello_world = { 
    execute : function(Feature_Manager, req, res, callback) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.end("Hello, World!");
        callback(true); 
    },
    doc : function() {
        return "Displays a greeting message to the user.";
    }
};

add  = {
    execute : function(Feature_Manager, req, res, callback) {
        
        req.addListener('data', function (POST) {
            new_feature = {}
            post_data = querystring.parse(POST);

            new_feature["name"] = post_data.name;
            new_feature["url"] = post_data.url;
            new_feature["method"] = post_data.method;
            new_feature["code"] = post_data.code;
            
            Feature_Manager.save(new_feature, function(status) {});
            
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
    execute : function(Feature_Manager, req, res, callback) {
        feature_list = Feature_Manager.get_sample_features();
        Feature_Manager.get_all(function(stored_feature_list) {
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write("<h1>Available Features:</h1>");
            for (p in feature_list) {
                for (m in feature_list[p]) {
                    link = "<a href='" + p + "'>" + p + "</a> (" + m + ")";
                    res.write(link + " : " + feature_list[p][m].doc() + "<br />");
                }
            }
            res.write("<h2>Stored features:</h2>")
            for (q in stored_feature_list) {
                feature = stored_feature_list[q];
                res.write("Name: " + feature.name + "<br/>")
                res.write("Url: " + feature.method + " at " + feature.url + "<br/>")

                try {
                    feature.code = eval('(' + feature.code + ')');
                    res.write("Doc: " + feature.code.doc() + "<br />");
                } catch(e) {
                    res.write("Doc: Error evaluating feature.<br />");                    
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
    execute : function(Feature_Manager, req, res, callback) {
        Feature_Manager.clear_all();
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
    execute : function(Feature_Manager, req, res, callback) {
        Feature_Manager.add_fake_feature();
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
    execute : function(Feature_Manager, req, res, callback) {
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
