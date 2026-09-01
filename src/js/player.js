/**
 * MINI VINYL BGM PLAYER MODULE
 * YouTube Audio Player with Playlist (UNKNOWN, BOOM, CANDY)
 * Features: Next, Prev, Play/Pause, Mute, and Auto-Advance
 */

const PLAYLIST = [
  {
    title: 'UNKNOWN',
    artist: 'NCT DREAM',
    videoId: 'UgVPGQMLP5s'
  },
  {
    title: 'BOOM',
    artist: 'NCT DREAM',
    videoId: 'X-iJZ0gfKPo'
  },
  {
    title: 'CANDY',
    artist: 'NCT DREAM',
    videoId: 'zuoSn3ObMz4'
  }
];

let currentTrackIndex = 0;
let ytPlayer = null;
let isPlaying = false;
let isMuted = false;
let isPlayerReady = false;

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
      videoId: PLAYLIST[currentTrackIndex].videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        playsinline: 1,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: () => {
          isPlayerReady = true;
          console.log('🎵 7Dream BGM Player Ready!');
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setPlayState(true);
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setPlayState(false);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            // Auto advance to next song
            nextTrack(true);
          }
        }
      }
    });
  };

  bindPlayerControls();
  updateTrackDisplay();
}

function bindPlayerControls() {
  const triggerBtn = document.getElementById('vinyl-widget-trigger');
  const cardPanel = document.getElementById('vinyl-player-card');
  const playBtn = document.getElementById('vinyl-play-toggle');
  const prevBtn = document.getElementById('vinyl-prev-btn');
  const nextBtn = document.getElementById('vinyl-next-btn');
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

  if (prevBtn) {
    prevBtn.addEventListener('click', () => prevTrack(isPlaying));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => nextTrack(isPlaying));
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', toggleMute);
  }
}

export function togglePlayback() {
  if (!isPlayerReady || !ytPlayer || typeof ytPlayer.getPlayerState !== 'function') {
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

export function nextTrack(autoPlay = true) {
  currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
  loadActiveTrack(autoPlay);
}

export function prevTrack(autoPlay = true) {
  currentTrackIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  loadActiveTrack(autoPlay);
}

function loadActiveTrack(autoPlay = true) {
  updateTrackDisplay();
  const track = PLAYLIST[currentTrackIndex];

  if (isPlayerReady && ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
    if (autoPlay) {
      ytPlayer.loadVideoById(track.videoId);
      setPlayState(true);
    } else {
      ytPlayer.cueVideoById(track.videoId);
    }
  }
}

function updateTrackDisplay() {
  const track = PLAYLIST[currentTrackIndex];
  const titleEl = document.getElementById('vinyl-track-title');
  const artistEl = document.getElementById('vinyl-track-artist');
  const tagEl = document.getElementById('vinyl-track-counter');

  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist;
  if (tagEl) tagEl.textContent = `🎵 ${currentTrackIndex + 1}/${PLAYLIST.length}`;
}

function toggleMute() {
  if (!isPlayerReady || !ytPlayer || typeof ytPlayer.isMuted !== 'function') return;
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
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg><span>Pause</span>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg><span>Play</span>`;
  }
}
