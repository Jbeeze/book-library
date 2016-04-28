// client/js/views/book.js

var app = app || {};

app.BookView = Backbone.View.extend({
  tagName   : 'div',
  className : 'bookContainer',
  template  : _.template( $('#bookTemplate').html() ),

  render: function() {
    this.$el.html( this.template( this.model.attributes) );

    return this;
  }
});
