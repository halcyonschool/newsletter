// Caution: do not rely on prototype being present in the preview frame.
// It is only loaded if the shared content includes a form.
var EmbeddedPieceShare = Class.create({
  initialize: function(options) {
    this.pieceViewUrl = options.pieceViewUrl;
    this.frame = $("embedded_piece_preview");
    this.frameTagTemplate = new Template('<iframe src="#{src}" id="embedded_piece_template" frameborder="0" width="100%" height="#{height}">#{noFrameContent}</iframe>');
  },

  showEmbedPopup: function(event) {
    $('embed_popup_overlay').show();
    $('embed_piece_popup_content').update(this.frameTagTemplate.evaluate({ src: this.pieceViewUrl, height: "100%", noFrameContent: "" }));
    new Effect.Appear('embed_piece_popup', { queue: 'end', duration: 0.1 });
    new Effect.Scale('embed_piece_popup', 100, {
      scaleContent: false,
      duration: 0.2,
      scaleFrom: 10,
      scaleMode: { originalHeight: 260, originalWidth: 300 },
      queue: 'end'
    });
    new Effect.Appear('embed_piece_popup_content', { duration: 0.1, queue: 'end' });
    Event.stop(event);
  },

  hideEmbedPopup: function(event) {
    $('embed_popup_overlay').hide();
    $('embed_piece_popup').hide();
    $('embed_piece_popup_content').hide();
    new Effect.Scale('embed_piece_popup', 10, {
      scaleContent: false,
      duration: 1.0,
      scaleFrom: 100,
      scaleMode: { originalHeight: 26, originalWidth: 30 },
      queue: 'end'
    });
    Event.stop(event);
  },

  checkEmbedPopUp: function(url, event) {
    if(url.toQueryParams().social_bar_action == 'embed') {
      this.showEmbedPopup(event);
    }
  },

  showEmbedCode: function() {
    Event.observe(this.frame, 'load', this.handlePreviewLoad.bind(this));
    this.frame.writeAttribute('src', this.pieceViewUrl + '?ignore_preview_iframe=1');
  },

  handlePostMessage: function(event) {
    if (typeof event.data === 'string') {
      var data = event.data.split(/\s*,\s*/);

      if (data[0] === "action: update embed height") {
        Event.stopObserving(window, 'message');
        this.handlePreviewLoad();
      }
    }
  },

  handlePreviewLoad: function() {
    Event.observe(window, 'message', this.handlePostMessage.bindAsEventListener(this));
    var instructions = '<p class="old">Copy the following HTML source and paste into desired location.</p>';
    var textarea = '<textarea id="embed_code_textarea" rows="12">' + this.getEmbedHTML() + '</textarea>';

    if ($('embed_code').select('#spinner').length > 0) {
      $("embed_code").update(instructions + textarea);
      Event.observe($("embed_code_textarea"), "click", this.handleEmbedCodeClick.bind(this));
    }
  },

  getInnerDocument: function() {
    return this.frame.contentDocument || this.frame.contentWindow.document;
  },

  findElementsByClassName: function(root, tagName, className) {
    var elements = root.getElementsByTagName(tagName);
    var matches = [];
    for(var i = 0; i < elements.length; i++) {
      var classTest = new RegExp('(^|\\s)' + className + '($|\\s)');
      if(classTest.test(elements[i].className)) {
        matches.push(elements[i]);
      }
    }
    return matches;
  },

  getHeight: function() {
    var baseHeight = this.evaluateHeight();
    var requiredFieldsCount = 0;
    var forms = this.findElementsByClassName(this.getInnerDocument(), "form", "ss-form");
    for(var i = 0; i < forms.length; i++) {
      requiredFieldsCount += this.findElementsByClassName(forms[i], "*", "required").length;
    }
    var estimatedErrorsFeedbackHeight = 100 + (requiredFieldsCount * 30);
    return baseHeight + estimatedErrorsFeedbackHeight;
  },

  getEmbedHTML: function() {
    var src = this.frame.src.split("?")[0];
    return this.frameTagTemplate.evaluate({ src: src, height: this.getHeight(), noFrameContent: this.frame.innerHTML });
  },

  handleEmbedCodeClick: function(event) {
    $(event.target).activate();
  },

  evaluateHeight: function() {
    var height = this.getInnerDocument().body.offsetHeight;
    return (height < 400) ? 400 : height;
  }
});
