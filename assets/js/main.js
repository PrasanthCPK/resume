/* =============================================================
   Prasanth Chintapalli — Portfolio interactions
   -------------------------------------------------------------
   Modules:
   1. Reduced-motion helper
   2. Navigation (scroll state, mobile menu, active link, smooth scroll)
   3. Scroll progress bar
   4. Reveal-on-scroll (Intersection Observer) + stagger
   5. Animated counters
   6. Animated skill bars
   7. Timeline reveal
   8. Hero rotating keywords
   9. Hero typing code effect
   10. Hero mouse parallax
   11. Hero network particle canvas (distributed systems viz)
   12. Footer year
   All animations honor prefers-reduced-motion and aim for 60fps
   by using transforms/opacity and requestAnimationFrame.
   ============================================================= */
(function () {
  "use strict";

  /* 1. Reduced motion ------------------------------------------------ */
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 2. NAVIGATION ---------------------------------------------------- */
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const onScrollNav = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScrollNav();

  // Mobile menu toggle
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      mobileMenu.setAttribute("aria-hidden", String(!open));
    });
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("aria-hidden", "true");
      })
    );
  }

  // Smooth scroll for in-page anchors (with reduced-motion fallback)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  /* 3. SCROLL PROGRESS BAR ------------------------------------------- */
  const scrollBar = document.getElementById("scrollBar");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav__links a")];

  const onScroll = () => {
    onScrollNav();
    const h = document.documentElement;
    const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
    if (scrollBar) scrollBar.style.width = scrolled + "%";
  };
  // Throttle with rAF
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  /* 4. ACTIVE NAV LINK via IntersectionObserver ---------------------- */
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((l) =>
              l.classList.toggle("is-active", l.getAttribute("href") === "#" + id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* 5. REVEAL ON SCROLL + stagger ------------------------------------ */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // Stagger siblings sharing the same parent grid
          const siblings = [...el.parentElement.querySelectorAll(":scope > .reveal")];
          const idx = siblings.indexOf(el);
          el.style.setProperty("--reveal-delay", Math.max(0, idx) * 0.08 + "s");
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* 6. ANIMATED COUNTERS --------------------------------------------- */
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) { el.textContent = target + suffix; return; }
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* 7. SKILL BARS ---------------------------------------------------- */
  const fillSkills = (container) => {
    container.querySelectorAll("i[data-level]").forEach((bar) => {
      const lvl = Math.max(0, Math.min(100, parseInt(bar.dataset.level, 10) || 0));
      bar.style.setProperty("--w", lvl + "%");
    });
  };

  // One observer to trigger counters, skill bars, and timeline items
  if ("IntersectionObserver" in window) {
    const triggerObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.matches("[data-count]")) animateCount(el);
          if (el.matches("[data-skills]")) fillSkills(el);
          if (el.matches(".tl-item")) el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("[data-count], [data-skills], .tl-item")
      .forEach((el) => triggerObserver.observe(el));
  } else {
    // Fallback: fill immediately
    document.querySelectorAll("[data-count]").forEach(animateCount);
    document.querySelectorAll("[data-skills]").forEach(fillSkills);
  }

  /* 8. HERO ROTATING KEYWORDS ---------------------------------------- */
  const rotator = document.getElementById("rotator");
  if (rotator) {
    const words = [
      "Distributed Systems", "Cloud Architecture", "System Design",
      "Java", "AWS", "Microservices", "Leadership"
    ];
    let i = 0;
    const item = rotator.querySelector(".rotator__item");
    if (prefersReduced) {
      item.textContent = words[0];
    } else {
      const cycle = () => {
        item.classList.add("is-out");
        setTimeout(() => {
          i = (i + 1) % words.length;
          item.textContent = words[i];
          item.classList.remove("is-out");
          item.classList.add("is-in");
          setTimeout(() => item.classList.remove("is-in"), 500);
        }, 480);
      };
      setInterval(cycle, 2600);
    }
  }

  /* 9. HERO TYPING CODE EFFECT --------------------------------------- */
  const typedCode = document.getElementById("typedCode");
  if (typedCode) {
    // Tokenized lines: [text, className]
    const lines = [
      [["@Service", "k"], [" ", ""], ["class", "k"], [" PlatformArchitect {", ""]],
      [["  ", ""], ["void", "k"], [" ", ""], ["design", "f"], ["(Problem p) {", ""]],
      [["    ", ""], ["return", "k"], [" scale(", ""], ['"millions"', "s"], [");", ""]],
      [["  }", ""]],
      [["  ", ""], ["// reliability · simplicity · ownership", "c"]],
      [["}", ""]],
    ];

    if (prefersReduced) {
      typedCode.innerHTML = lines
        .map((l) => l.map(([t, c]) => c ? `<span class="${c}">${escapeHtml(t)}</span>` : escapeHtml(t)).join(""))
        .join("\n");
    } else {
      let li = 0, ti = 0, ci = 0;
      const type = () => {
        if (li >= lines.length) return;
        const token = lines[li][ti];
        const [text, cls] = token;
        // Build current partial string for this token
        const partial = text.slice(0, ci + 1);
        // Rebuild full innerHTML up to current point
        let html = "";
        for (let l = 0; l <= li; l++) {
          if (l > 0) html += "\n";
          const tokens = lines[l];
          const maxT = l < li ? tokens.length : ti + 1;
          for (let t = 0; t < maxT; t++) {
            const [tx, c] = tokens[t];
            const str = (l === li && t === ti) ? partial : tx;
            html += c ? `<span class="${c}">${escapeHtml(str)}</span>` : escapeHtml(str);
          }
        }
        typedCode.innerHTML = html;

        ci++;
        if (ci >= text.length) { ci = 0; ti++; if (ti >= lines[li].length) { ti = 0; li++; } }
        setTimeout(type, 28 + Math.random() * 30);
      };
      setTimeout(type, 700);
    }
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* 10. HERO MOUSE PARALLAX ------------------------------------------ */
  const parallaxRoot = document.getElementById("heroParallax");
  if (parallaxRoot && !prefersReduced && window.matchMedia("(pointer:fine)").matches) {
    const layers = parallaxRoot.querySelectorAll("[data-parallax]");
    let raf = null;
    parallaxRoot.addEventListener("mousemove", (e) => {
      const rect = parallaxRoot.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        layers.forEach((layer) => {
          const depth = parseFloat(layer.dataset.parallax) || 0.03;
          layer.style.transform = `translate3d(${-cx * depth * 600}px, ${-cy * depth * 600}px, 0)`;
        });
        raf = null;
      });
    });
    parallaxRoot.addEventListener("mouseleave", () => {
      layers.forEach((layer) => { layer.style.transform = ""; });
    });
  }

  /* 11. HERO NETWORK PARTICLE CANVAS --------------------------------- */
  const canvas = document.getElementById("network");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes = [], mouse = { x: -9999, y: -9999 };
    const COLORS = ["#7c5cff", "#27c0ff", "#2ee6a6"];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with area, capped for performance
      const count = Math.min(90, Math.floor((w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 1,
        c: COLORS[(Math.random() * COLORS.length) | 0],
      }));
    };

    const MAX_DIST = 130;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        // Bounce at edges
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // Connection lines
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            ctx.globalAlpha = (1 - dist / MAX_DIST) * 0.4;
            ctx.strokeStyle = n.c;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        // Mouse interaction line
        const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 160) {
          ctx.globalAlpha = (1 - mdist / 160) * 0.5;
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }

        // Node
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = n.c;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    let animId = null;
    const start = () => { if (!animId) draw(); };
    const stop = () => { if (animId) { cancelAnimationFrame(animId); animId = null; } };

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

    // Pause animation when hero is offscreen (save CPU/battery)
    if ("IntersectionObserver" in window) {
      const heroObs = new IntersectionObserver(
        (entries) => entries.forEach((en) => (en.isIntersecting ? start() : stop())),
        { threshold: 0.01 }
      );
      heroObs.observe(canvas);
    } else {
      start();
    }

    let resizeT;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(resize, 150);
    });
    resize();
  }

  /* 12. FOOTER YEAR -------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
