$(document).ready(function () {
  var tweetBaseUrl = 'https://twitter.com/intent/tweet?';
  var lineBaseUrl = 'https://social-plugins.line.me/lineit/share?';
  $('a.btn-x').each(function (_, el) {
    var hashtags = $(el).attr('hashtags') ?? '';
    if (hashtags && hashtags.startsWith('#')) hashtags = hashtags.substring(1);
    var urlTweet = tweetBaseUrl + 'url=' + encodeURIComponent(window.location.href) + '&hashtags=' + encodeURIComponent(hashtags);
    $(el).attr('href', urlTweet);
  });
  $('a.btn-line').each(function (_, el) {
    var urlLine = lineBaseUrl + 'url=' + encodeURIComponent(window.location.href);
    $(el).attr('href', urlLine);
  });
});
