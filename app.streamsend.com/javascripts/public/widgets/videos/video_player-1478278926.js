var VideoPlayer = Class.create({
  initialize: function(targetElementId, width, height, videoId) {
    this.isReady = false;
    this.youtubePlayer = new YT.Player(targetElementId, {
      width: width,
      height: height,
      videoId: videoId,
      playerVars: {
        'wmode': 'transparent',
        'rel': 0,
        'showinfo': 0,
        'modestbranding': 1
      }
    });

    this.youtubePlayer.addEventListener('onReady', this.onReady.bind(this));

    this.playCount = 0;
    this.timedActions = [];
    this.stateActions = [];
  },
  onReady: function() {
    this.isReady = true;
    if (VideoPlayer.autoplay && this.notIOS()) {
      this.playVideo();
    }

    this.youtubePlayer.addEventListener('onStateChange', this.onStateChange.bind(this));
  },
  onStateChange: function(stateEvent) {
    if (stateEvent.data == YT.PlayerState.PLAYING) {
      this.playCount++;
      this.stateActions.each(function(action){
        action();
      });

      if (!this.actionProcessor) {
        this.actionProcessor = new PeriodicalExecuter(this.processTimedActions.bind(this), 1);
      }
    }
    else if (this.actionProcessor) {
      this.actionProcessor.stop();
      this.actionProcessor = null;
    }
  },
  playVideo: function() {
    this.youtubePlayer.playVideo();
  },
  pauseVideo: function() {
    this.youtubePlayer.pauseVideo();
  },
  isReadyState: function() {
    return this.isReady;
  },
  registerTimedPlayAction: function(action, interval) {
    this.timedActions.push(new VideoPlayer.Action(action, interval));
  },
  registerStateAction: function(action) {
    this.stateActions.push(action);
  },
  processTimedActions: function() {
    videoTime = this.youtubePlayer.getCurrentTime();
    this.timedActions.each( function(action) {
      if (action.shouldExecute(videoTime)) {
        action.execute();
      }
    });
  },
  getPlayCount: function() {
    return this.playCount;
  },
  notIOS: function() {
    return navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? false : true;
  }
});

VideoPlayer.Action = Class.create({
  initialize: function(callback, interval) {
    this.callback = callback;
    this.interval = interval;
  },
  shouldExecute: function(time) {
    return (time >= this.interval) && (!this.wasExecuted);
  },
  execute: function() {
    this.wasExecuted = true;
    this.callback();
  }
});

VideoPlayer.listenToPlayEvent = function() {
  Event.observe(window, 'message', function(event) {
    if (event.data == "action: focus") {
      if (window.player && player.isReady && player.notIOS()) {
        player.playVideo();
      } else {
        VideoPlayer.autoplay = true;
      }
    }
  });
};

VideoPlayer.autoplay = false;
VideoPlayer.listenToPlayEvent();

var tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

