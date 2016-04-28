var application_root = __dirname,
    express          = require('express'),
    bodyParser       = require('body-parser'),
    path             = require('path'),
    mongoose         = require('mongoose');

var app = express();

app.use( express.static( path.join( application_root, 'client' ) ) );
app.use(bodyParser());

mongoose.connect('mongodb://localhost/library_database');

var Book = new mongoose.Schema({
  title: String,
  author: String,
  releaseDate: Date
});

var BookModel = mongoose.model('Book', Book);

app.configure(function() {
  app.use( express.bodyParser() );
  app.use( express.methodOverride() ) ;
  app.use( app.router );
  app.use( express.static( path.join( application_root, 'client') ) );
  app.use( express.errorHandler( { dumpExceptions: true, showStack: true} ) );
});

app.get('/api', function(req,res) {
  res.send('Library API running');
});

app.get('/api/books', function(req, res) {
  return BookModel.find(function(err, books) {
    if(!err) {
      return res.send(books);
    }
    else {
      return console.log(err);
    }
  });
});

app.post('/api/books', function(req, res) {
  var book = new BookModel({
    title: req.body.title,
    author: req.body.author,
    releaseDate: req.body.releaseDate
  });

  return book.save(function(err) {
    if(!err) {
      console.log('created');
      return res.send(book);
    }
    else {
      console.log(err);
    }
  });
});

app.get('/api/books/:id', function(req, res) {
  return BookModel.findById( req.params.id, function(err,book) {
    if(!err) {
      return res.send(book);
    }
    else {
      return console.log(err);
    }
  });
});

var port = 4711;

app.listen(port, function() {
  console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});
