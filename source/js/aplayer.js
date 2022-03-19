!(function() {
  var oldLoadAp = window.onload;
  window.onload = function () {
    oldLoadAp && oldLoadAp();

    new APlayer({
      container: document.getElementById('aplayer'),
      fixed: true,
      autoplay: false,
      loop: 'all',
      order: 'random',
      theme: '#b7daff',
      preload: 'none',
      lrcType: 3,
      audio: [
        {
          name: '海啸',
          artist: 'Soler',
          url: '/songs/Soler - 海啸.mp3',
          cover: '/songs/Soler - 海啸.jpeg',
          lrc: '/songs/Soler - 海啸.lrc'
        }
      ]
    });
  }
})();