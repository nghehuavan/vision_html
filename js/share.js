$(document).ready(function () {
  var tweetBaseUrl = 'https://twitter.com/intent/tweet?';
  var lineBaseUrl = 'https://social-plugins.line.me/lineit/share?';
  $('a.btn-x').each(function (_, el) {
    var hashtags = $(el).attr('hashtags');
    var urlTweet = tweetBaseUrl + 'url=' + encodeURIComponent(window.location.href) + (hashtags ? '&hashtags=' + encodeURIComponent(hashtags.split(' ').join(' #')) : '');
    $(el).attr('href', urlTweet);
  });
  $('a.btn-line').each(function (_, el) {
    var urlLine = lineBaseUrl + 'url=' + encodeURIComponent(window.location.href);
    $(el).attr('href', urlLine);
  });
});
