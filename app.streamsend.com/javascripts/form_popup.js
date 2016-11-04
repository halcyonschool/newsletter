var FormPopup = Class.create({
  initialize: function(formEndpointUrl) {
    this.formEndpointUrl = formEndpointUrl;
    Event.observe($('form_popup_close_button'), 'click', this.hidePopup.bind(this));
  },
  showPopup: function(formId) {
    Event.observe($('form_show_iframe'), 'load', this.showPopupOnLoad.bind(this));
    $('form_show_iframe').src = this.formEndpointUrl.replace('{id}', formId);
  },
  onMessage: function(event) {
    var eventData;
    try {
      eventData = JSON.parse(event.data);
    } catch(e) {
    }
    if (eventData && eventData.action == 'show form') {
      this.videoId = eventData.videoId;
      this.showPopup(eventData.formId, eventData.videoId);
    }
  },
  showPopupOnLoad: function() {
    $('form_show_iframe').stopObserving('load');
    this._setPopupStyling();
    $('form_popup').show();
    $('form_popup_content').show();
    this.center();
  },
  hidePopup: function(event) {
    $('form_popup').hide();
    $('form_popup_content').hide();
    Event.stop(event);
  },
  center: function() {
    var dimensions = $('form_popup').getDimensions();
    var screenWidth = this.videoIframe().style.width;
    var left = (parseInt(screenWidth, 10) - dimensions.width)/2;
    $('form_popup').style.left = left + 'px';
  },
  videoIframe: function() {
    return $(this.videoId).up();
  },
  _setPopupStyling: function() {
    var form_popup = $('form_popup');
    this.videoIframe().style.position = 'relative';
    form_popup.style.position = 'absolute';
    form_popup.style.top = '0px';
    form_popup.style.left = '0px';
    this.videoIframe().insert({'top':$('form_popup')});
  }
});

