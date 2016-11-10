WidgetAction = function(widgetId, widgetType, action, sourceType, sourceId, personId) {
  this.widgetId = widgetId;
  this.widgetType = widgetType;
  this.action = action;
  this.sourceType = sourceType;
  this.sourceId = sourceId;
  this.personId = personId;
};

WidgetAction.ACTION = {
  play : "play",
  playTime: "playTime"
};

WidgetAction.WIDGET_TYPE = {
  video :  "video",
  form :  "form"
};

WidgetAction.prototype.isValid = function() {
  return this.nonEmptyString(this.widgetId)   &&
         this.nonEmptyString(this.widgetType) &&
         this.nonEmptyString(this.action)     &&
         this.nonEmptyString(this.sourceType) &&
         this.nonEmptyString(this.sourceId);
};

WidgetAction.prototype.nonEmptyString = function(string) {
  return ((typeof string != "undefined") && !string.empty());
};
