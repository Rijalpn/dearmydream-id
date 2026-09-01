/**
 * MINI VINYL BGM PLAYER MODULE
 * YouTube Audio Embed for NCT DREAM Medley (UgVPGQMLP5s)
 * Non-intrusive floating vinyl record widget
 */

const YOUTUBE_VIDEO_ID = 'UgVPGQMLP5s';
let ytPlayer = null;
let isPlaying = false;
let isMuted = false;

export function initAudioPlayer() {
  // Load YouTube IFrame API asynchronously
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }

  window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new window.YT.Player('yt-bgm-embed', {
      height: '1',
      width: '1',
      videoId: YOUTUBE_VIDEO_ID,
      playerVars: {
        autoplay: 0,
        controls: 0,
        loop: 1,
        playlist: YOUTUBE_VIDEO_ID,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: () => {
          console.log('🎵 BGM Player Ready!');
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setPlayState(true);
          } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
            setPlayState(false);
          }
        }
      }
    });
  };

  bindPlayerControls();
}

function bindPlayerControls() {
  const triggerBtn = document.getElementById('vinyl-widget-trigger');
  const cardPanel = document.getElementById('vinyl-player-card');
  const playBtn = document.getElementById('vinyl-play-toggle');
  const cardCloseBtn = document.getElementById('vinyl-card-close');
  const muteBtn = document.getElementById('vinyl-mute-toggle');

  if (triggerBtn && cardPanel) {
    triggerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cardPanel.classList.toggle('active');
    });
  }

  if (cardCloseBtn && cardPanel) {
    cardCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cardPanel.classList.remove('active');
    });
  }

  // Close card when clicked outside
  document.addEventListener('click', (e) => {
    if (cardPanel && cardPanel.classList.contains('active')) {
      if (!cardPanel.contains(e.target) && e.target !== triggerBtn && !triggerBtn.contains(e.target)) {
        cardPanel.classList.remove('active');
      }
    }
  });

  if (playBtn) {
    playBtn.addEventListener('click', togglePlayback);
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', toggleMute);
  }
}

export function togglePlayback() {
  if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') {
    // If API not yet ready or blocked, toggle UI state gracefully
    setPlayState(!isPlaying);
    return;
  }

  if (isPlaying) {
    ytPlayer.pauseVideo();
    setPlayState(false);
  } else {
    ytPlayer.playVideo();
    setPlayState(true);
  }
}

function toggleMute() {
  if (!ytPlayer || typeof ytPlayer.isMuted !== 'function') return;
  const muteBtn = document.getElementById('vinyl-mute-toggle');

  if (ytPlayer.isMuted()) {
    ytPlayer.unMute();
    isMuted = false;
    if (muteBtn) muteBtn.innerHTML = '🔊';
  } else {
    ytPlayer.mute();
    isMuted = true;
    if (muteBtn) muteBtn.innerHTML = '🔇';
  }
}

function setPlayState(playing) {
  isPlaying = playing;
  const widget = document.getElementById('vinyl-widget-container');
  const playBtn = document.getElementById('vinyl-play-toggle');
  const disc = document.getElementById('vinyl-disc-icon');

  if (widget) {
    if (playing) {
      widget.classList.add('is-playing');
    } else {
      widget.classList.remove('is-playing');
    }
  }

  if (disc) {
    if (playing) {
      disc.classList.add('spinning');
    } else {
      disc.classList.remove('spinning');
    }
  }

  if (playBtn) {
    playBtn.innerHTML = playing 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg><span>Pause</span>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Play</span>`;
  }
}
