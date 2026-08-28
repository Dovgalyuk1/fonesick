// ============ fone sick — config ============
// Fill these in once the token is live. Everything below wires itself up.
const CONFIG = {
  CA: "", // e.g. "So1anaTokenAddressHere111111111111111111" — leave "" until minted
  BUY_URL: "", // pump.fun / raydium / jupiter swap link
  CHART_URL: "", // dexscreener pair link
  X_URL: "", // twitter/x profile
  TELEGRAM_URL: "" // telegram group
};

const isPlaceholder = (v) => !v || v.trim() === "";

// ============ CA display + copy ============
function setupCaChips() {
  const caText = isPlaceholder(CONFIG.CA) ? "not minted yet" : CONFIG.CA;
  const shortCa = isPlaceholder(CONFIG.CA)
    ? "not minted yet"
    : `${CONFIG.CA.slice(0, 6)}...${CONFIG.CA.slice(-4)}`;

  const chips = [
    { textEl: document.getElementById("navCaText"), btn: document.getElementById("navCaChip"), short: true },
    { textEl: document.getElementById("heroCaText"), btn: document.getElementById("heroCaChip"), short: false },
    { textEl: document.getElementById("footerCaText"), btn: document.getElementById("footerCaChip"), short: false },
  ];

  chips.forEach(({ textEl, btn, short }) => {
    if (!textEl || !btn) return;
    textEl.textContent = short ? shortCa : caText;
    btn.addEventListener("click", () => {
      if (isPlaceholder(CONFIG.CA)) {
        showToast("No contract yet — check back at launch 🤒");
        return;
      }
      navigator.clipboard.writeText(CONFIG.CA).then(() => {
        showToast("Contract copied 📋");
      }).catch(() => showToast("Couldn't copy — copy it manually"));
    });
  });
}

// ============ link buttons (with placeholder fallback) ============
function setupLinkButtons() {
  const map = [
    ["buyBtn", CONFIG.BUY_URL, "Buy link"],
    ["chartBtn", CONFIG.CHART_URL, "Chart"],
    ["chartBtn2", CONFIG.CHART_URL, "Chart"],
    ["xBtn", CONFIG.X_URL, "X / Twitter"],
    ["xBtn2", CONFIG.X_URL, "X / Twitter"],
    ["tgBtn", CONFIG.TELEGRAM_URL, "Telegram"],
  ];
  map.forEach(([id, url, label]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("click", (e) => {
      if (isPlaceholder(url)) {
        e.preventDefault();
        showToast(`${label} coming soon — link goes live at launch`);
      } else {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    });
  });
}

// ============ toast ============
let toastTimer = null;
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

// ============ mobile nav ============
function setupNav() {
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");
  if (!burger || !links) return;
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      burger.classList.remove("open");
    });
  });
}

// ============ clock + fake vitals ============
function setupClockAndVitals() {
  const clockEl = document.getElementById("vbClock");
  const tempEls = [document.getElementById("vbTemp"), document.getElementById("statTemp")];
  const bpmEls = [document.getElementById("vbBpm"), document.getElementById("statBpm")];

  function tick() {
    if (clockEl) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      clockEl.textContent = `${hh}:${mm}`;
    }
  }
  tick();
  setInterval(tick, 15000);

  // gently drifting joke vitals, synced to the ECG "pulse" pace
  function driftVitals() {
    const bpm = 128 + Math.round(Math.random() * 30);
    const temp = (103.2 + Math.random() * 1.4).toFixed(1);
    bpmEls.forEach((el) => el && (el.textContent = String(bpm)));
    tempEls.forEach((el) => {
      if (!el) return;
      el.textContent = el.id === "statTemp" ? `${temp}°F` : `${temp}°F`;
    });
  }
  driftVitals();
  setInterval(driftVitals, 3200);
}

// ============ reveal on scroll ============
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("in"), i * 90);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  items.forEach((el) => io.observe(el));
}

// ============ floating decor (pills / thermometers) ============
function setupDecor() {
  const layer = document.getElementById("decorLayer");
  if (!layer) return;
  const emojis = ["💊", "🌡️", "🩹", "🤧"];
  const count = window.innerWidth < 640 ? 5 : 9;
  const items = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "decor-item";
    el.textContent = emojis[i % emojis.length];
    layer.appendChild(el);
    items.push({
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  function step() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    items.forEach((it) => {
      it.wobble += 0.01;
      it.x += it.vx + Math.sin(it.wobble) * 0.15;
      it.y += it.vy + Math.cos(it.wobble * 0.8) * 0.15;
      if (it.x < -20) it.x = w + 20;
      if (it.x > w + 20) it.x = -20;
      if (it.y < -20) it.y = h + 20;
      if (it.y > h + 20) it.y = -20;
      it.el.style.transform = `translate(${it.x}px, ${it.y}px)`;
    });
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ============ ECG canvas ============
function setupEcg() {
  const canvas = document.getElementById("ecgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width, height, dpr;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const points = [];
  const maxPoints = 240;
  let t = 0;

  function ecgValue(x) {
    // synthesize a heartbeat-like waveform using a repeating pulse shape
    const period = 42;
    const phase = x % period;
    if (phase > 4 && phase < 6) return -0.15;
    if (phase > 6 && phase < 7.5) return 0.9;
    if (phase > 7.5 && phase < 9) return -0.35;
    if (phase > 9 && phase < 11) return 0.12;
    return Math.sin(x * 0.06) * 0.04;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0d211c";
    ctx.fillRect(0, 0, width, height);

    // grid
    ctx.strokeStyle = "rgba(47,224,140,0.08)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < width; gx += 24) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += 24) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.strokeStyle = "#2fe08c";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#2fe08c";
    ctx.shadowBlur = 8;
    const midY = height / 2;
    const amp = height * 0.36;
    for (let i = 0; i < points.length; i++) {
      const x = (i / maxPoints) * width;
      const y = midY - points[i] * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function tick() {
    t += 1;
    points.push(ecgValue(t));
    if (points.length > maxPoints) points.shift();
    draw();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ============ synthesized heart monitor beep ============
function setupSound() {
  const btn = document.getElementById("soundToggle");
  if (!btn) return;
  let ctx = null;
  let on = false;
  let beepTimer = null;

  function beep() {
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  btn.addEventListener("click", () => {
    on = !on;
    btn.textContent = on ? "🔊" : "🔇";
    if (on) {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") ctx.resume();
      beep();
      beepTimer = setInterval(beep, 900);
    } else {
      clearInterval(beepTimer);
    }
  });
}

// ============ live stats from DexScreener ============
async function setupLiveStats() {
  const priceEl = document.getElementById("statPrice");
  const mcapEl = document.getElementById("statMcap");
  const liqEl = document.getElementById("statLiq");
  const volEl = document.getElementById("statVol");
  if (isPlaceholder(CONFIG.CA)) return; // stays N/A until CA is set

  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONFIG.CA}`);
    const data = await res.json();
    const pair = data && data.pairs && data.pairs[0];
    if (!pair) return;
    if (priceEl) priceEl.textContent = pair.priceUsd ? `$${Number(pair.priceUsd).toPrecision(4)}` : "N/A";
    if (mcapEl) mcapEl.textContent = pair.fdv ? `$${Number(pair.fdv).toLocaleString()}` : "N/A";
    if (liqEl) liqEl.textContent = pair.liquidity && pair.liquidity.usd ? `$${Number(pair.liquidity.usd).toLocaleString()}` : "N/A";
    if (volEl) volEl.textContent = pair.volume && pair.volume.h24 ? `$${Number(pair.volume.h24).toLocaleString()}` : "N/A";
  } catch (err) {
    console.warn("DexScreener fetch failed", err);
  }
}

// ============ init ============
document.addEventListener("DOMContentLoaded", () => {
  setupCaChips();
  setupLinkButtons();
  setupNav();
  setupClockAndVitals();
  setupReveal();
  setupDecor();
  setupEcg();
  setupSound();
  setupLiveStats();
});
