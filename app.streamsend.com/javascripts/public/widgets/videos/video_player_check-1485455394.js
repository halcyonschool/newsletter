var VideoPlayerCheck = Class.create({
  initialize: function() {
  },
  executeWhenPlayerLoaded: function(callback) {
    this.numberOfCalls = 0;
    this.callback = callback;
    this.interval = setInterval(this.checkPlayer.bind(this), 100);
  },
  checkPlayer: function() {
    if (this.numberOfCalls > 4 || window.player) {
      this.callback();
      clearTimeout(this.interval);
    } else {
      this.numberOfCalls++;
    }
  }
});
