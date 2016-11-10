SS = {};

SS.resize = function(height, ignore) {
  if (typeof ignore === 'undefined') {
    ignore = false;
  }
  parent.postMessage('action: resize iframe, height: ' + height + ', location: ' + location.href + ', ignore: ' + ignore, '*');
  parent.postMessage(JSON.stringify({
    action: 'resize iframe',
    height: height,
    location: location.href,
    ignore: ignore
  }), '*');
};

SS.closeDialog = function(widgetType, oldWidgetId, newWidgetId) {
  var message = JSON.stringify({action: 'close dialog', widgetType: widgetType, oldWidgetId: oldWidgetId, newWidgetId: newWidgetId});
  parent.postMessage(message, '*');
};

SS.previewLinkDisabledAlert = function() {
  alert('This link is disabled for previewing.');
  return false;
};
