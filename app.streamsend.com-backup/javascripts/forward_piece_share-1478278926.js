var PieceShare = Class.create({
  showPieceForm: function(event) {
    $('forward_popup_overlay').show();
    $('forward_piece_popup_thankyou').hide();
    new Effect.Appear('forward_piece_popup', { queue: 'end', duration: 0.1 });
    new Effect.Scale('forward_piece_popup', 100, { scaleContent: false, duration: 0.2, scaleFrom: 10, scaleMode: { originalHeight: 260, originalWidth: 300 }, queue: 'end'});
    new Effect.Appear('forward_piece_popup_content', {duration: 0.1, queue: 'end'});
    Event.stop(event);
  },

  hidePieceForm: function(event) {
    $('forward_piece_popup').hide();
    $('forward_popup_overlay').hide();
    new Effect.Scale('forward_piece_popup', 10, { scaleContent: false, duration: 0.0, scaleFrom: 100, scaleMode: { originalHeight: 22, originalWidth: 30 }, queue: 'end'});
    if ($('forward_piece_popup_errors')) { $('forward_piece_popup_errors').hide(); }
    if ($('forward_piece_popup_content')) { $('forward_piece_popup_content').hide(); }
    Event.stop(event);
  },

  submitPiece: function(event) {
    account_hash = $('account_hash_hidden_field').value;
    new Ajax.Request('/' + account_hash + '/forward_pieces', {
      parameters: Form.serialize($('forward_piece_popup_form')),
      onSuccess: function(response) {
        this.showSubmitMessage(response);
      }.bindAsEventListener(this),
      onFailure: function() {
        this.showErrorMessage();
      }.bindAsEventListener(this)
    });
    Event.stop(event);
  },

  showErrorMessage: function() {
    $('forward_piece_popup_errors').show();
    $('forward_piece_popup_errors').update("<p>There was an error contacting the mail server.</p>");
  },

  showSubmitMessage: function(response) {
    var errors = PieceShare.getErrorsFromResponse(response);

    if (errors) {
      PieceShare.showErrorMessages($('forward_piece_popup_errors'), errors);

      // Used Effect.Scale instead of just setStyle for height due to Facebook iFrame issues
      var forward_popup_height = $('forward_piece_popup').down('ul').getHeight() + $('forward_piece_popup_content').getHeight() + 30;
      new Effect.Scale('forward_piece_popup', 100, { scaleContent: false, duration: 1.0, scaleFrom: 100, scaleMode: { originalHeight: forward_popup_height, originalWidth: 300 }, queue: 'end'});
    } else {
      $('forward_piece_popup_thankyou').show();
      $('forward_piece_recipient').innerHTML = $('forward_piece_popup_send_to').value;
      $('forward_piece_popup_errors').hide();
      $('forward_piece_popup_content').hide();
      new Effect.Scale('forward_piece_popup', 100, { scaleContent: false, duration: 1.0, scaleFrom: 100, scaleMode: { originalHeight: $('forward_piece_popup_thankyou').getHeight(), originalWidth: 300 }, queue: 'end'});
    }
  },

  checkPieceFormPop: function(url) {
    if(url.toQueryParams().social_bar_action == 'email') {
      this.showPieceForm();
    }
  },

  forwardAgain: function(event) {
    $('forward_piece_popup_thankyou').hide();
    $('forward_piece_popup_content').show();
    $('forward_piece_popup_send_to').value = "";
    new Effect.Scale('forward_piece_popup', 100, { scaleContent: false, duration: 1.0, scaleFrom: 100, scaleMode: { originalHeight: 260, originalWidth: 300 }, queue: 'end'});
    Event.stop(event);
  }
});

PieceShare.showErrorMessages = function(errorsElement, errors) {
  errorsElement.show();
  errorsElement.update("<ul>");
  errors.each(function(error) {
    errorsElement.down('ul').insert("<li>" + error[1] + "</li>");
  });
};

PieceShare.getErrorsFromResponse = function(response) {
  var errors = null;
  response_hash = new Hash(response.responseJSON);
  if (response_hash.size() > 0) {
    errors = response_hash;
  }

  return errors;
};
