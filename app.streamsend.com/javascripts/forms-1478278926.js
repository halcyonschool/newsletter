/* Share */
try {
  Event.observe(window, 'load', function() {
    var shareURL = $('share-url');
    if (shareURL) {
      shareURL.observe('click', function() {
        shareURL.select();
      });
    }
  });
} catch (e) {}
