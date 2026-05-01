const Player = (() => {
  let ytPlayer = null;
  let loopStart = 0;

  window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player('yt-player', {
      height: '100%',
      width: '100%',
      playerVars: { controls: 0, rel: 0, modestbranding: 1 },
      events: {
        onStateChange: e => {
          if (e.data === YT.PlayerState.ENDED) {
            ytPlayer.seekTo(loopStart, true);
            ytPlayer.playVideo();
          }
        }
      }
    });
  };

  return {
    play(videoId, start, end) {
      if (!ytPlayer) return;
      loopStart = start;
      ytPlayer.loadVideoById({ videoId, startSeconds: start, endSeconds: end });
    },
    stop() {
      if (ytPlayer) ytPlayer.stopVideo();
    }
  };
})();
