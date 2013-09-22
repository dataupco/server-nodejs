var https = require('https');
var qs = require('qs');

var personaPlugin = {};

personaPlugin.login = function(req, res) {

  var assertion = req.body.assertion;

  var body = qs.stringify({
    assertion: assertion,
    audience: 'http://proxy-dataupco.rhcloud.com'
  });

  var request = https.request({
    host: 'verifier.login.persona.org',
    path: '/verify',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'content-length': body.length
    }
  }, function(bidRes) {
     var data = "";
     bidRes.setEncoding('utf8');
     bidRes.on('data', function(chunk) {
       data += chunk;
     });
     bidRes.on('end', function(){
       var verified = JSON.parse(data);
       if (verified.status == 'okay') {
         res.json(verified);
       } else {
         res.writeHead(403);
       }
      res.write(data);
      res.end();
    });
  });

  request.write(body);
  request.end();
};

personaPlugin.logout = function(req, res) {
    res.json({'status' : true});
};

module.exports = personaPlugin;