// ===== Martyna Wilczewska - interakcje strony =====

// rok w stopce
document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

// menu mobilne
const burger = document.querySelector(".burger");
const links = document.querySelector(".nav-links");
if (burger && links) {
  burger.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
}

// reveal przy przewijaniu
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      io.unobserve(e.target);
      if (e.target.hasAttribute("data-count")) animateCount(e.target);
    }
  });
}, { threshold: 0.18 });
document.querySelectorAll(".reveal, [data-count]").forEach(el => io.observe(el));

// fallback: po załadowaniu odsłoń elementy już widoczne w oknie (gdyby obserwator nie zdążył)
window.addEventListener("load", () => {
  document.querySelectorAll(".reveal:not(.in), [data-count]:not(.in)").forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < (window.innerHeight || 800)) {
      el.classList.add("in");
      if (el.hasAttribute("data-count")) animateCount(el);
    }
  });
});

// animowane liczniki
function animateCount(el) {
  const target = parseFloat(el.getAttribute("data-count"));
  const suffix = el.getAttribute("data-suffix") || "";
  const dur = 1200;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.querySelector(".val").textContent = Math.round(target * ease);
    if (p < 1) requestAnimationFrame(tick);
    else el.querySelector(".val").textContent = target + suffix;
  }
  requestAnimationFrame(tick);
}

// lightbox certyfikatów
const lb = document.querySelector(".lightbox");
if (lb) {
  const lbImg = lb.querySelector("img");
  document.querySelectorAll(".cert-thumb img").forEach(img => {
    img.parentElement.addEventListener("click", () => {
      lbImg.src = img.src;
      lb.classList.add("open");
    });
  });
  lb.addEventListener("click", () => lb.classList.remove("open"));
  document.addEventListener("keydown", e => { if (e.key === "Escape") lb.classList.remove("open"); });
}

// kopiowanie e-maila do schowka po kliknięciu (z potwierdzeniem)
const copyBtn = document.getElementById("copyMail");
if (copyBtn) {
  const original = copyBtn.innerHTML;
  let timer = null;
  copyBtn.addEventListener("click", async () => {
    const email = copyBtn.getAttribute("data-email");
    let ok = false;
    try {
      await navigator.clipboard.writeText(email);
      ok = true;
    } catch (e) {
      const t = document.createElement("textarea");
      t.value = email; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.focus(); t.select();
      try { ok = document.execCommand("copy"); } catch (_) {}
      document.body.removeChild(t);
    }
    copyBtn.innerHTML = ok ? "✓ Skopiowano e-mail!" : "✉ " + email;
    clearTimeout(timer);
    timer = setTimeout(() => { copyBtn.innerHTML = original; }, 1800);
  });
}

// podświetlenie aktywnej pozycji menu (kotwice)
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
if (navAnchors.length) {
  const sections = navAnchors.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => spy.observe(s));
}
