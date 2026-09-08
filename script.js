// Simple teleprompter logic
const editor = document.getElementById('editor');
const tele = document.getElementById('tele');
const teleText = document.getElementById('teleText');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const mirrorChk = document.getElementById('mirrorChk');

const speedInput = document.getElementById('speed');
const speedVal = document.getElementById('speedVal');
const fontSizeInput = document.getElementById('fontSize');
const fontVal = document.getElementById('fontVal');
const lhInput = document.getElementById('lineHeight');
const lhVal = document.getElementById('lhVal');

const fileInput = document.getElementById('fileInput');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');

const overlay = document.getElementById('overlay');
const countdownInput = document.getElementById('countdownInput');
const startCountdownBtn = document.getElementById('startCountdownBtn');

let running = false;
let offset = 0;
let lastTime = 0;

function loadEditorToTele(){
  const txt = editor.value.trim() || "Paste or load a script and press Start.";
  // Keep newlines as paragraphs for readable teleprompter
  teleText.innerHTML = txt.split(/\n+/).map(p => `<p>${escapeHtml(p)}</p>`).join('');
  offset = 0;
  teleText.style.transform = `translateX(-50%) translateY(0px)`;
}

function escapeHtml(s){
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

function animate(now){
  if(!running) return;
  if(!lastTime) lastTime = now;
  const dt = (now - lastTime)/1000; // seconds
  lastTime = now;
  const speed = Number(speedInput.value); // px per second
  offset += speed * dt;
  teleText.style.transform = `translateX(-50%) translateY(-${offset}px)`;
  // Stop at end (optional)
  const endOffset = teleText.clientHeight - tele.clientHeight;
  if(endOffset <= 0 || offset >= Math.max(0, endOffset + 20)){
    running = false;
    return;
  }
  requestAnimationFrame(animate);
}

startBtn.onclick = () => {
  loadEditorToTele();
  running = true;
  lastTime = 0;
  requestAnimationFrame(animate);
};
pauseBtn.onclick = () => { running = false; lastTime = 0; };
resetBtn.onclick = () => { running = false; offset = 0; teleText.style.transform = `translateX(-50%) translateY(0px)`; lastTime = 0; };
fullscreenBtn.onclick = async () => {
  if(document.fullscreenElement) await document.exitFullscreen();
  else await tele.requestFullscreen().catch(()=>{});
};
mirrorChk.onchange = () => {
  tele.style.transform = mirrorChk.checked ? 'scaleX(-1)' : 'scaleX(1)';
  teleText.style.textAlign = mirrorChk.checked ? 'right' : 'center';
};

// sliders
speedInput.oninput = ()=> speedVal.textContent = speedInput.value;
fontSizeInput.oninput = ()=> {
  fontVal.textContent = fontSizeInput.value;
  teleText.style.fontSize = fontSizeInput.value + 'px';
};
lhInput.oninput = ()=> {
  lhVal.textContent = lhInput.value;
  teleText.style.lineHeight = lhInput.value;
};

// file load
fileInput.onchange = async (e)=>{
  const f = e.target.files?.[0];
  if(!f) return;
  const txt = await f.text();
  editor.value = txt;
  loadEditorToTele();
};

// download
downloadBtn.onclick = ()=>{
  const blob = new Blob([editor.value], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'script.txt'; a.click();
  URL.revokeObjectURL(url);
};

// clear
clearBtn.onclick = ()=>{ editor.value=''; loadEditorToTele(); };

// countdown start
startCountdownBtn.onclick = async ()=>{
  const sec = Math.max(0, Math.floor(Number(countdownInput.value) || 0));
  if(sec <= 0){ startBtn.click(); return; }
  overlay.classList.remove('hidden');
  for(let i=sec;i>0;i--){
    overlay.textContent = i;
    await new Promise(r=>setTimeout(r, 1000));
  }
  overlay.classList.add('hidden');
  startBtn.click();
};

// persist simple settings
function saveSettings(){
  const s = {
    speed: speedInput.value,
    fontSize: fontSizeInput.value,
    lineHeight: lhInput.value,
    mirror: mirrorChk.checked,
    text: editor.value
  };
  localStorage.setItem('tele-settings', JSON.stringify(s));
}
function loadSettings(){
  const s = JSON.parse(localStorage.getItem('tele-settings') || '{}');
  if(s.speed) speedInput.value = s.speed;
  if(s.fontSize) fontSizeInput.value = s.fontSize;
  if(s.lineHeight) lhInput.value = s.lineHeight;
  if(typeof s.mirror === 'boolean') mirrorChk.checked = s.mirror;
  if(s.text) editor.value = s.text;
  speedVal.textContent = speedInput.value;
  fontVal.textContent = fontSizeInput.value;
  lhVal.textContent = lhInput.value;
  teleText.style.fontSize = fontSizeInput.value + 'px';
  teleText.style.lineHeight = lhInput.value;
  tele.style.transform = mirrorChk.checked ? 'scaleX(-1)' : 'scaleX(1)';
}
window.addEventListener('beforeunload', saveSettings);
editor.addEventListener('input', ()=>{ loadEditorToTele(); saveSettings(); });

// init
loadSettings();
loadEditorToTele();
