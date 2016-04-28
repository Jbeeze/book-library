var application_root = __dirname,
    express          = require('express'),
    bodyParser       = require('body-parser'),
    path             = require('path'),
    mongoose         = require('mongoose');

var app = express();

app.use( express.static( path.join( application_root, 'client' ) ) );
app.use(bodyParser());

var port = 4711;

app.listen(port, function() {
  console.log('Express server listening on pord %d in %s mode', port, app.settings.env);
});
