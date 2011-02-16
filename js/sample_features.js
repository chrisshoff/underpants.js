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

fetch_all = {
    execute : function(features, req, res, callback) {
        res.writeHead(200, {'Content-Type' : 'text/html'});
        res.write("<h1>Available Features:</h1>");
        for (f in features.feature_list) {
            link = "<a href='" + f + "'>" + f + "</a>";
            res.write(link + " : " + features.feature_list[f].doc() + "<br />");
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
        "/" : fetch_all,
        "/hello" : hello_world,
        "/name" : hello_name
    };
}
