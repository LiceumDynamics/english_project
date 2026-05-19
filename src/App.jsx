import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, ArrowLeft } from 'lucide-react';

/* =====================================================
   THE HEALTH ALMANAC — single-file React app
   Editorial almanac aesthetic: cream + ink + vermillion
   ===================================================== */

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..900,0..100;1,9..144,300..900,0..100&family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300..700&family=JetBrains+Mono:wght@400;500&display=swap');

.almanac {
  --bg:#EFE8D8; --paper:#F6F1E2; --ink:#14130F; --ink-soft:#3B3833;
  --ink-mute:#6E6A60; --rule:#CDC4AE; --accent:#D94B2A; --olive:#515032; --teal:#2E4A48;
  --f-display:'Fraunces',serif; --f-italic:'Instrument Serif',serif;
  --f-body:'DM Sans',system-ui,sans-serif; --f-mono:'JetBrains Mono',ui-monospace,monospace;
  background:var(--bg); color:var(--ink); font-family:var(--f-body); font-size:16px;
  line-height:1.55; min-height:100vh; position:relative; overflow-x:hidden;
  font-feature-settings:"ss01","kern","liga"; letter-spacing:-0.005em;
}
.almanac *, .almanac *::before, .almanac *::after { box-sizing:border-box; margin:0; padding:0; }
.almanac::before {
  content:""; position:absolute; inset:0; pointer-events:none; z-index:1; opacity:.35;
  mix-blend-mode:multiply;
  background-image:
    radial-gradient(circle at 25% 30%, rgba(20,19,15,.04) 1px, transparent 1px),
    radial-gradient(circle at 70% 60%, rgba(20,19,15,.05) 1px, transparent 1px),
    radial-gradient(circle at 50% 80%, rgba(20,19,15,.03) 1px, transparent 1.5px);
  background-size:7px 7px,11px 11px,5px 5px;
}
.almanac > * { position:relative; z-index:2; }

.eyebrow { font-family:var(--f-mono); font-size:11px; letter-spacing:0.22em;
  text-transform:uppercase; color:var(--ink-soft); font-weight:500; }
.eyebrow .dot { display:inline-block; width:6px; height:6px; background:var(--accent);
  border-radius:50%; margin:0 .55em .14em .25em; vertical-align:middle; }

.wrap { max-width:1320px; margin:0 auto; padding:0 clamp(1.25rem,3.5vw,3rem); }

/* ===== Masthead ===== */
.masthead { border-bottom:1px solid var(--ink); background:var(--bg);
  position:sticky; top:0; z-index:50; backdrop-filter:blur(6px); }
.masthead-inner { display:grid; grid-template-columns:1fr auto 1fr;
  align-items:center; padding:14px clamp(1.25rem,3.5vw,3rem); gap:24px; }
.meta-l, .meta-r { font-family:var(--f-mono); font-size:10.5px;
  letter-spacing:0.18em; text-transform:uppercase; color:var(--ink-soft); }
.meta-r { text-align:right; }
.meta-r .accent { color:var(--accent); font-weight:500; }
.brand { font-family:var(--f-display); font-variation-settings:"opsz" 144,"SOFT" 100,"wght" 500;
  font-size:clamp(20px,2.2vw,26px); letter-spacing:-0.025em; text-align:center;
  white-space:nowrap; background:none; border:0; cursor:pointer; color:var(--ink); padding:0; }
.brand sup { font-family:var(--f-italic); font-style:italic; font-size:.55em;
  color:var(--accent); margin-left:4px; font-variation-settings:normal; }

.subnav { border-bottom:1px solid var(--ink); background:var(--paper); }
.subnav ul { list-style:none; display:flex; padding:0 clamp(1.25rem,3.5vw,3rem);
  max-width:1320px; margin:0 auto; overflow-x:auto; }
.subnav li { flex:0 0 auto; }
.subnav button { display:inline-flex; align-items:baseline; gap:10px;
  padding:12px 22px 12px 0; margin-right:22px; background:none; border:0;
  cursor:pointer; color:var(--ink-soft); font-size:13px; font-weight:500;
  font-family:inherit; transition:color .2s ease; }
.subnav button:hover { color:var(--ink); }
.subnav button.active { color:var(--ink); }
.subnav button .num { font-family:var(--f-mono); font-size:10px;
  letter-spacing:0.12em; color:var(--accent); }

/* ===== Cover hero ===== */
.cover { padding:clamp(48px,9vw,120px) 0 clamp(56px,10vw,140px); border-bottom:1px solid var(--ink); }
.cover-row { display:flex; justify-content:space-between; align-items:baseline;
  gap:24px; padding-bottom:28px; border-bottom:1px solid var(--rule); flex-wrap:wrap; }
.cover h1 { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 50,"wght" 380;
  font-size:clamp(54px,12vw,188px); letter-spacing:-0.045em; line-height:0.86;
  padding:clamp(10px,1.5vw,24px) 0 clamp(20px,3vw,36px); font-weight:380; }
.cover h1 em { font-family:var(--f-italic); font-style:italic; color:var(--accent); font-weight:400; }
.cover-deck { font-family:var(--f-italic); font-style:italic;
  font-size:clamp(22px,3vw,32px); line-height:1.25; color:var(--ink-soft);
  max-width:56ch; letter-spacing:-0.01em; }
.cover-side { display:grid; grid-template-columns:1fr 1fr; gap:28px;
  padding-top:clamp(20px,3vw,40px); border-top:1px solid var(--ink);
  margin-top:clamp(28px,5vw,56px); font-size:14.5px; line-height:1.55; }
.cover-side > div { max-width:38ch; }
.cover-side .lab { font-family:var(--f-mono); font-size:10.5px;
  text-transform:uppercase; letter-spacing:0.18em; color:var(--ink-mute);
  margin-bottom:8px; display:block; }

/* ===== Ticker ===== */
.ticker { background:var(--ink); color:var(--paper); overflow:hidden; padding:22px 0;
  border-top:1px solid var(--ink); border-bottom:1px solid var(--ink); }
.ticker-track { display:flex; gap:56px; animation:scroll 50s linear infinite;
  white-space:nowrap; width:max-content; }
.ticker:hover .ticker-track { animation-play-state:paused; }
.ticker-item { display:inline-flex; align-items:baseline; gap:14px;
  font-family:var(--f-display); font-variation-settings:"opsz" 144,"SOFT" 0,"wght" 420;
  font-size:28px; letter-spacing:-0.02em; }
.ticker-item .big { color:var(--accent); font-size:1.4em; line-height:1; }
.ticker-item .big small { font-size:0.55em; opacity:0.85; }
.ticker-item .lbl { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.18em; text-transform:uppercase; opacity:.7; }
.ticker-item.sep { color:var(--paper); opacity:.35;
  font-family:var(--f-italic); font-style:italic; }
@keyframes scroll { from { transform:translateX(0); } to { transform:translateX(-50%); } }

/* ===== Chapters grid ===== */
.chapters { padding:clamp(56px,9vw,120px) 0; }
.section-head { display:grid; grid-template-columns:auto 1fr auto;
  gap:24px; align-items:end; padding-bottom:28px; border-bottom:1px solid var(--ink);
  margin-bottom:clamp(28px,4vw,56px); }
.section-head h2 { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 30,"wght" 400;
  font-size:clamp(36px,5vw,64px); letter-spacing:-0.035em;
  line-height:0.95; font-weight:400; }
.section-head h2 em { font-family:var(--f-italic); font-style:italic; color:var(--accent); font-weight:400; }
.section-head .num { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.2em; text-transform:uppercase; color:var(--ink-soft);
  padding-bottom:12px; }

.chapter-grid { display:grid; grid-template-columns:repeat(12,1fr);
  gap:1px; background:var(--ink); border:1px solid var(--ink); }
.ch-card { background:var(--paper); padding:clamp(28px,3.5vw,44px);
  display:flex; flex-direction:column; gap:18px; cursor:pointer;
  color:var(--ink); position:relative; overflow:hidden; min-height:320px;
  transition:background .3s ease; text-align:left; border:0; font-family:inherit; }
.ch-card:hover { background:var(--bg); }
.ch-card:hover .ch-arrow { transform:translateX(8px); color:var(--accent); }
.ch-card:hover .ch-glyph { transform:rotate(8deg) scale(1.06); }
.ch-card.a { grid-column:span 7; }
.ch-card.b { grid-column:span 5; }
.ch-card.c { grid-column:span 5; }
.ch-card.d { grid-column:span 7; background:var(--ink); color:var(--paper); }
.ch-card .ch-num { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.2em; text-transform:uppercase; color:var(--accent); }
.ch-card .ch-title { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 50,"wght" 420;
  font-size:clamp(32px,3.6vw,48px); line-height:0.95;
  letter-spacing:-0.03em; margin-top:auto; font-weight:420; }
.ch-card .ch-title em { font-family:var(--f-italic); font-style:italic;
  color:var(--accent); font-weight:400; }
.ch-card .ch-blurb { font-size:15px; line-height:1.5; color:var(--ink-soft); max-width:38ch; }
.ch-card.d .ch-blurb { color:rgba(246,241,226,.7); }
.ch-card .ch-foot { display:flex; justify-content:space-between; align-items:center;
  font-family:var(--f-mono); font-size:11px; letter-spacing:0.15em;
  text-transform:uppercase; color:var(--ink-soft);
  border-top:1px solid var(--rule); padding-top:16px; margin-top:4px; }
.ch-card.d .ch-foot { border-top-color:rgba(246,241,226,.18); color:rgba(246,241,226,.65); }
.ch-card.d .ch-foot .ch-arrow { color:var(--accent); }
.ch-arrow { transition:transform .3s ease, color .3s ease; display:inline-flex; }
.ch-glyph { position:absolute; top:24px; right:24px;
  font-family:var(--f-italic); font-style:italic; font-size:84px;
  line-height:1; color:var(--accent); opacity:.12;
  transition:transform .4s ease; pointer-events:none; }
.ch-card.d .ch-glyph { opacity:.45; }

/* ===== Manifesto ===== */
.manifesto { padding:clamp(64px,10vw,140px) 0; border-top:1px solid var(--ink);
  background:var(--paper); }
.manifesto-grid { display:grid; grid-template-columns:1fr 2fr;
  gap:clamp(28px,6vw,80px); align-items:start; }
.manifesto .lab { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.2em; text-transform:uppercase; color:var(--accent); }
.manifesto-grid p { margin-top:18px; font-size:14.5px; line-height:1.65;
  color:var(--ink-soft); max-width:32ch; }
.manifesto h3 { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 50,"wght" 380;
  font-size:clamp(30px,4vw,52px); line-height:1.05; letter-spacing:-0.03em;
  font-weight:380; }
.manifesto h3 em { font-family:var(--f-italic); font-style:italic;
  color:var(--accent); font-weight:400; }
.manifesto .qm { font-family:var(--f-italic); font-style:italic;
  color:var(--accent); font-size:1.4em; line-height:0; vertical-align:-0.25em; }

/* ===== Chapter hero ===== */
.ch-hero { padding:clamp(40px,7vw,96px) 0 clamp(40px,6vw,72px); border-bottom:1px solid var(--ink); }
.ch-hero-top { display:flex; justify-content:space-between; align-items:baseline;
  padding-bottom:24px; border-bottom:1px solid var(--rule);
  margin-bottom:clamp(20px,3vw,40px); flex-wrap:wrap; gap:12px; }
.ch-hero .marker { font-family:var(--f-mono); font-size:11.5px;
  letter-spacing:0.22em; text-transform:uppercase; color:var(--accent); }
.ch-hero h1 { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 60,"wght" 380;
  font-size:clamp(56px,11vw,168px); line-height:0.88;
  letter-spacing:-0.045em; font-weight:380;
  padding-bottom:clamp(24px,4vw,48px); }
.ch-hero h1 em { font-family:var(--f-italic); font-style:italic; color:var(--accent); font-weight:400; }
.ch-hero .lede { display:grid; grid-template-columns:1fr 1.4fr;
  gap:clamp(28px,6vw,80px); padding-top:clamp(20px,3vw,36px);
  border-top:1px solid var(--ink); }
.ch-hero .lede .meta { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.18em; text-transform:uppercase; color:var(--ink-soft); line-height:1.9; }
.ch-hero .lede .meta .k { color:var(--ink-mute); display:inline-block; min-width:90px; }
.ch-hero .lede > p { font-family:var(--f-italic); font-style:italic;
  font-size:clamp(20px,2.4vw,28px); line-height:1.3; color:var(--ink); max-width:38ch; }
.ch-hero .lede > p .accent { color:var(--accent); }

/* ===== Article body ===== */
.article { padding:clamp(48px,8vw,96px) 0; }
.article-grid { display:grid; grid-template-columns:1fr 2.4fr 1fr;
  gap:clamp(24px,5vw,64px); align-items:start; }
.article-grid > aside { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.18em; text-transform:uppercase; color:var(--ink-mute);
  position:sticky; top:96px; line-height:1.9; }

.article h2 { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 40,"wght" 400;
  font-size:clamp(30px,4vw,48px); line-height:0.98;
  letter-spacing:-0.03em; font-weight:400;
  margin-top:clamp(32px,5vw,64px); margin-bottom:20px; }
.article h2:first-child { margin-top:0; }
.article h2 em { font-family:var(--f-italic); font-style:italic; color:var(--accent); font-weight:400; }
.article h2 .num { font-family:var(--f-mono); font-size:13px;
  letter-spacing:0.2em; text-transform:uppercase; color:var(--accent);
  display:block; margin-bottom:12px; font-weight:500; }
.article h3 { font-family:var(--f-display);
  font-variation-settings:"opsz" 36,"SOFT" 20,"wght" 500;
  font-size:20px; letter-spacing:-0.01em;
  margin:28px 0 10px; font-weight:500; }
.article p { font-size:16.5px; line-height:1.65;
  color:var(--ink-soft); margin-bottom:16px; max-width:64ch; }
.article p.dropcap::first-letter { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 60,"wght" 380;
  font-size:5.2em; float:left; line-height:0.85;
  padding:4px 14px 0 0; color:var(--accent); font-weight:400; }

.list { list-style:none; padding:0; margin:16px 0 24px; max-width:62ch;
  counter-reset:li; }
.list li { padding:14px 0 14px 36px; border-bottom:1px solid var(--rule);
  position:relative; font-size:15.5px; line-height:1.55; color:var(--ink-soft); }
.list li::before { content:counter(li, decimal-leading-zero);
  counter-increment:li; position:absolute; left:0; top:14px;
  font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.1em; color:var(--accent); }
.list li strong { color:var(--ink); font-weight:600; }

/* ===== Split / dual ===== */
.split { display:grid; grid-template-columns:1fr 1fr; gap:1px;
  background:var(--ink); border:1px solid var(--ink); margin:28px 0; }
.split > div { background:var(--paper); padding:clamp(22px,3vw,36px); }
.split h4 { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.2em; text-transform:uppercase;
  margin-bottom:14px; font-weight:500; }
.split h4.r { color:var(--accent); }
.split h4.t { color:var(--teal); }
.split ul { list-style:none; }
.split li { padding:10px 0; border-bottom:1px solid var(--rule);
  font-size:14.5px; line-height:1.45; display:flex; gap:12px;
  align-items:baseline; color:var(--ink-soft); }
.split li:last-child { border-bottom:0; }
.split li::before { content:"→"; color:var(--accent);
  font-family:var(--f-italic); font-style:italic; flex-shrink:0; }

/* ===== Pull quote ===== */
.pull { border-top:3px solid var(--ink); border-bottom:1px solid var(--ink);
  padding:clamp(32px,5vw,56px) 0; margin:clamp(40px,6vw,72px) 0; text-align:center; }
.pull blockquote { font-family:var(--f-italic); font-style:italic;
  font-size:clamp(28px,4.5vw,56px); line-height:1.1; letter-spacing:-0.02em;
  max-width:22ch; margin:0 auto; color:var(--ink); }
.pull blockquote .accent { color:var(--accent); }
.pull .src { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.2em; text-transform:uppercase;
  color:var(--ink-mute); margin-top:24px; }

/* ===== Callout ===== */
.callout { display:grid; grid-template-columns:auto 1fr;
  gap:clamp(20px,3vw,36px); align-items:end;
  padding:clamp(24px,4vw,40px) clamp(24px,4vw,36px);
  background:var(--ink); color:var(--paper); margin:32px 0; border:1px solid var(--ink); }
.callout .big-num { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 0,"wght" 380;
  font-size:clamp(72px,11vw,144px); line-height:0.82;
  letter-spacing:-0.05em; color:var(--accent); font-weight:380; }
.callout .big-num small { font-size:0.45em; color:var(--paper);
  opacity:.7; margin-left:8px; }
.callout .ctx { font-family:var(--f-italic); font-style:italic;
  font-size:clamp(18px,2.2vw,24px); line-height:1.3;
  letter-spacing:-0.01em; max-width:36ch; }
.callout .ctx .lab { display:block; font-family:var(--f-mono);
  font-size:10.5px; letter-spacing:0.2em; text-transform:uppercase;
  color:var(--paper); opacity:.55; font-style:normal; margin-bottom:10px; }

/* ===== Compare table ===== */
.compare { width:100%; border-collapse:collapse;
  border:1px solid var(--ink); margin:28px 0; background:var(--paper); }
.compare th, .compare td { padding:16px 18px; text-align:left;
  vertical-align:top; border-bottom:1px solid var(--rule);
  border-right:1px solid var(--rule); font-size:14.5px; line-height:1.5; }
.compare th:last-child, .compare td:last-child { border-right:0; }
.compare thead th { background:var(--ink); color:var(--paper);
  font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.18em; text-transform:uppercase; font-weight:500; }
.compare thead th em { font-family:var(--f-italic); font-style:italic;
  color:var(--accent); text-transform:none; letter-spacing:0; font-size:14px; }
.compare tbody th { font-family:var(--f-display);
  font-variation-settings:"opsz" 36,"SOFT" 30,"wght" 500;
  font-size:17px; letter-spacing:-0.01em; color:var(--ink); width:26%; font-weight:500; }
.compare tbody td { color:var(--ink-soft); }
.compare tbody td strong { color:var(--ink); font-weight:600; }
.compare tbody tr:last-child th, .compare tbody tr:last-child td { border-bottom:0; }

/* ===== Risk cards ===== */
.risk-stack { display:grid; gap:18px; margin:28px 0; }
.risk { display:grid; grid-template-columns:auto 1fr;
  gap:clamp(20px,3vw,40px); padding:clamp(20px,3vw,32px);
  background:var(--paper); border:1px solid var(--ink); align-items:start; }
.risk .tag { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 30,"wght" 400;
  font-size:clamp(28px,3.5vw,44px); line-height:0.95;
  letter-spacing:-0.025em; color:var(--ink);
  border-right:1px solid var(--rule);
  padding-right:clamp(20px,3vw,40px);
  min-width:clamp(140px,18vw,220px); font-weight:400; }
.risk .tag em { font-family:var(--f-italic); font-style:italic; color:var(--accent); font-weight:400; }
.risk .tag .ix { display:block; font-family:var(--f-mono);
  font-size:10.5px; letter-spacing:0.2em; text-transform:uppercase;
  color:var(--accent); margin-bottom:8px; font-weight:500; }
.risk .body { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.risk .body h5 { font-family:var(--f-mono); font-size:10.5px;
  letter-spacing:0.18em; text-transform:uppercase;
  margin-bottom:10px; font-weight:500; }
.risk .body h5.r { color:var(--accent); }
.risk .body h5.p { color:var(--olive); }
.risk .body p { font-size:14px; line-height:1.55;
  color:var(--ink-soft); margin:0; max-width:none; }

/* ===== Tags ===== */
.tags { display:flex; flex-wrap:wrap; gap:8px; margin:24px 0 0; }
.tag-pill { font-family:var(--f-mono); font-size:10.5px;
  letter-spacing:0.18em; text-transform:uppercase;
  padding:6px 12px; border:1px solid var(--ink);
  border-radius:999px; color:var(--ink-soft); background:transparent; }
.tag-pill.accent { background:var(--accent); color:var(--paper); border-color:var(--accent); }

/* ===== Next chapter ===== */
.next-ch { display:flex; justify-content:space-between; align-items:end;
  padding:clamp(40px,6vw,72px) 0; border-top:1px solid var(--ink);
  gap:24px; flex-wrap:wrap; cursor:pointer; }
.next-ch:hover .ttl { color:var(--accent); }
.next-ch .lab { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.2em; text-transform:uppercase;
  color:var(--ink-mute); margin-bottom:8px; display:block; }
.next-ch .ttl { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 40,"wght" 400;
  font-size:clamp(32px,4.5vw,56px); line-height:0.95;
  letter-spacing:-0.03em; font-weight:400;
  transition:color .25s ease; color:var(--ink); }
.next-ch .ttl em { font-family:var(--f-italic); font-style:italic;
  color:var(--accent); font-weight:400; }
.next-ch .arrow { font-family:var(--f-italic); font-style:italic;
  font-size:clamp(40px,6vw,80px); color:var(--accent); line-height:0.9; }

/* ===== Footer ===== */
.colophon { border-top:1px solid var(--ink); background:var(--ink);
  color:var(--paper); padding:clamp(48px,8vw,88px) 0 36px; }
.colophon-grid { display:grid; grid-template-columns:1.5fr 1fr 1fr 1fr;
  gap:40px; align-items:start; padding-bottom:56px;
  border-bottom:1px solid rgba(246,241,226,0.18); }
.colophon h4 { font-family:var(--f-mono); font-size:11px;
  letter-spacing:0.2em; text-transform:uppercase; font-weight:500;
  margin-bottom:18px; opacity:.55; }
.colophon ul { list-style:none; }
.colophon li { margin-bottom:8px; }
.colophon a, .colophon button { background:none; border:0;
  cursor:pointer; color:var(--paper); font-size:15px;
  letter-spacing:-0.005em; text-decoration:none; font-family:inherit; padding:0; text-align:left; }
.colophon a:hover, .colophon button:hover { color:var(--accent); }
.colophon .brand-mark { font-family:var(--f-display);
  font-variation-settings:"opsz" 144,"SOFT" 100,"wght" 380;
  font-size:clamp(36px,4.5vw,56px); line-height:0.95;
  letter-spacing:-0.03em; margin-bottom:18px; font-weight:380; }
.colophon .brand-mark em { font-family:var(--f-italic); font-style:italic;
  color:var(--accent); font-weight:400; }
.colophon .blurb { font-size:14px; line-height:1.55;
  opacity:.65; max-width:34ch; }
.colophon-base { display:flex; justify-content:space-between;
  flex-wrap:wrap; gap:12px; padding-top:28px;
  font-family:var(--f-mono); font-size:10.5px;
  letter-spacing:0.18em; text-transform:uppercase; opacity:.55; }

/* ===== Animations ===== */
@keyframes rise { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
.rise-1 { animation:rise .9s .05s ease-out both; }
.rise-2 { animation:rise .9s .2s ease-out both; }
.rise-3 { animation:rise .9s .35s ease-out both; }
.rise-4 { animation:rise .9s .5s ease-out both; }

/* ===== Responsive ===== */
@media (max-width:900px) {
  .masthead-inner { grid-template-columns:1fr; gap:4px; text-align:center; }
  .meta-l, .meta-r { display:none; }
  .cover-side { grid-template-columns:1fr; gap:20px; }
  .ch-card.a, .ch-card.b, .ch-card.c, .ch-card.d { grid-column:span 12; }
  .manifesto-grid { grid-template-columns:1fr; gap:24px; }
  .article-grid { grid-template-columns:1fr; }
  .article-grid > aside { display:none; }
  .ch-hero .lede { grid-template-columns:1fr; }
  .split { grid-template-columns:1fr; }
  .risk { grid-template-columns:1fr; }
  .risk .tag { border-right:0; border-bottom:1px solid var(--rule);
    padding-right:0; padding-bottom:16px; min-width:0; }
  .risk .body { grid-template-columns:1fr; }
  .colophon-grid { grid-template-columns:1fr 1fr; gap:28px; }
  .callout { grid-template-columns:1fr; gap:16px; }
  .next-ch { flex-direction:column; align-items:flex-start; }
  .compare, .compare tbody, .compare tr, .compare td, .compare th { display:block; width:100% !important; }
  .compare thead { display:none; }
  .compare tbody th { border-bottom:0; padding-bottom:0; }
  .compare tbody td { border-right:0; }
}
`;

const NAV = [
  { id: 'home', num: '00', label: 'Cover' },
  { id: 'fitness', num: 'I', label: 'Fitness & Running' },
  { id: 'nutrition', num: 'II', label: 'Diet & Nutrition' },
  { id: 'habits', num: 'III', label: 'Habits & Addictions' },
];

const CHAPTER_INDEX = { fitness: 'I', nutrition: 'II', habits: 'III' };

function Masthead({ page, go }) {
  const idx = CHAPTER_INDEX[page];
  return (
    <header className="masthead">
      <div className="masthead-inner">
        <div className="meta-l">Volume I · Issue 01 · MMXXVI</div>
        <button className="brand" onClick={() => go('home')} aria-label="Index">
          <svg viewBox="0 0 28 28" width="26" height="26" style={{ display: 'block', margin: '0 auto' }}>
            <circle cx="14" cy="14" r="12.5" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="14" cy="14" r="3.5" fill="var(--accent)" />
          </svg>
        </button>
        <div className="meta-r">
          <span className="accent">●</span>&nbsp;
          {idx ? `Chapter ${idx} of III` : 'Author — withheld'}
        </div>
      </div>
      <nav className="subnav" aria-label="Chapters">
        <ul>
          {NAV.map(n => (
            <li key={n.id}>
              <button onClick={() => go(n.id)} className={page === n.id ? 'active' : ''}>
                <span className="num">{n.num}</span>{n.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function Footer({ go }) {
  return (
    <footer className="colophon">
      <div className="wrap">
        <div className="colophon-grid">
          <div>
            <div className="brand-mark">The Health<br /><em>Almanac.</em></div>
            <p className="blurb">An editorial field guide to the body and its discontents.
              Six honest essays. No newsletter, no app, no upsell.</p>
          </div>
          <div>
            <h4>Chapters</h4>
            <ul>
              <li><button onClick={() => go('fitness')}>I · Fitness &amp; running</button></li>
              <li><button onClick={() => go('nutrition')}>II · Diet &amp; nutrition</button></li>
              <li><button onClick={() => go('habits')}>III · Habits &amp; addictions</button></li>
            </ul>
          </div>
          <div>
            <h4>The publication</h4>
            <ul>
              <li><button onClick={() => go('home')}>Editor's note</button></li>
              <li><a href="#">Sources &amp; citations</a></li>
              <li><a href="#">Submit a correction</a></li>
            </ul>
          </div>
          <div>
            <h4>Find us</h4>
            <ul>
              <li><a href="#">In print, quarterly</a></li>
              <li><a href="#">In your inbox, monthly</a></li>
              <li><a href="#">On the bedside table</a></li>
            </ul>
          </div>
        </div>
        <div className="colophon-base">
          <span>© MMXXVI · The Health Almanac</span>
          <span>Set in Fraunces &amp; Instrument Serif</span>
          <span>Printed on the open web</span>
        </div>
      </div>
    </footer>
  );
}

function NextChapter({ to, label, title, go, back }) {
  return (
    <div className="wrap">
      <div className="next-ch" onClick={() => go(to)} role="link" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && go(to)}>
        <div>
          <span className="lab">{label}</span>
          <div className="ttl" dangerouslySetInnerHTML={{ __html: title }} />
        </div>
        <div className="arrow">{back ? '↩' : '→'}</div>
      </div>
    </div>
  );
}

/* ============== HOME ============== */
function Home({ go }) {
  const tickers = [
    ['8M', 'annual deaths from smoking'],
    ['33.8%', 'U.S. obesity rate'],
    ['½', 'U.S. adults with CVD'],
    ['42%', 'vegetarian in India'],
    ['30%', 'teens drinking at 15-19'],
    ['40<small>min</small>', 'of running, twice a week'],
  ];
  const doubled = [...tickers, ...tickers];

  return (
    <>
      <section className="cover">
        <div className="wrap">
          <div className="cover-row rise-1">
            <span className="eyebrow"><span className="dot" />The cover essay · No. 01</span>
            <span className="eyebrow">A six-chapter field guide</span>
          </div>
          <h1 className="rise-2">Live <em>longer.</em><br />Live louder.<br />Live <em>looking up.</em></h1>
          <p className="cover-deck rise-3">
            A field guide to the body and its discontents — six honest essays on
            running, eating, drinking, scrolling, and the small choices that quietly
            decide everything else.
          </p>
          <div className="cover-side rise-4">
            <div>
              <span className="lab">In this issue</span>
              The case for forty minutes of running, the cholesterol you wanted versus
              the one you got, and why your phone is a slot machine you carry on purpose.
            </div>
            <div>
              <span className="lab">A note from the editor</span>
              We are not a clinic. We are not a coach. We are a careful reader, an
              honest friend, and a stack of well-folded facts — to be unfolded slowly.
            </div>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Statistics">
        <div className="ticker-track">
          {doubled.map(([n, l], i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'baseline' }}>
              <span className="ticker-item">
                <span className="big" dangerouslySetInnerHTML={{ __html: n }} />
                <span className="lbl">{l}</span>
              </span>
              <span className="ticker-item sep" style={{ marginLeft: 56 }}>✦</span>
            </span>
          ))}
        </div>
      </section>

      <section className="chapters">
        <div className="wrap">
          <div className="section-head">
            <span className="num">§ Contents</span>
            <h2>Three chapters, six<br />essays, one <em>body.</em></h2>
            <span className="num">04 · 26 · MMXXVI</span>
          </div>

          <div className="chapter-grid">
            <button className="ch-card a" onClick={() => go('fitness')}>
              <span className="ch-glyph">I</span>
              <span className="ch-num">Chapter I · 01 essay</span>
              <p className="ch-blurb">Ten to forty minutes, two to five times a week. The most accessible
                medicine ever invented — and the case for actually taking it.</p>
              <h3 className="ch-title">Fitness &amp;<br /><em>running</em></h3>
              <div className="ch-foot"><span>Read the chapter</span><span className="ch-arrow"><ArrowRight size={16} /></span></div>
            </button>

            <button className="ch-card b" onClick={() => go('nutrition')}>
              <span className="ch-glyph">II</span>
              <span className="ch-num">Chapter II · 03 essays</span>
              <p className="ch-blurb">Fast food, cholesterol, and the vegetarian question. What the
                label says, and what your arteries hear.</p>
              <h3 className="ch-title">Diet &amp;<br /><em>nutrition</em></h3>
              <div className="ch-foot"><span>Read the chapter</span><span className="ch-arrow"><ArrowRight size={16} /></span></div>
            </button>

            <button className="ch-card c" onClick={() => go('habits')}>
              <span className="ch-glyph">III</span>
              <span className="ch-num">Chapter III · 02 essays</span>
              <p className="ch-blurb">Nicotine, alcohol, drugs — and the screen in your pocket.
                A frank inventory of the things that get inside us.</p>
              <h3 className="ch-title">Habits &amp;<br /><em>addictions</em></h3>
              <div className="ch-foot"><span>Read the chapter</span><span className="ch-arrow"><ArrowRight size={16} /></span></div>
            </button>

            <div className="ch-card d">
              <span className="ch-glyph">∞</span>
              <span className="ch-num">Appendix · The manifesto</span>
              <p className="ch-blurb">No supplements. No silver bullets. No
                seven-step morning routines. A short, stubborn statement of what
                we believe — and why.</p>
              <h3 className="ch-title">The <em>honest</em><br />almanac</h3>
              <div className="ch-foot"><span>Read below</span><span className="ch-arrow">↓</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="manifesto">
        <div className="wrap manifesto-grid">
          <div>
            <span className="lab">The editor's note</span>
            <p>We don't sell anything. We don't track you. We don't want your morning.
              We just want you to read three chapters — slowly — and maybe go for a walk afterwards.</p>
          </div>
          <h3>
            <span className="qm">"</span>The body keeps the receipts.
            Every cigarette, every sleepless night, every <em>scrolled hour</em> —
            all of it cashed in eventually. The good news is that the body also
            keeps the <em>deposits.</em><span className="qm">"</span>
          </h3>
        </div>
      </section>
    </>
  );
}

/* ============== FITNESS ============== */
function Fitness({ go }) {
  return (
    <>
      <section className="ch-hero">
        <div className="wrap">
          <div className="ch-hero-top">
            <span className="marker">Chapter I · The first essay</span>
            <span className="marker" style={{ color: 'var(--ink-mute)' }}>Filed under — Movement</span>
          </div>
          <h1 className="rise-1">The case<br />for <em>running.</em></h1>
          <div className="lede">
            <div className="meta rise-2">
              <div><span className="k">Duration</span> 10 – 40 minutes</div>
              <div><span className="k">Frequency</span> 2 – 5 times / week</div>
              <div><span className="k">Intensity</span> Moderate to HIIT</div>
              <div><span className="k">Equipment</span> One pair of shoes</div>
              <div><span className="k">Cost</span> Almost nothing</div>
              <div><span className="k">Side effects</span> Joy, sleep, willpower</div>
            </div>
            <p className="rise-3">
              The most <span className="accent">accessible medicine</span> ever invented — taken at your own dose,
              on your own schedule, in whatever weather you can stand. Forty minutes,
              twice a week, is enough to start collecting the dividends.
            </p>
          </div>
        </div>
      </section>

      <section className="article">
        <div className="wrap article-grid">
          <aside>§ Essay I.01<br />— Read in 4 min<br />— 6 figures<br />— 0 footnotes</aside>
          <div>
            <h2><span className="num">§ I.01 — The premise</span>Why running, of all things?</h2>
            <p className="dropcap">
              Running asks almost nothing of you. No membership, no machinery, no
              coach with strong opinions about your shoes. Ten minutes is enough to
              start; forty minutes, two to five times a week, is enough to change
              the shape of a life. It can be done on a moderate hum or pushed into
              high-intensity intervals — and either way, the body keeps the receipts.
            </p>
            <p>What follows is the short, honest case: what running does for the body,
              what it does for the mind, and the handful of conditions under which it actually works.</p>

            <div className="callout">
              <div className="big-num">40<small>min</small></div>
              <div className="ctx">
                <span className="lab">The minimum effective dose</span>
                Two to five sessions a week — moderate, high-intensity, or alternating.
                Anything beyond is gravy. Anything less is still better than nothing.
              </div>
            </div>

            <h2><span className="num">§ I.02 — The dividends</span>What running pays out.</h2>
            <p>Running is one of the few interventions that compounds simultaneously
              in the body and in the head. Below, the two ledgers — kept separately, to be honest,
              though in practice they run together.</p>

            <div className="split">
              <div>
                <h4 className="r">— Physical dividends</h4>
                <ul>
                  <li>Strengthens muscles and joints</li>
                  <li>Improves knee and back health</li>
                  <li>Facilitates weight loss</li>
                  <li>Lowers resting heart rate</li>
                  <li>Reduces blood pressure</li>
                  <li>Cuts the risk of diabetes</li>
                  <li>Increases overall lifespan</li>
                </ul>
              </div>
              <div>
                <h4 className="t">— Mental dividends</h4>
                <ul>
                  <li>Boosts memory &amp; cognition</li>
                  <li>Reduces the effects of Alzheimer's</li>
                  <li>Sharpens focus</li>
                  <li>Lifts mood via endorphin release</li>
                  <li>Raises baseline energy</li>
                  <li>Regulates hunger signals</li>
                  <li>Actively builds willpower</li>
                </ul>
              </div>
            </div>

            <div className="pull">
              <blockquote>
                "Running is the <span className="accent">cheapest</span> antidepressant,
                and the only one that also lowers your <span className="accent">blood pressure.</span>"
              </blockquote>
              <div className="src">— The Almanac, Chapter I</div>
            </div>

            <h2><span className="num">§ I.03 — The conditions</span>What it actually takes.</h2>
            <p>None of the above arrives automatically. Running rewards a handful of
              unglamorous habits — and quietly punishes their absence. The list is short.</p>
            <ul className="list">
              <li><strong>Consistency.</strong> Twice a week, forever, beats six times a week for a month.</li>
              <li><strong>Seasonal clothing.</strong> The right layers turn weather from an excuse into a non-event.</li>
              <li><strong>Posture.</strong> Tall spine, easy shoulders, eyes on the horizon, not the pavement.</li>
              <li><strong>A varied, healthy diet.</strong> You cannot out-run a bad pantry.</li>
              <li><strong>Adequate sleep.</strong> Recovery is when the dividends are actually paid.</li>
              <li><strong>Balance.</strong> Pair running with strength, mobility, and at least one sport you find absurd.</li>
            </ul>

            <h2><span className="num">§ I.04 — The verdict</span>A small, daily act of optimism.</h2>
            <p>Forty minutes of running is, materially, a small thing. It takes less
              time than a bad film. It costs less than a coffee habit. And yet,
              aggregated across a year, it is — by almost every measure — the most
              generous return on investment your body offers.</p>
            <p>The Almanac's position is unsentimental: lace the shoes, step outside,
              take the dose. The rest of this issue can wait until you're back.</p>

            <div className="tags">
              <span className="tag-pill accent">Movement</span>
              <span className="tag-pill">Cardiovascular</span>
              <span className="tag-pill">Mental health</span>
              <span className="tag-pill">Habit-building</span>
              <span className="tag-pill">HIIT</span>
            </div>
          </div>
          <aside style={{ textAlign: 'right' }}>Cite as<br />Almanac I.01<br />— MMXXVI</aside>
        </div>
      </section>

      <NextChapter go={go} to="nutrition" label="Next chapter"
        title="II · Diet &amp; <em>nutrition.</em>" />
    </>
  );
}

/* ============== NUTRITION ============== */
function Nutrition({ go }) {
  return (
    <>
      <section className="ch-hero">
        <div className="wrap">
          <div className="ch-hero-top">
            <span className="marker">Chapter II · Three essays</span>
            <span className="marker" style={{ color: 'var(--ink-mute)' }}>Filed under — The plate</span>
          </div>
          <h1 className="rise-1">The plate,<br /><em>and</em> what it<br />does to you.</h1>
          <div className="lede">
            <div className="meta rise-2">
              <div><span className="k">Essay II.01</span> Fast food &amp; obesity</div>
              <div><span className="k">Essay II.02</span> Cardiovascular disease</div>
              <div><span className="k">Essay II.03</span> The vegetarian question</div>
              <div><span className="k">Tone</span> Sceptical, not preachy</div>
              <div><span className="k">Verdict</span> Eat like you mean it</div>
            </div>
            <p className="rise-3">
              What the label says, and what your <span className="accent">arteries</span> hear.
              Three essays on the long, quiet conversation between a fork and the rest of the body.
            </p>
          </div>
        </div>
      </section>

      <section className="article">
        <div className="wrap article-grid">
          <aside>§ Essays II.01–03<br />— Read in 9 min<br />— 2 tables<br />— 1 callout</aside>
          <div>

            <h2><span className="num">§ II.01 — Fast food &amp; obesity</span>The most efficient delivery system for the wrong calories.</h2>
            <p className="dropcap">
              Fast food is cheap, convenient, and aggressively marketed — which is
              why the number of fast-food restaurants has doubled since 1970.
              Convenience is not, in itself, a sin. The trouble is what is being
              delivered: an excess of saturated fat, added salt, and sugar, wrapped
              in processed ingredients and additives, and lacking the vitamins
              and minerals the body actually needs.
            </p>

            <div className="callout">
              <div className="big-num">33.8<small>%</small></div>
              <div className="ctx">
                <span className="lab">Of the U.S. population is obese</span>
                Oversized portions, calorie-dense sugary drinks, and a sedentary
                day add up to a national arithmetic problem.
              </div>
            </div>

            <h3>The consequences, plainly</h3>
            <p>Regular consumption spikes cholesterol, causes constipation and other
              digestive troubles, fosters long-term nutrient deficiencies, harms
              teeth and gums, and raises the risk of chronic illness — type 2
              diabetes most prominently. Mood is not spared either: fatigue and
              irritability arrive on the same tray.</p>

            <h3>Five small mutinies at the counter</h3>
            <ul className="list">
              <li><strong>Limit the frequency.</strong> Make it a treat, not a rhythm.</li>
              <li><strong>Choose the smaller portion.</strong> Medium is plenty; large is not generosity, it's liability.</li>
              <li><strong>Swap soda for water.</strong> The single highest-leverage substitution on this list.</li>
              <li><strong>Pick grilled over fried.</strong> Same protein, a fraction of the consequences.</li>
              <li><strong>Add a side salad.</strong> Or any vegetable, however reluctant.</li>
            </ul>

            <h2><span className="num">§ II.02 — Cardiovascular disease</span>The leading cause of death, and the cholesterol behind it.</h2>
            <p>Cardiovascular disease — CVD — is a group of conditions affecting the
              heart and blood vessels. It is the leading cause of death globally and
              affects <strong>nearly half of all U.S. adults.</strong> Some cases
              announce themselves; many do not, which is precisely the danger.</p>

            <h3>The family of diseases</h3>
            <ul className="list">
              <li><strong>Arrhythmia</strong> — abnormal heart rhythms.</li>
              <li><strong>Valve disease</strong> — leaking or tightening valves.</li>
              <li><strong>Artery disease</strong> — narrowing and blockages.</li>
              <li><strong>Heart failure</strong> — trouble pumping or relaxing.</li>
              <li><strong>Pericardial disease</strong> — inflammation of the surrounding sac.</li>
            </ul>

            <div className="pull">
              <blockquote>
                High cholesterol has <span className="accent">no visible symptoms.</span><br />
                That is the entire problem.
              </blockquote>
              <div className="src">— § II.02</div>
            </div>

            <h3>LDL versus HDL, settled</h3>
            <p>The shorthand is famous and worth keeping: <strong>LDL</strong> is the
              low-density cholesterol that builds plaque on artery walls;
              <strong> HDL</strong> is the high-density cholesterol that hauls
              cholesterol away. Diet is the lever you can actually pull.</p>

            <table className="compare">
              <thead>
                <tr>
                  <th>Drives</th>
                  <th>↑ LDL — the <em>"bad"</em> cholesterol</th>
                  <th>↑ HDL — the <em>"good"</em> cholesterol</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Dietary culprits</th>
                  <td>Butter, red meat, processed meats, refined grains, French fries, sugary drinks.</td>
                  <td>Olive oil, salmon, oilseeds, avocados, assorted vegetables, nuts.</td>
                </tr>
                <tr>
                  <th>Effect on arteries</th>
                  <td>Plaque accumulates; vessels narrow; pressure rises.</td>
                  <td>Plaque is escorted away; vessels stay open; pressure eases.</td>
                </tr>
                <tr>
                  <th>The Almanac's prescription</th>
                  <td>Less, less often, and please — read the label.</td>
                  <td>More, more often, and yes — even the fatty fish.</td>
                </tr>
              </tbody>
            </table>

            <p>Because the disease is so often silent, the single most useful habit
              is the dullest one: <strong>a cholesterol check every five years.</strong>
              Earlier if there is family history. Twice as often if there is reason to worry.</p>

            <h2><span className="num">§ II.03 — The vegetarian question</span>The plate, the planet, and the animal.</h2>
            <p>Vegetarians exclude meat — distinct from vegans, who exclude all animal
              products, and pescatarians, who keep fish. India leads the world at
              <strong> 31–42%</strong> vegetarian, followed by Mexico and Brazil.
              The reasons people give are usually three: health, environment, ethics.
              Each has a case for and a case against; the Almanac records both.</p>

            <table className="compare">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Pros · the case <em>for</em></th>
                  <th>Cons · the case <em>against</em></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Health</th>
                  <td>Lower risk of cardiovascular disease and obesity. Lower cholesterol; higher intake of fibre, antioxidants, vitamins.</td>
                  <td>Potential deficiencies in <strong>B12, vitamin D, iron, zinc</strong> — nutrients concentrated in animal products.</td>
                </tr>
                <tr>
                  <th>Environment</th>
                  <td>Significantly lower greenhouse-gas emissions, less land occupation, lower total water use than livestock farming.</td>
                  <td>Heavy water needs for certain crops. Meat alternatives emit carbon in processing. Monoculture threatens biodiversity.</td>
                </tr>
                <tr>
                  <th>Lifestyle</th>
                  <td>An active protest against industrial farming and the conditions in which animals are kept.</td>
                  <td>Eating out is harder. Labels demand attention. Meatless alternatives are often more expensive.</td>
                </tr>
              </tbody>
            </table>

            <p>The Almanac's reading: neither sainthood nor surrender. A diet weighted
              toward plants, opened occasionally to fish or modest meat, and paid
              attention to — is, on the evidence, the most defensible position from
              almost every angle.</p>

            <div className="tags">
              <span className="tag-pill accent">Nutrition</span>
              <span className="tag-pill">Cholesterol</span>
              <span className="tag-pill">Obesity</span>
              <span className="tag-pill">Plant-based</span>
              <span className="tag-pill">Heart health</span>
            </div>
          </div>
          <aside style={{ textAlign: 'right' }}>Cite as<br />Almanac II.01–03<br />— MMXXVI</aside>
        </div>
      </section>

      <NextChapter go={go} to="habits" label="Next chapter"
        title="III · Habits &amp; <em>addictions.</em>" />
    </>
  );
}

/* ============== HABITS ============== */
function Habits({ go }) {
  return (
    <>
      <section className="ch-hero">
        <div className="wrap">
          <div className="ch-hero-top">
            <span className="marker">Chapter III · Two essays</span>
            <span className="marker" style={{ color: 'var(--ink-mute)' }}>Filed under — Things that get inside us</span>
          </div>
          <h1 className="rise-1">The things<br />that <em>get inside</em><br />us.</h1>
          <div className="lede">
            <div className="meta rise-2">
              <div><span className="k">Essay III.01</span> Substances</div>
              <div><span className="k">Essay III.02</span> The screen</div>
              <div><span className="k">Reader</span> Aged 13 and up</div>
              <div><span className="k">Tone</span> Honest, unembarrassed</div>
              <div><span className="k">Footnote</span> Help is not a weakness</div>
            </div>
            <p className="rise-3">
              Nicotine, alcohol, drugs — and the small glass rectangle that knows
              more about your <span className="accent">sleep</span> than your doctor does.
              A frank inventory of what we let in.
            </p>
          </div>
        </div>
      </section>

      <section className="article">
        <div className="wrap article-grid">
          <aside>§ Essays III.01–02<br />— Read in 8 min<br />— 4 risk cards<br />— 1 detox checklist</aside>
          <div>

            <h2><span className="num">§ III.01 — Substances</span>What peer pressure looks like in a body, ten years later.</h2>
            <p className="dropcap">
              The substances below differ in chemistry, in legality, and in how
              loudly they advertise. They share one thing: every story of dependence
              on any of them begins, almost without exception, with a friend, a party,
              and a moment of not wanting to seem dull. The Almanac is not interested
              in moralising. It is interested in arithmetic.
            </p>

            <div className="risk-stack">
              <article className="risk">
                <div className="tag">
                  <span className="ix">№ 01 · Stimulant</span>
                  Energy<br /><em>drinks.</em>
                </div>
                <div className="body">
                  <div>
                    <h5 className="r">— The risks</h5>
                    <p>Roughly 80 mg of caffeine per can, plus aggressive sugar. The result:
                      heart palpitations, anxiety, severe sleep disruption, tooth decay,
                      weight gain. Mixed with alcohol they mask intoxication and have been
                      linked to cardiac arrhythmia.</p>
                  </div>
                  <div>
                    <h5 className="p">— The prevention</h5>
                    <p>Substitute water or tea. Read the label before the colour.
                      Avoid entirely under the age of 18.</p>
                  </div>
                </div>
              </article>

              <article className="risk">
                <div className="tag">
                  <span className="ix">№ 02 · Inhaled</span>
                  Nicotine<br />&amp; <em>smoke.</em>
                </div>
                <div className="body">
                  <div>
                    <h5 className="r">— The risks</h5>
                    <p>Among the most addictive substances in common circulation.
                      Cancer of the lung, throat, mouth. Coronary artery disease.
                      Roughly <strong>8 million deaths</strong> worldwide each year.
                      E-cigarettes and heated tobacco are not risk-free; they are
                      newer, with shorter receipts.</p>
                  </div>
                  <div>
                    <h5 className="p">— The prevention</h5>
                    <p>Never start. Refuse the offered cigarette without apology.
                      If already smoking, seek professional help — replacement,
                      counselling, community. Sport and a stubborn hobby do most
                      of the rest.</p>
                  </div>
                </div>
              </article>

              <article className="risk">
                <div className="tag">
                  <span className="ix">№ 03 · Depressant</span>
                  Alcohol.
                </div>
                <div className="body">
                  <div>
                    <h5 className="r">— The risks</h5>
                    <p>Consumed regularly by <strong>30%</strong> of 15–19 year olds.
                      Fatty liver, cirrhosis, cardiomyopathy, memory loss. In adolescents,
                      active disruption of brain development and a roughly <strong>3×</strong>
                      higher risk of injury.</p>
                  </div>
                  <div>
                    <h5 className="p">— The prevention</h5>
                    <p>No underage drinking. Never drink and drive — not once, not
                      one block. At parties, sparkling water in a wine glass works
                      perfectly well and tastes the same the next morning.</p>
                  </div>
                </div>
              </article>

              <article className="risk">
                <div className="tag">
                  <span className="ix">№ 04 · Variable</span>
                  Drugs.
                </div>
                <div className="body">
                  <div>
                    <h5 className="r">— The risks</h5>
                    <p>Psychosis, cardiac arrest, HIV and Hepatitis C from shared
                      needles, fatal overdose from designer drugs of unknown content,
                      and a lifelong criminal record in most jurisdictions.</p>
                  </div>
                  <div>
                    <h5 className="p">— The prevention</h5>
                    <p>Absolute abstinence is the only honest baseline. Surround
                      yourself with people who don't use. For overdoses, call
                      emergency services without hesitation. Confidential help exists —
                      use it.</p>
                  </div>
                </div>
              </article>
            </div>

            <div className="pull">
              <blockquote>
                The first cigarette is offered<br />
                by a <span className="accent">friend.</span><br />
                So is the last one.
              </blockquote>
              <div className="src">— § III.01</div>
            </div>

            <h2><span className="num">§ III.02 — The screen</span>The slot machine you carry on purpose.</h2>
            <p>The phone is not, technically, a drug. It does, however, hit several of
              the same buttons — dopamine cycles, social comparison, the small electric
              dread of <strong>missing out.</strong> Platforms are not neutral; they
              are engineered, with very large budgets, to keep your attention. The
              result is a behavioural addiction that wears no warning label.</p>

            <div className="callout">
              <div className="big-num">20<small>·20·20</small></div>
              <div className="ctx">
                <span className="lab">The eye rule</span>
                Every 20 minutes, look at something 20 feet away for 20 seconds.
                Small enough to remember; large enough, over a year, to matter.
              </div>
            </div>

            <h3>What the screen takes</h3>
            <div className="split">
              <div>
                <h4 className="r">— Physical costs</h4>
                <ul>
                  <li>Sleep rhythm disrupted by blue light</li>
                  <li>Acute eye strain</li>
                  <li>Chronic headaches</li>
                  <li>Neck &amp; back pain</li>
                  <li>A sedentary day, by default</li>
                </ul>
              </div>
              <div>
                <h4 className="t">— Mental &amp; social costs</h4>
                <ul>
                  <li>Information overload &amp; decision fatigue</li>
                  <li>Anxiety and depressive symptoms</li>
                  <li>Impulsivity, reduced self-esteem</li>
                  <li>Social isolation, by paradox</li>
                  <li>For children: cyberbullying, learning difficulty</li>
                </ul>
              </div>
            </div>

            <h3>A practical hygiene</h3>
            <ul className="list">
              <li><strong>The 20-20-20 rule.</strong> Look up, look away, blink. Repeat.</li>
              <li><strong>Screen-free zones.</strong> Bedroom and dinner table, at minimum.</li>
              <li><strong>Blue-light filters after sunset.</strong> Not a cure, but a courtesy to your circadian clock.</li>
              <li><strong>Push notifications, off.</strong> A notification is an interruption disguised as information.</li>
              <li><strong>Hard time limits.</strong> Set them in the operating system, not on yourself.</li>
              <li><strong>A weekly detox.</strong> One full day, every week, with the phone in another room.</li>
            </ul>

            <h2><span className="num">§ III · Closing</span>Where the Almanac leaves you.</h2>
            <p>The chapters end here, but the body doesn't. The arithmetic above is
              unsentimental and unsensational: forty minutes of running, a plate
              tilted toward plants, no cigarettes, modest drinking, no drugs, and a
              phone that obeys you rather than the other way round. That is, almost
              entirely, the whole programme. The rest is upkeep.</p>
            <p>We hope you'll keep this almanac somewhere you can find it again — not
              out of devotion, but because the body keeps the receipts, and so should
              your bookshelf.</p>

            <div className="tags">
              <span className="tag-pill accent">Substance abuse</span>
              <span className="tag-pill">Nicotine</span>
              <span className="tag-pill">Alcohol</span>
              <span className="tag-pill">Digital hygiene</span>
              <span className="tag-pill">Prevention</span>
            </div>
          </div>
          <aside style={{ textAlign: 'right' }}>Cite as<br />Almanac III.01–02<br />— MMXXVI</aside>
        </div>
      </section>

      <NextChapter go={go} to="home" label="Return to" title="The <em>cover.</em>" back />
    </>
  );
}

/* ============== APP ============== */
export default function HealthAlmanac() {
  const [page, setPage] = useState('home');

  const go = (next) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // ensure scroll resets on first paint
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="almanac">
      <style>{STYLES}</style>
      <Masthead page={page} go={go} />
      <main key={page} style={{ animation: 'rise .5s ease-out both' }}>
        {page === 'home' && <Home go={go} />}
        {page === 'fitness' && <Fitness go={go} />}
        {page === 'nutrition' && <Nutrition go={go} />}
        {page === 'habits' && <Habits go={go} />}
      </main>
      <Footer go={go} />
    </div>
  );
}
