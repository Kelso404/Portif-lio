/**
 * Kayke Kelson — Portfolio
 * Módulos independentes, cada um só roda se seus elementos existem no DOM.
 * Respeita prefers-reduced-motion e usa listeners passivos para não travar o scroll.
 */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============================================================
     NAV — menu mobile
  ============================================================ */
  const initNav = () => {
    const toggle = $("#navToggle");
    const list = $("#navList");
    if (!toggle || !list) return;

    toggle.addEventListener("click", () => {
      const isOpen = list.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    list.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        list.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  };

  /* ============================================================
     EFEITO DE DIGITAÇÃO
  ============================================================ */
  const initTypingEffect = () => {
    const el = $("#text");
    if (!el) return;

    const words = [
      "Monitorando ameaças...",
      "Analisando incidentes...",
      "Protegendo sistemas...",
      "Automatizando processos...",
      "SOC Analyst...",
      "Cyber Security...",
    ];

    if (prefersReducedMotion) {
      el.textContent = words[0];
      return;
    }

    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    const tick = () => {
      const currentWord = words[wordIndex];
      letterIndex += isDeleting ? -1 : 1;
      el.textContent = currentWord.substring(0, letterIndex);

      let speed = isDeleting ? 45 : 110;

      if (!isDeleting && letterIndex === currentWord.length) {
        speed = 1600;
        isDeleting = true;
      } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 300;
      }

      setTimeout(tick, speed);
    };

    tick();
  };

  /* ============================================================
     REVEAL AO ROLAR
  ============================================================ */
  const initScrollReveal = () => {
    const targets = $$(".card, .project, .stat, .skill");
    if (!targets.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("show"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => {
      el.classList.add("hidden");
      observer.observe(el);
    });
  };

  /* ============================================================
     CONTADORES ANIMADOS (stats)
  ============================================================ */
  const initCounters = () => {
    const counters = $$(".counter");
    if (!counters.length) return;

    const animate = (el) => {
      const target = Number(el.dataset.target) || 0;

      if (prefersReducedMotion) {
        el.textContent = target;
        return;
      }

      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => observer.observe(el));
  };

  /* ============================================================
     BARRAS DE SKILL
  ============================================================ */
  const initSkillBars = () => {
    const bars = $$(".skill .bar > div");
    if (!bars.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      bars.forEach((bar) => bar.classList.add("filled"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("filled");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    bars.forEach((bar) => observer.observe(bar));
  };

  /* ============================================================
     PARALLAX NO GLOW (com rAF + listener passivo)
  ============================================================ */
  const initParallax = () => {
    const glow = $(".background-glow");
    if (!glow || prefersReducedMotion) return;

    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          glow.style.transform = `translateY(${window.scrollY * 0.15}px)`;
          ticking = false;
        });
      },
      { passive: true }
    );
  };

  /* ============================================================
     BOTÃO VOLTAR AO TOPO
  ============================================================ */
  const initTopButton = () => {
    const btn = document.createElement("button");
    btn.innerHTML = "&uarr;";
    btn.id = "topButton";
    btn.setAttribute("aria-label", "Voltar ao topo");
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          btn.classList.toggle("visible", window.scrollY > 500);
          ticking = false;
        });
      },
      { passive: true }
    );

    btn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  };

  /* ============================================================
     ANO NO RODAPÉ
  ============================================================ */
  const initFooterYear = () => {
    const el = $("#year");
    if (el) el.textContent = new Date().getFullYear();
  };

  /* ============================================================
     INIT
  ============================================================ */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initTypingEffect();
    initScrollReveal();
    initCounters();
    initSkillBars();
    initParallax();
    initTopButton();
    initFooterYear();
  });
})();