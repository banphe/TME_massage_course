const Voice = (() => {
  let rec = null;
  let active = false;


  function parseNum(text) {
    const keys = Object.keys(NUM_WORDS).sort((a, b) => b.length - a.length);
    for (const k of keys) if (text.includes(k)) return NUM_WORDS[k];
    const m = text.match(/\b(\d{1,2})\b/);
    return m ? parseInt(m[1]) : null;
  }

  function isKnown(t) {
    return has(t, 'next', 'forward', 'back', 'previous', 'stop', 'play') || parseNum(t) !== null;
  }

  function handle(transcript, onCmd) {
    const t = transcript.toLowerCase().trim();
    if (has(t, 'next', 'forward'))  { onCmd({ type: 'next', heard: t }); return; }
    if (has(t, 'back', 'previous')) { onCmd({ type: 'back', heard: t }); return; }
    if (has(t, 'stop'))             { onCmd({ type: 'stop', heard: t }); return; }
    if (has(t, 'play'))             { onCmd({ type: 'play', heard: t }); return; }
    const n = parseNum(t);
    if (n !== null) {
      const id = ALIAS[n] || n;
      if (TECHNIQUES[id]) { onCmd({ type: 'number', value: id, heard: t }); return; }
    }
    onCmd({ type: 'unknown', heard: t });
  }

  function createRec(onCmd) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = 'en-US';
    r.continuous = true;
    r.interimResults = false;
    r.maxAlternatives = 3;
    r.onresult = e => {
      const result = e.results[e.results.length - 1];
      for (let i = 0; i < result.length; i++) {
        const t = result[i].transcript.toLowerCase().trim();
        if (isKnown(t)) { handle(t, onCmd); r.stop(); return; }
      }
      handle(result[0].transcript, onCmd);
      r.stop();
    };
    r.onerror = e => { if (e.error === 'not-allowed') active = false; };
    r.onend = () => { if (active) setTimeout(() => { rec = createRec(onCmd); rec.start(); }, 150); };
    return r;
  }

  return {
    start(onCmd) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return false;
      rec = createRec(onCmd);
      active = true;
      rec.start();
      return true;
    },
    stop() {
      active = false;
      if (rec) rec.stop();
    },
    toggle(onCmd) {
      if (active) { this.stop(); return false; }
      return this.start(onCmd);
    },
    isActive: () => active
  };
})();
