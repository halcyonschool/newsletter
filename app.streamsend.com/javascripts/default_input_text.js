DefaultInputText = function(inputElement, defaultText) {
  this.input = inputElement;
  this.defaultText = defaultText;

  this.setDefaultText();

  this.input.observe('focus', function() {
    this.clearDefaultText();
  }.bind(this));

  this.input.observe('blur', function() {
    this.setDefaultText();
  }.bind(this));
};

DefaultInputText.prototype.setDefaultText = function() {
  if (this.input.value === "") {
    this.input.value = this.defaultText;
    this.input.addClassName('default');
  }
};

DefaultInputText.prototype.clearDefaultText = function() {
  if(this.input.value == this.defaultText) {
    this.input.value = "";
    this.input.removeClassName('default');
  }
};
