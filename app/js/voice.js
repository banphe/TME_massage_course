const Voice = (() => {
  let rec = null;
  let active = false;

  const NUM_WORDS = {
    'one':1,'two':2,'three':3,'four':4,'five':5,'six':6,'seven':7,'eight':8,'nine':9,'ten':10,
    'eleven':11,'twelve':12,'thirteen':13,'fourteen':14,'fifteen':15,
    'sixteen':16,'seventeen':17,'eighteen':18,'nineteen':19,'twenty':20,
    'twenty one':21,'twenty two':22,'twenty three':23,'twenty four':24,'twenty five':25,
    'twenty six':26,'twenty seven':27,'twenty eight':28,'twenty nine':29,'thirty':30,
    'thirty one':31,'thirty two':32,'thirty three':33,'thirty four':34,'thirty five':35,
    'thirty six':36,'thirty seven':37,'thirty eight':38,'thirty nine':39,'forty':40,
    'forty one':41,'forty two':42,'forty three':43,'forty four':44,'forty five':45,
    'forty six':46,'forty seven':47,'forty eight':48,'forty nine':49,'fifty':50,
    'fifty one':51,'fifty two':52,'fifty three':53,'fifty four':54,'fifty five':55,
    'fifty six':56,'fifty seven':57,'fifty eight':58,'fifty nine':59,'sixty':60,
    'sixty one':61,'sixty two':62,'sixty three':63,'sixty four':64,'sixty five':65,
    'sixty six':66,'sixty seven':67,'sixty eight':68,'sixty nine':69,'seventy':70,
    'seventy one':71,'seventy two':72,'seventy three':73,'seventy four':74,'seventy five':75,
    'seventy six':76,'seventy seven':77,'seventy eight':78,'seventy nine':79,'eighty':80,
    'eighty one':81,'eighty two':82,'eighty three':83,'eighty four':84,'eighty five':85,
    'eighty six':86,'eighty seven':87,'eighty eight':88,'eighty nine':89,'ninety':90,
    'ninety one':91,'ninety two':92,'ninety three':93,'ninety four':94,'ninety five':95,
    'ninety six':96,'ninety seven':97,'ninety eight':98
  };

  // technique 3 is grouped with 2 in step 1
  const ALIAS = { 3: 2 };

  function parseNum(text) {
    const keys = Object.keys(NUM_WORDS).sort((a, b) => b.length - a.length);
    for (const k of keys) if (text.includes(k)) return NUM_WORDS[k];
    const m = text.match(/\b(\d{1,2})\b/);
    return m ? parseInt(m[1]) : null;
  }

  function handle(transcript, onCmd) {
    const t = transcript.toLowerCase().trim();
    if (t.includes('next') || t.includes('forward'))   { onCmd({ type: 'next', heard: t }); return; }
    if (t.includes('back') || t.includes('previous'))  { onCmd({ type: 'back', heard: t }); return; }
    if (t.includes('stop'))                            { onCmd({ type: 'stop', heard: t }); return; }
    if (t.includes('play'))                            { onCmd({ type: 'play', heard: t }); return; }
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
        if (t.includes('next') || t.includes('back') || t.includes('stop') || t.includes('play') || parseNum(t) !== null) {
          handle(t, onCmd);
          r.stop();
          return;
        }
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
