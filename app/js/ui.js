const UI = (() => {
  let mode = 'sequence';
  let heardTimer = null;
  const $ = id => document.getElementById(id);

  return {
    getMode: () => mode,

    showSequence(t) {
      mode = 'sequence';
      $('preview-panel').style.display = 'flex';
      $('vid-panel').style.display = 'none';
      if (!t) return;
      $('t-num-overlay').textContent = t.label;
      $('t-name').textContent = t.name;
      const img = $('t-photo');
      const ph  = $('t-placeholder');
      img.style.display = 'none';
      ph.style.display  = 'flex';
      img.src = `photos/${t.id}.jpg`;
      img.onload  = () => { img.style.display = 'block'; ph.style.display = 'none'; };
      img.onerror = () => {};
    },

    showVideo(t) {
      mode = 'video';
      $('preview-panel').style.display = 'none';
      $('vid-panel').style.display = 'flex';
      $('vid-label').textContent = `${t.label} · ${t.name}`;
    },

    setMic(on) {
      const btn = $('mic-btn');
      btn.textContent = on ? '🔴 Listening' : '🎤 Start mic';
      btn.classList.toggle('on', on);
    },

    setHeard(text) {
      $('heard').textContent = `"${text}"`;
      clearTimeout(heardTimer);
      heardTimer = setTimeout(() => $('heard').textContent = '', 3000);
    }
  };
})();
