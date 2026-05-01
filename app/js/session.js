const Session = (() => {
  let seq = [];
  let idx = 0;

  return {
    load(ids)    { seq = ids.filter(id => TECHNIQUES[id]); idx = 0; },
    current()    { return TECHNIQUES[seq[idx]]; },
    currentId()  { return seq[idx]; },
    getSeq()     { return [...seq]; },
    next()       { if (idx < seq.length - 1) { idx++; return true; } return false; },
    back()       { if (idx > 0) { idx--; return true; } return false; },
    jumpTo(id)   { const i = seq.indexOf(id); if (i !== -1) { idx = i; return true; } return false; },
    progress()   { return `${idx + 1} / ${seq.length}`; },
  };
})();
