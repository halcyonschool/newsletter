WidgetActionMapper = function(){
  this.widgetActionUrl = '/public/widgets/widget_tracking_action';
};

WidgetActionMapper.prototype.createAction = function(widgetAction) {
  if (widgetAction.isValid()) {
    new Ajax.Request(this.widgetActionUrl, {
      parameters:{
        widget_id: widgetAction.widgetId,
        widget_type: widgetAction.widgetType,
        source_type: widgetAction.sourceType,
        source_id: widgetAction.sourceId,
        person_id: widgetAction.personId,
        resource_action: widgetAction.action
      }
    });
  }
};
