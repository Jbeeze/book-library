var application_root = __dirname,
    express          = require('express'),
    bodyParser       = require('body-parser'),
    path             = require('path'),
    mongoose         = require('mongoose');

var app = express();

app.use( express.static( path.join( application_root, 'client' ) ) );
app.use(bodyParser());

mongoose.connect('mongodb://localhost/library_database');

var Keywords = new mongoose.Schema({
  keyword: String
});

var Book = new mongoose.Schema({
  title: String,
  author: String,
  releaseDate: Date,
  keywords: [Keywords]
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
    title       : req.body.title,
    author      : req.body.author,
    releaseDate : req.body.releaseDate,
    keywords    : req.body.keywords
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

app.put('/api/books/:id', function(req, res) {
  console.log('Updating book: ' + req.body.title);
  return BookModel.findById(req.params.id, function(err,book) {
    book.title       = req.body.title;
    book.author      = req.body.author;
    book.releaseDate = req.body.releaseDate;
    book.keywords    = req.body.keywords;

    return book.save(function(err) {
      if(!err) {
        console.log('book updated');
        return res.send(book);
      }
      else {
        console.log(err);
      }
    });
  });
});

app.delete('/api/books/:id', function(req, res) {
  console.log('Deleting book with id: ' + req.params.id);
  return BookModel.findById(req.params.id, function(err, book) {
    return book.remove(function(err) {
      if (!err) {
        console.log('Book removed');
        return res.send('');
      }
      else {
        console.log(err);
      }
    });
  });
});

var port = 4711;

app.listen(port, function() {
  console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});
