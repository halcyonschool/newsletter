var WidgetController = Class.create({
  addObservers: function(event) {
    Event.observe(window, 'message', this.handleWindowMessage.bind(this));
  },
  handleWindowMessage: function(event) {
    try {
      var message = this.parseMessage(event.data);
      if (message.action == "resize iframe") {
        this.resizeWidgetIframe(message);
      }
    } catch(error) {
    }
  },
  handleDomLoaded: function() {
    this.setWidgetIframeSources();
    this.iframesNotResized = this.widgetIframeSources.clone();
  },
  parseMessage: function(message) {
    var messageObject = {};
    var data = message.split(/\s*,\s*/);
    data.each(function(key_value) {
      parts = key_value.split(': ');
      messageObject[parts[0]] = parts[1];
    });
    return messageObject;
  },
  setWidgetIframeSources: function() {
    var _this = this;
    this.widgetIframeSources = $$('iframe.ss-widget').map(function(widgetIframe) {
      return _this.getPath_(widgetIframe.src);
    });
  },
  resizeWidgetIframe: function(message) {
    var height = message.height + 'px';
    var src = message.location;
    var ignore = message.ignore == 'true';
    var src_without_scheme = this.getPath_(src);
    var widgetFrames = $$('iframe[src*="' + src_without_scheme + '"]');
    for (var i = 0; i < widgetFrames.length; i++) {
      widgetFrames[i].style.height = height;
      // For IE 8.0 the setTimeout() is a workaround otherwise it doesn't actually post the message
      // http://www.felocity.com/article/window_postmessage_problems_and_workarounds_for_ie8
      setTimeout(function() { window.parent.postMessage('action: update embed height', '*'); }, 0); // jshint ignore:line
    }
    try {
      FB.Canvas.setAutoGrow();
    } catch(error) {
    }
    try {
      var iframeNotResizedIndex = this.iframesNotResized.indexOf(src_without_scheme);
      if (iframeNotResizedIndex != -1) {
        this.setPositionToAnchor(window.top.location.hash);
        if (!ignore) {
          this.iframesNotResized.splice(iframeNotResizedIndex, 1);
        }
      }
    } catch (exception) {
    }
  },
  handleWidgetIframeLoad: function(iframe, locationHref) {
    var anchorName = iframe.up().previous('a').name;
    var locationAnchor = locationHref.split('#')[1];
    if (anchorName == locationAnchor) {
      iframe.contentWindow.postMessage("action: focus", "*");
    }
  },
  setPositionToAnchor: function(hashTag) {
    if (hashTag) {
      anchor = hashTag.split('#')[1];
      $$('a[name="' + anchor + '"]')[0].next().scrollTo();
    }
  },
  getPath_: function(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser.pathname + parser.search;
  }
});

var widgetController = new WidgetController();
widgetController.addObservers();
document.observe('dom:loaded', widgetController.handleDomLoaded.bind(widgetController));
