define("scribe-plugin-video-command", ["jquery"], function($) {
  return function(options) {
    options = options || {};
    var regexYoutube = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube\.com\S*[^\w\-\s])([\w\-]{11})(?=[^\w\-]|$)(?![?=&+%\w.\-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
    var regexVimeo = /https?:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;

    return function(scribe) {
      scribe.commands.video = new scribe.api.Command('insertHTML');
      scribe.commands.video.nodeName = 'IMG';
      scribe.commands.video.execute = function() {
        var url = window.prompt('Enter a video link.', 'http://');

        if (!url) {
          return false;
        } else if (url.match(regexYoutube)) {
          url = url.match(regexYoutube)[0];
        } else if (url.match(regexVimeo)) {
          url = url.match(regexVimeo)[0];
        }

        var loadingId = scribe.loading();

        $.ajax({
          url: options.scraperUrl,
          data: {
            url: url
          },
          success: function(response) {
            var data = {url: response.url, title: response.title, width: response.width, height: response.height};
            scribe.replaceLoading(loadingId, "<img src='"+ response.image +"' type='video' data='" + JSON.stringify(data) + "'></img>");
          }
        });
      };
    };
  };
});
