// MASTER HACKER - frontend direct (key embedded)
const API_KEY = "590422c9c4c94d499464530f4fe3337b"; // <- tumhari di hui key

const menu = document.querySelectorAll('.menu button');
const output = document.getElementById('terminal-output');
const input = document.getElementById('input-field');
const runBtn = document.getElementById('run-btn');
let view = 'phone';

menu.forEach(b=>{
  b.addEventListener('click', ()=>{
    menu.forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    view = b.dataset.view;
    output.innerHTML = `Selected: ${view.toUpperCase()}\n` + startBanner();
    input.placeholder = view==='phone'?'+92300...': view==='email'?'name@example.com': view==='iban'? 'PK36...':'VAT number or IBAN';
  });
});

function startBanner(){
  return `> MASTER HACKER ☠️💀\n> Ready. Enter value and press SCAN.\n`;
}

runBtn.addEventListener('click', run);
input.addEventListener('keydown',e=>{ if(e.key==='Enter') run();});

function writeLine(txt, color){
  const el = document.createElement('div'); el.textContent = txt; if(color) el.style.color=color; output.appendChild(el); output.scrollTop = output.scrollHeight;
}

async function run(){
  const val = input.value.trim(); if(!val){writeLine('No input provided', 'var(--red)');return}
  writeLine(`> Scanning (${view}): ${val}`);
  writeLine('> contacting server (AbstractAPI)...');

  // Build endpoint per view
  let url = "";
  if(view === "phone"){
    // phone validation
    // Accept numbers with or without +. AbstractAPI expects full number
    url = `https://phonevalidation.abstractapi.com/v1/?api_key=${API_KEY}&phone=${encodeURIComponent(val)}`;
  } else if(view === "email"){
    url = `https://emailvalidation.abstractapi.com/v1/?api_key=${API_KEY}&email=${encodeURIComponent(val)}`;
  } else if(view === "emailrep"){
    url = `https://emailreputation.abstractapi.com/v1/?api_key=${API_KEY}&email=${encodeURIComponent(val)}`;
  } else if(view === "vat"){
    url = `https://vat.abstractapi.com/v1/?api_key=${API_KEY}&vat_number=${encodeURIComponent(val)}`;
  } else if(view === "iban"){
    url = `https://ibanvalidation.abstractapi.com/v1/?api_key=${API_KEY}&iban=${encodeURIComponent(val)}`;
  } else {
    writeLine('Unknown view', 'var(--red)'); return;
  }

  try{
    const res = await fetch(url);
    if(!res.ok){
      const txt = await res.text();
      throw new Error('API error '+res.status + ' - ' + txt);
    }
    const data = await res.json();
    writeLine('> result:');
    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(data, null, 2);
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.color = 'var(--blue)';
    output.appendChild(pre);
    output.scrollTop = output.scrollHeight;
  }catch(err){
    writeLine('> error: '+err.message, 'var(--red)');
  }
}

// init
output.innerHTML = startBanner();
