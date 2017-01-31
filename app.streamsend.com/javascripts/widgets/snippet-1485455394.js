var Snippet = Class.create({
  initialize: function() {
    this.textareaMessage = "<b> my html </b>\nor\nhttp://www.google.com\nor\n<iframe src=\"http://www.google.com\"></iframe>";
    this.snippetContent = $('snippet_content');
    this.snippetHeight = $('snippet_height');
    this.iframeTagTemplate = new Template('<iframe src="#{src}" id="snippet_iframe" frameborder="0" width="100%" height="#{height}"></iframe>');
    this.showDefaultInstructionsIfBlank();
  },
  showResizeInstructions: function() {
    $('javascript_instructions').toggle();
    togglePlusMinus($('javascript_instructions_link'));
  },
  addObservers: function() {
    Event.observe($('javascript_instructions_link'), 'click', this.showResizeInstructions);
    Event.observe(this.snippetContent, 'focus', this.replaceDefaultInstructions.bind(this));
    Event.observe(this.snippetContent, 'blur', this.showPreview.bind(this));
    Event.observe(this.snippetHeight, 'blur', this.showPreview.bind(this));
  },
  showDefaultInstructionsIfBlank: function() {
    if (!this.snippetContent.value) {
      this.snippetContent.value = this.textareaMessage;
    }
  },
  replaceDefaultInstructions: function() {
    if (this.isDefaultText()) {
      this.snippetContent.value = '';
     }
  },
  showPreview: function() {
    if (/^(https?:\/\/[\w-]+|[\w-]+)(\.[\w-]+)\.?/i.test(this.snippetContent.value)) {
      var url = this.snippetContent.value;
      if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
      }
      $('snippet_content').value = this.iframeTagTemplate.evaluate({ src: url, height: this.snippetHeight.value + 'px' });
      $('snippet_preview').update($('snippet_content').value);
    } else if (/id="snippet_iframe"/.test(this.snippetContent.value)) {
      $('snippet_content').value = $('snippet_content').value.replace(/height=\".*\"/, "height=\"" + this.snippetHeight.value + "px\"");
      $('snippet_preview').update($('snippet_content').value);
    } else if (!this.isDefaultText()) {
      this.buildPreviewIframe();
    } else {
      // no update
    }
  },
  isDefaultText: function() {
    return this.snippetContent.value.replace(/[\n,\s+]/g, '') == this.textareaMessage.replace(/[\n,\s+]/g, '');
  },
  buildPreviewIframe: function() {
    var iframe = new Element('iframe');
    iframe.id = 'snippet_preview_iframe';
    iframe.style.border = "none";
    iframe.width = '95%';
    iframe.height = this.snippetHeight.value;
    $('snippet_preview').update(iframe);
    iframe.contentWindow.document.write(this.snippetContent.value);
    $('snippet_preview').style.height = this.snippetHeight.value + 'px';
  }
});

Snippet.bubbleResize = function(event) {
  var data = event.data.split(/\s*,\s*/);
  if(data[0] != "action: resize iframe") {
    return;
  }
  var height = data[1].split(': ')[1];
  // For IE 8.0 the setTimeout() is a workaround otherwise it doesn't actually post the message
  // http://www.felocity.com/article/window_postmessage_problems_and_workarounds_for_ie8
  setTimeout(function() { SS.resize(height); }, 0);
  $('snippet_container').style.height = height + 'px';
  if ($('snippet_iframe')) {
    $('snippet_iframe').height = height;
  }
};
