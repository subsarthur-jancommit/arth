"""Halaman pembanding: ketiga arah berdampingan, terbaca di ponsel."""

import alasan
import layar_a
import layar_b
import layar_c
from layar_dasar import attr

LAYAR = dict(a=layar_a, b=layar_b, c=layar_c)

PAGE_CSS = """
:root{--bg:#f2f2ef;--fg:#171716;--muted:#5b5b57;--line:#d5d5cf;--card:#fbfbf9;--chip:#e6e6e1;--focus:#2754c5;--ok:#1d6b3a;--no:#9a2b2b;--sans:'Geist',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--mono:'Geist Mono',ui-monospace,'Cascadia Mono',Consolas,monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#131312;--fg:#ecebe7;--muted:#a4a39d;--line:#31312e;--card:#1b1b1a;--chip:#262624;--focus:#8eaefc;--ok:#7fd29b;--no:#f0a0a0;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#131312;--fg:#ecebe7;--muted:#a4a39d;--line:#31312e;--card:#1b1b1a;--chip:#262624;--focus:#8eaefc;--ok:#7fd29b;--no:#f0a0a0;color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--fg);font-family:var(--sans);font-size:16px;line-height:1.55;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:10;background:var(--bg)}
.wrap{max-width:1580px;margin:0 auto;padding-block:36px 120px}
h1{font-size:clamp(30px,4.4vw,56px);line-height:1.04;letter-spacing:-.02em;margin:.15em 0 .35em;text-wrap:balance}
h2{font-size:clamp(20px,2.1vw,27px);line-height:1.2;letter-spacing:-.01em;margin:0;text-wrap:balance}
h3{font-size:16px;line-height:1.3;margin:18px 0 6px}
p{margin:0 0 .7em}
code{font-family:var(--mono);font-size:.86em;background:var(--chip);padding:.05em .3em;border-radius:3px;overflow-wrap:anywhere}
.eyebrow,.lbl{font-family:var(--mono);font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted)}
.lede{font-size:clamp(17px,1.7vw,21px);max-width:62ch}
.gab2{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:24px;margin-top:26px;align-items:start}
@media (max-width:1020px){.gab2{grid-template-columns:minmax(0,1fr)}}
.gab2 ul,.gab2 ol{padding-left:1.15em;display:grid;gap:6px;margin:0}
.gab2 li,.gab2 p{font-size:15px;line-height:1.55}
.gab td b{font-weight:600}
.keputusan{max-width:62ch;margin-top:14px;padding:12px 14px;border:1px solid var(--fg);border-radius:8px;background:var(--card)}
.same{margin-top:26px;padding-top:18px;border-top:1px solid var(--line);max-width:1120px}
.same ul{margin:10px 0 0;padding-left:1.15em;display:grid;gap:8px}
.pilih{position:sticky;top:env(safe-area-inset-top,0px);z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:6px;padding-block:10px;margin-top:26px;background:var(--bg);border-bottom:1px solid var(--line)}
.pilih span{font-family:var(--mono);font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-right:6px}
.pilih button{font:500 14px/1 var(--sans);min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer}
.pilih button[aria-pressed="true"]{background:var(--fg);color:var(--bg);border-color:var(--fg)}
button:focus-visible,.fw:focus-visible{outline:2px solid var(--focus);outline-offset:2px}
.baris{padding-block:34px 6px;border-bottom:1px solid var(--line)}
.baris>header{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:6px 24px;margin-bottom:16px}
.baris>header p{margin:0;color:var(--muted);max-width:72ch}
.tiga{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px 20px;align-items:start}
@media (max-width:1020px){.tiga{grid-template-columns:minmax(0,1fr)}}
body:not([data-arah="semua"]) .tiga{grid-template-columns:minmax(0,1fr)}
body[data-arah="a"] [data-arah]:not([data-arah="a"]),body[data-arah="b"] [data-arah]:not([data-arah="b"]),body[data-arah="c"] [data-arah]:not([data-arah="c"]){display:none}
figure{margin:0;min-width:0}
figcaption{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-top:8px;font-size:14px;line-height:1.45;color:var(--muted)}
.tag{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-family:var(--mono);font-size:12px;letter-spacing:.07em;text-transform:uppercase}
.tag i{width:16px;height:16px;border-radius:3px;border:1.5px solid}
.besar{flex:none;font:500 13px/1 var(--sans);min-height:36px;padding:0 12px;border-radius:6px;border:1px solid var(--line);background:var(--card);color:var(--fg);cursor:pointer}
.fw{position:relative;width:100%;aspect-ratio:var(--w)/var(--h);overflow:hidden;border-radius:3px;box-shadow:0 0 0 1px var(--line);background:var(--chip);cursor:zoom-in}
.fr{position:absolute;left:0;top:0;width:calc(var(--w)*1px);height:calc(var(--h)*1px);transform-origin:0 0;transform:scale(var(--k,.25))}
.duo{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.lain{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:14px;margin-top:14px;align-items:start}
.lain dl{margin:0;font-size:14px;line-height:1.45}
.lain dt{font-family:var(--mono);font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-top:10px}
.lain dt:first-child{margin-top:0}
.lain dd{margin:2px 0 0}
.ringkas article{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:16px;min-width:0}
.ringkas h2{margin:4px 0 6px}
.ringkas p{color:var(--muted);margin:10px 0 0}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.chips span{font-family:var(--mono);font-size:11.5px;letter-spacing:.05em;padding:4px 8px;border-radius:999px;background:var(--chip)}
.alasan article{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:18px;min-width:0}
.alasan ul{margin:0;padding-left:1.1em;display:grid;gap:6px}
.alasan p,.alasan li{font-size:15px;line-height:1.55}
.tbl{overflow-x:auto;margin-top:6px}
table{border-collapse:collapse;width:100%;font-size:13.5px;line-height:1.35}
th{font-family:var(--mono);font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);text-align:left;font-weight:500;padding:6px 8px 6px 0;border-bottom:1px solid var(--line)}
td{padding:7px 8px 7px 0;border-bottom:1px solid var(--line);vertical-align:top}
td.n{font-family:var(--mono);white-space:nowrap;font-variant-numeric:tabular-nums}
td.ok{color:var(--ok);font-weight:600}td.no{color:var(--no);font-weight:600}
.sw{display:inline-flex;align-items:center;justify-content:center;width:30px;height:22px;margin-right:8px;border-radius:3px;font-weight:700;font-size:12px;box-shadow:0 0 0 1px var(--line);vertical-align:middle}
.pilihan{padding-block:40px 10px;max-width:980px}
.pilihan ol{padding-left:1.2em;display:grid;gap:8px}
.sumber{margin-top:36px;font-size:14px;color:var(--muted);max-width:980px}
dialog{border:0;padding:0;width:min(1500px,96vw);max-height:92vh;background:var(--bg);color:var(--fg);border-radius:10px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
dialog::backdrop{background:rgba(0,0,0,.6)}
.lb-bar{position:sticky;top:0;display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--bg);border-bottom:1px solid var(--line);z-index:1}
.lb-bar p{margin:0 auto 0 0;font-size:14px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lb-body{overflow:auto;max-height:calc(92vh - 60px);padding:12px}
.lb-body .fw{cursor:default}
dialog.asli .lb-body .fw{width:calc(var(--w)*1px);max-width:none}
@media (max-width:640px){dialog{width:100vw;max-width:100vw;height:100vh;max-height:100vh;border-radius:0}.lb-body{max-height:calc(100vh - 60px)}}
"""

SCRIPT = """
(function(){
  var all=[].slice.call(document.querySelectorAll('.wrap .fw'));
  function fit(w){var W=+w.getAttribute('data-w');var cw=w.clientWidth;if(W&&cw)w.style.setProperty('--k',cw/W)}
  all.forEach(fit);
  if('ResizeObserver' in window){var ro=new ResizeObserver(function(es){es.forEach(function(e){fit(e.target)})});all.forEach(function(w){ro.observe(w)})}
  else{window.addEventListener('resize',function(){all.forEach(fit)})}
  var btns=[].slice.call(document.querySelectorAll('[data-pilih]'));
  function pilih(v,save){
    document.body.setAttribute('data-arah',v);
    btns.forEach(function(b){b.setAttribute('aria-pressed',String(b.getAttribute('data-pilih')===v))});
    all.forEach(fit);
    if(save){try{localStorage.setItem('r4-arah',v)}catch(e){}}
  }
  btns.forEach(function(b){b.addEventListener('click',function(){pilih(b.getAttribute('data-pilih'),true)})});
  var start='semua',h=(location.hash||'').replace('#','');
  if(/^arah-[abc]$/.test(h)){start=h.slice(5)}else{try{var s=localStorage.getItem('r4-arah');if(s)start=s}catch(e){}}
  pilih(start,false);
  var lb=document.getElementById('lb'),body=lb.querySelector('.lb-body'),cap=lb.querySelector('.lb-bar p');
  document.addEventListener('click',function(e){
    var t=e.target.closest('[data-besar]');if(!t||lb.contains(t))return;
    var src=t.classList.contains('fw')?t:t.closest('figure').querySelector('.fw');
    var fc=t.closest('figure').querySelector('figcaption span');
    body.innerHTML='';var c=src.cloneNode(true);c.removeAttribute('data-besar');body.appendChild(c);
    cap.textContent=fc?fc.textContent:'';lb.classList.remove('asli');
    if(lb.showModal){lb.showModal()}else{lb.setAttribute('open','')}
    fit(c);
  });
  lb.querySelector('[data-tutup]').addEventListener('click',function(){lb.close?lb.close():lb.removeAttribute('open')});
  lb.querySelector('[data-ukuran]').addEventListener('click',function(){
    lb.classList.toggle('asli');var c=body.querySelector('.fw');if(!c)return;
    if(lb.classList.contains('asli')){c.style.setProperty('--k',1)}else{fit(c)}
  });
})();
"""


def tag(arah, swatch):
    bg, border = swatch
    return ('<div class="tag"><i style="background:%s;border-color:%s"></i>%s · %s</div>'
            % (bg, border, arah.upper(), alasan.ARAH[arah]['nama']))


def fig(arah, swatch, body, cap, extra=''):
    return ('<figure data-arah="%s">%s%s%s<figcaption><span>%s</span><button class="besar" '
            'type="button" data-besar>Perbesar</button></figcaption></figure>'
            % (arah, tag(arah, swatch), body, extra, cap))


def plate(sym, ground, alt):
    return ('<div class="fw" data-w="1600" style="--w:1600;--h:1120" data-besar><svg class="fr" '
            'viewBox="0 0 1600 1120" width="1600" height="1120" role="img" aria-label="%s">'
            '<rect width="1600" height="1120" fill="%s"/><use href="#%s" width="1600" '
            'height="1120"/></svg></div>' % (attr(alt), ground, sym))


def row(rid, title, note, figs):
    return ('<section class="baris" id="%s"><header><h2>%s</h2><p>%s</p></header>'
            '<div class="tiga">%s</div></section>' % (rid, title, note, ''.join(figs)))
