const UI = (() => {
  let heardTimer = null;
  const $ = id => document.getElementById(id);

  return {
    render(t, mode) {
      const isVideo = mode === 'video';
      $('preview-panel').style.display = isVideo ? 'none' : 'flex';
      $('vid-panel').style.display     = isVideo ? 'flex' : 'none';
      if (!t) return;
      if (isVideo) {
        $('vid-label').textContent = `${t.label} · ${t.name}`;
      } else {
        $('t-num-overlay').textContent = t.label;
        $('t-name').textContent = t.name;
        const img = $('t-photo');
        const ph  = $('t-placeholder');
        img.style.display = 'none';
        ph.style.display  = 'flex';
        img.src = `photos/${t.id}.jpg`;
        img.onload  = () => { img.style.display = 'block'; ph.style.display = 'none'; };
        img.onerror = () => {};
      }
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
