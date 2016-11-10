function emailActionCallback() {
  new Ajax.Request('/url_forwards', {
    parameters: Form.serialize($('email_form')),
    onSuccess: function(response) {
      if(response.status == 200) {
        var errors = PieceShare.getErrorsFromResponse(response);

        if(errors) {
          $('email_error').hide();
          PieceShare.showErrorMessages($('email_errors'), errors);
          $('email_content').addClassName('errors');
        } else {
          $('email_errors').hide();
          $('email_form').hide();
          $('email_thankyou').show();
          $('email_content').removeClassName('errors');
        }
      } else {
        $('email_errors').hide();
        $('email_content').addClassName('errors');
        $('email_error').show();
      }
    }.bindAsEventListener(this),
    onFailure: function() {
      $('email_error').show();
    }.bindAsEventListener(this)
  });
}

function emailResetCallback() {
  $('email_thankyou').hide();
  $('email_form').show();
  $('forward_piece_popup_send_from').value = "";
  $('forward_piece_popup_send_to').value = "";
  $('forward_piece_popup_comment').value = "";
}

function trackShareClickForVideo(videoId) {
  new Ajax.Request('/public/widgets/videos/' + videoId + '/share_clicks');
}

function trackFirstPlayAction(widgetMapper, widgetAction, player) {
  if (player.getPlayCount() === 1) {
    widgetMapper.createAction(widgetAction);
  }
}
