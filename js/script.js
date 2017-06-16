// Get a new background image from unsplash, wait for it to load before displaying the page.
function getNewPicture() {
  var randomNum = Math.floor(Math.random() * 1e6);
  var url = 'https://source.unsplash.com/category/nature/1280x800?sig=' + randomNum;
  var img = new Image();
  img.src = url;
  $(img).on("load", function() {
    $('body').css('background-image', 'url(' + img.src + ')');
    $('.quote-container').fadeIn(1000);
    $('#new-quote').removeClass('disabled');
    $('.fa-spinner').remove();
  });
  return;
}

// Add quote text received from the Forismatic API
function showQuote(data) {
  var author = data.quoteAuthor || 'Unknown',
      quote = data.quoteText;

  $("#quote").html(
    '<p>' + quote + '</p>' +
    '<span> - ' + author + '</span>'
  );
  $('#share-quote').attr('href', 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(quote + ' -- ' + author));
  return;
}

// Disable the getQuote button, fade out the current page and call the forismatic API for a new quote
function getQuote() {
  $('#new-quote').addClass('disabled');
  $('.quote-container').fadeOut(1000).promise().done(function() {
    $('.container').prepend('<i class="fa fa-spinner fa-pulse fa-4x"></i>')
    $.getJSON('https://api.forismatic.com/api/1.0/?method=getQuote&format=jsonp&jsonp=?&lang=en')
      .done(getNewPicture, showQuote)
      .fail(function(err, statusText, errorThrown) {
        console.log(statusText + ': ' + err.status);
      });
  });
  return;
}

$(document).ready(function() {
  getQuote();
  $('#new-quote').click(getQuote);
});
