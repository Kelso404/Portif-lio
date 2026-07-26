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
    const targets = $$(".card, .project, .stat, .skill, .soc-console");
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
     SIMULADOR SOC
     Todos os eventos são fictícios, gerados no cliente apenas
     para demonstrar rotina de triagem em um SOC.
  ============================================================ */
  const initSocSimulator = () => {
    const feedEl = $("#socFeed");
    if (!feedEl) return;

    const feedCountEl = $("#socFeedCount");
    const totalEl = $("#socTotalAlerts");
    const blockedEl = $("#socBlocked");
    const activeEl = $("#socActive");
    const severityBarsEl = $("#socSeverityBars");
    const statusDot = $("#socStatusDot");
    const statusText = $("#socStatusText");
    const attackBtn = $("#socSimulateAttack");
    const pauseBtn = $("#socPauseToggle");
    const canvas = $("#socTrafficChart");
    const ctx = canvas ? canvas.getContext("2d") : null;

    const EVENT_POOL = {
      critical: [
        "Ransomware — assinatura detectada",
        "Exfiltração de dados suspeita",
        "Ataque DDoS em andamento",
        "Escalonamento de privilégios não autorizado",
      ],
      high: [
        "Tentativa de SQL Injection bloqueada",
        "Malware detectado em endpoint",
        "Múltiplas tentativas de login (brute force)",
        "Conexão com C2 conhecido bloqueada",
      ],
      medium: [
        "Port scan detectado",
        "Tráfego incomum de saída",
        "Política de firewall violada",
        "Certificado SSL expirado",
      ],
      low: [
        "Login fora do horário habitual",
        "Assinatura de antivírus atualizada",
        "Verificação de integridade concluída",
        "Novo dispositivo autenticado na rede",
      ],
    };

    const SEVERITY_LABELS = {
      critical: "Crítico",
      high: "Alto",
      medium: "Médio",
      low: "Baixo",
    };

    const SEVERITY_WEIGHTS = [
      ["low", 0.4],
      ["medium", 0.35],
      ["high", 0.2],
      ["critical", 0.05],
    ];

    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    let totalAlerts = 0;
    let blockedCount = 0;
    let currentFilter = "all";
    let isPaused = false;
    let tickTimer = null;
    const MAX_FEED_ITEMS = 30;

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const randomIp = () =>
      `${1 + Math.floor(Math.random() * 223)}.${Math.floor(
        Math.random() * 255
      )}.${Math.floor(Math.random() * 255)}.${1 + Math.floor(Math.random() * 254)}`;

    const pickSeverity = () => {
      const roll = Math.random();
      let acc = 0;
      for (const [sev, weight] of SEVERITY_WEIGHTS) {
        acc += weight;
        if (roll <= acc) return sev;
      }
      return "low";
    };

    const actionFor = (severity) => {
      if (severity === "critical") return pick(["Bloqueado", "Em investigação"]);
      if (severity === "high") return pick(["Bloqueado", "Mitigado", "Em investigação"]);
      if (severity === "medium") return "Monitorando";
      return "Registrado";
    };

    const timeNow = () =>
      new Date().toLocaleTimeString("pt-BR", { hour12: false });

    const updateFilterVisibility = () => {
      $$(".soc-event", feedEl).forEach((el) => {
        const match = currentFilter === "all" || el.dataset.severity === currentFilter;
        el.classList.toggle("hidden-by-filter", !match);
      });
    };

    const renderSeverityBars = () => {
      if (!severityBarsEl) return;
      const total = Math.max(totalAlerts, 1);
      severityBarsEl.innerHTML = ["critical", "high", "medium", "low"]
        .map((sev) => {
          const pct = Math.round((counts[sev] / total) * 100);
          return `
            <div class="soc-sev-row">
              <span class="soc-sev-name">${SEVERITY_LABELS[sev]}</span>
              <span class="soc-sev-track"><span class="soc-sev-fill sev-fill-${sev}" style="width:${pct}%"></span></span>
              <span class="soc-sev-count">${counts[sev]}</span>
            </div>`;
        })
        .join("");
    };

    const updateMetrics = () => {
      if (totalEl) totalEl.textContent = totalAlerts;
      if (blockedEl) blockedEl.textContent = blockedCount;
      if (activeEl) activeEl.textContent = counts.critical + counts.high;
      if (feedCountEl) {
        const n = feedEl.children.length;
        feedCountEl.textContent = `${n} evento${n === 1 ? "" : "s"}`;
      }
      renderSeverityBars();
    };

    const addEvent = (forcedSeverity) => {
      const severity = forcedSeverity || pickSeverity();
      const type = pick(EVENT_POOL[severity]);
      const action = actionFor(severity);
      const ip = randomIp();

      totalAlerts += 1;
      counts[severity] += 1;
      if (action === "Bloqueado" || action === "Mitigado") blockedCount += 1;

      const item = document.createElement("div");
      item.className = `soc-event severity-${severity}`;
      item.dataset.severity = severity;
      item.innerHTML = `
        <span class="soc-event-time">${timeNow()}</span>
        <div class="soc-event-main">
          <span class="soc-event-type">${type}</span>
          <span class="soc-event-meta">Origem ${ip} · ${action}</span>
        </div>
        <span class="soc-sev-tag">${SEVERITY_LABELS[severity]}</span>
      `;

      if (forcedSeverity && !prefersReducedMotion) item.classList.add("flash");
      if (currentFilter !== "all" && severity !== currentFilter) {
        item.classList.add("hidden-by-filter");
      }

      feedEl.prepend(item);
      while (feedEl.children.length > MAX_FEED_ITEMS) {
        feedEl.lastElementChild.remove();
      }

      updateMetrics();
      return severity;
    };

    /* --- gráfico de tráfego (canvas) --- */
    const trafficData = Array.from({ length: 40 }, () => 30 + Math.random() * 20);
    let spikeTicks = 0;

    const drawTraffic = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const max = 100;
      const step = w / (trafficData.length - 1);

      ctx.beginPath();
      trafficData.forEach((v, i) => {
        const x = i * step;
        const y = h - (v / max) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, "rgba(0,255,157,.5)");
      gradient.addColorStop(1, "rgba(0,255,157,0)");

      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      trafficData.forEach((v, i) => {
        const x = i * step;
        const y = h - (v / max) * h;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = "#00ff9d";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    const stepTraffic = () => {
      const base = 35 + Math.sin(Date.now() / 4000) * 12;
      const noise = (Math.random() - 0.5) * 10;
      const spike = spikeTicks > 0 ? 45 : 0;
      if (spikeTicks > 0) spikeTicks -= 1;

      let next = Math.max(5, Math.min(98, base + noise + spike));
      trafficData.push(next);
      trafficData.shift();
      drawTraffic();
    };

    /* --- ciclo de eventos --- */
    const scheduleNextTick = () => {
      if (isPaused) return;
      const delay = 1800 + Math.random() * 1800;
      tickTimer = setTimeout(() => {
        addEvent();
        stepTraffic();
        scheduleNextTick();
      }, delay);
    };

    if (attackBtn) {
      attackBtn.addEventListener("click", () => {
        addEvent("critical");
        spikeTicks = 6;
        stepTraffic();
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => {
        isPaused = !isPaused;
        pauseBtn.textContent = isPaused ? "Retomar" : "Pausar";
        pauseBtn.setAttribute("aria-pressed", String(isPaused));
        if (statusDot) statusDot.classList.toggle("paused", isPaused);
        if (statusText) {
          statusText.textContent = isPaused ? "MONITORAMENTO PAUSADO" : "MONITORAMENTO ATIVO";
        }
        if (isPaused) {
          clearTimeout(tickTimer);
        } else {
          scheduleNextTick();
        }
      });
    }

    $$(".soc-filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".soc-filter").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        updateFilterVisibility();
      });
    });

    /* estado inicial: alguns eventos já na tela */
    drawTraffic();
    addEvent("low");
    addEvent("medium");
    addEvent("high");
    scheduleNextTick();
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
    initSocSimulator();
    initParallax();
    initTopButton();
    initFooterYear();
  });
})();
