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
            new_feature["doc"] = post_data.doc;
            new_feature["url"] = post_data.url;
            new_feature["method"] = post_data.method;
            new_feature["execute"] = function() {
                eval(post_data.js);
            }
            
        }).addListener('end', function () {
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.write("Successfully added");
            res.end();
            callback(true);
        });
    },
    doc : function() {
        return "Adds a new feature to the feature list.";
    }
}

fetch_all = {
    execute : function(features, req, res, callback) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write("<h1>Available Features:</h1>");
        feature_list = features.feature_list;
        for (p in feature_list) {
            for (m in feature_list[p]) {
                link = "<a href='" + p + "'>" + p + "</a>";
                res.write(link + " : " + features.feature_list[p][m].doc() + "<br />");
            }
        }
        res.end();
        callback(true);
    },
    doc : function() {
        return "Displays all current server features.";
    }
};

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
        "/hello" : { "GET" : hello_world },
        "/name" : { "GET" : hello_name }
    };
}
