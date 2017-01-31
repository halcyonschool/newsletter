var ShareOverlay = function(targetElement, badgeElement, optionsElement, shareOptions) {
  this.targetElement = targetElement;
  this.badgeElement = badgeElement;
  this.optionsElement = optionsElement;
  this.optionsElement.hide();
  this.overlayElement = new Element('div', {id: 'overlay'});
  this.overlayElement.hide();
  this.targetElement.insert({
    after: this.overlayElement
  });

  this.shareOptions = shareOptions;

  this.toolPanel = new Element('div', {id: 'toolPanel'});
  this.optionsElement.wrap(this.toolPanel);
  this.toolPanel.insert({top: this.badgeElement});

  this.addEventListeners();
};

ShareOverlay.prototype.addEventListeners = function() {
  this.toolPanel.observe('mouseover', this.handleMouseOver.bind(this));
  this.toolPanel.observe('mouseout', this.handleMouseOut.bind(this));

  this.shareOptions.each(function(option) {
    if(option.openElement) {
      option.openElement.observe('click', this.handleOpen.bind(this, option));
    }

    if(option.closeElement) {
       option.closeElement.observe('click', this.handleClose.bind(this, option));
    }

    if(option.actionElement) {
      option.actionElement.observe('click', option.actionCallback);
    }

    if(option.resetElement) {
      option.resetElement.observe('click', option.resetCallback);
    }
  }.bind(this));
};

ShareOverlay.prototype.handleMouseOver = function() {
  this.badgeElement.hide();
  this.optionsElement.show();
};

ShareOverlay.prototype.handleMouseOut = function() {
  if(!this.showOptions) {
    this.showBadge();
  }
};

ShareOverlay.prototype.showBadge = function(){
    this.optionsElement.hide();
    this.badgeElement.show();
};

ShareOverlay.prototype.handleOpen = function(option) {
  this.shareOptions.each(function(option) {
    if(option.contentElement) {
      option.contentElement.hide();
    }

    this.deactivateOption(option);
  }.bind(this));

  this.overlayElement.show();
  option.contentElement.show();
  option.openElement.addClassName('active');
  this.showOptions = true;

  if(option.openCallback) {
    option.openCallback();
  }
};

ShareOverlay.prototype.handleClose = function(option, event) {
  event.preventDefault();

  this.deactivateOption(option);

  option.contentElement.hide();
  this.overlayElement.hide();
  this.showBadge();
  this.showOptions = false;

  if(option.closeCallback) {
    option.closeCallback();
  }
};

ShareOverlay.prototype.handleCloseAction = function(option, callback, event) {
  callback(event);
  this.handleClose(option, event);
};

ShareOverlay.prototype.deactivateOption = function(option) {
  if(option.openElement) {
    option.openElement.removeClassName('active');
  }
};
