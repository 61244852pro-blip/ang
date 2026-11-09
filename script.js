
/* =========================================================
   UNA AVENTURA PARA ANGGE
   JavaScript principal
   Archivo: js/script.js
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initMotionEffects();
  initCountdown();
  initCalendar();
  initMemoryBoard();
  initLetter();
  initMusic();
});

/* =========================================================
   1. PANTALLA DE CARGA
   ========================================================= */

function initLoader() {
  const loader = document.getElementById("loader");
  const flowers = document.getElementById("flowerOpening");
  if (!loader) return;

  if (flowers) {
    const petals = ["✿", "❀", "🌹", "🌸", "❁", "✾", "🌺"];
    const colors = ["#f4b7c5", "#ffd7df", "#cf6b82", "#fff0d6", "#e9a2b2", "#f7d4a5"];
    for (let index = 0; index < 104; index += 1) {
      const flower = document.createElement("span");
      flower.className = "opening-flower";
      flower.textContent = petals[index % petals.length];
      flower.style.setProperty("--flower-x", `${Math.random() * 100}%`);
      flower.style.setProperty("--flower-y", `${Math.random() * 100}%`);
      flower.style.setProperty("--flower-size", `${2.2 + Math.random() * 5.8}rem`);
      flower.style.setProperty("--flower-color", colors[index % colors.length]);
      flower.style.setProperty("--flower-delay", `${Math.random() * .9}s`);
      flower.style.setProperty("--flower-drift", `${(Math.random() - .5) * 180}px`);
      flower.style.setProperty("--flower-rise", `${(Math.random() - .5) * 180}px`);
      flowers.appendChild(flower);
    }
  }

  const dismissLoader = () => { if (loader.classList.contains('is-hidden')) return; loader.classList.add('is-hidden'); window.setTimeout(() => { try { loader.remove(); } catch(e) {} }, 750); }; loader.addEventListener('click', dismissLoader); window.addEventListener('keydown', dismissLoader, { once: true }); window.setTimeout(dismissLoader, 5200);
}

function initMotionEffects() {  const flowerLayer = document.createElement("div");
  flowerLayer.className = "page-flower-layer";
  flowerLayer.setAttribute("aria-hidden", "true");
  const flowerGlyphs = ["🌸", "🌺", "🌼", "🌷", "✿", "❀", "🌹"];
  for (let index = 0; index < 18; index += 1) {
    const flower = document.createElement("span");
    flower.className = "page-flower";
    flower.textContent = flowerGlyphs[index % flowerGlyphs.length];
    flower.style.setProperty("--flower-x", `${Math.random() * 100}%`);
    flower.style.setProperty("--flower-size", `${.8 + Math.random() * 1.3}rem`);
    flower.style.setProperty("--flower-duration", `${7 + Math.random() * 11}s`);
    flower.style.setProperty("--flower-delay", `${Math.random() * -18}s`);
    flower.style.setProperty("--flower-sway", `${(Math.random() - .5) * 180}px`);
    flowerLayer.appendChild(flower);
  }
  document.body.appendChild(flowerLayer);

  const introBackground = document.querySelector(".intro__background");
  if (introBackground) {
    const petals = ["❀", "✿", "❁", "🌸", "🌹", "✾"];
    const colors = ["rgba(255, 210, 220, .68)", "rgba(232, 213, 168, .72)", "rgba(201, 111, 133, .62)"];
    for (let index = 0; index < 42; index += 1) {
      const petal = document.createElement("span");
      petal.className = "intro-petal";
      petal.textContent = petals[index % petals.length];
      petal.style.setProperty("--petal-x", `${Math.random() * 100}%`);
      petal.style.setProperty("--petal-y", `${Math.random() * 100}%`);
      petal.style.setProperty("--petal-size", `${1.2 + Math.random() * 3.5}rem`);
      petal.style.setProperty("--petal-speed", `${3 + Math.random() * 5}s`);
      petal.style.setProperty("--petal-delay", `${Math.random() * -5}s`);
      petal.style.setProperty("--petal-color", colors[index % colors.length]);
      introBackground.appendChild(petal);
    }
  }

  const revealItems = document.querySelectorAll(".section-heading, .calendar-layout, .countdown-layout, .memory-board, .envelope, .final-section > *");
  if (!("IntersectionObserver" in window)) return;
  document.body.classList.add("motion-ready");
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    });
  }, { threshold: .16 });
  revealItems.forEach((item) => {
    item.classList.add("motion-reveal");
    observer.observe(item);
  });
}
/* =========================================================
   2. CUENTA REGRESIVA
   Fecha: 3 de enero de 2027
   ========================================================= */

function initCountdown() {
  const countdown = document.getElementById("countdown");

  if (!countdown) return;

  const daysEl = document.getElementById("countdownDays");
  const hoursEl = document.getElementById("countdownHours");
  const minutesEl = document.getElementById("countdownMinutes");
  const secondsEl = document.getElementById("countdownSeconds");
  const messageEl = document.getElementById("countdownMessage");

  // Si el HTML no contiene todos los números, no ejecutamos el contador.
  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const targetDate = new Date(
    countdown.dataset.target || "2027-01-03T00:00:00-05:00"
  ).getTime();

  if (Number.isNaN(targetDate)) {
    if (messageEl) {
      messageEl.textContent = "Pronto llegará un día muy especial.";
    }
    return;
  }

  let celebrationStarted = false;
  let timerId;

  const pad = (value) => String(value).padStart(2, "0");

  function updateCountdown() {
    const difference = targetDate - Date.now();

    if (difference <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";

      if (messageEl) {
        messageEl.textContent =
          "¡Hoy es el día! ¡Feliz cumpleaños, Angge!";
      }

      if (!celebrationStarted) {
        celebrationStarted = true;
        launchConfetti();
      }

      if (timerId) {
        window.clearInterval(timerId);
      }

      return;
    }

    const totalSeconds = Math.floor(difference / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  updateCountdown();

  timerId = window.setInterval(updateCountdown, 1000);
}

/* =========================================================
   3. CONFETI DE CUMPLEAÑOS
   ========================================================= */

function launchConfetti() {
  const container = document.getElementById("confetti");

  if (!container) return;

  container.replaceChildren();

  const pieces = 65;

  for (let i = 0; i < pieces; i += 1) {
    const piece = document.createElement("span");

    piece.className = "confetti-piece";

    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 1.8}s`;
    piece.style.animationDuration = `${3 + Math.random() * 2.2}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    container.appendChild(piece);
  }

  window.setTimeout(() => {
    container.replaceChildren();
  }, 7000);
}

/* =========================================================
   4. CALENDARIO DE RECUERDOS
   ========================================================= */

function initCalendar() {
  const calendar = document.querySelector(".calendar-layout");

  if (!calendar) return;

  const items = calendar.querySelectorAll(".calendar-polaroid");

  items.forEach((item) => {
    item.addEventListener("click", () => {
      item.classList.toggle("is-active");
    });
  });
}

/* =========================================================
   5. PIZARRA DE RECUERDOS
   FOTOS, MENSAJES Y VIDEO
   ========================================================= */

function initMemoryBoard() {
  const board = document.querySelector(".memory-board");
  const modal = document.getElementById("memoryModal");

  if (!board || !modal) return;

  const dialog = modal.querySelector(".memory-modal__dialog");
  const media = document.getElementById("memoryModalMedia");
  const title = document.getElementById("memoryModalTitle");
  const text = document.getElementById("memoryModalText");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");

  if (!dialog || !media || !title || !text) return;

  const memories = {
    alegria: {
      title: "Tu alegría",
      text:
        "Tienes una forma muy bonita de alegrar los días con tu sentido del humor y esa sonrisa que compartes hacen que incluso una conversación sencilla se convierta en un momento especial y pues ojalá nunca pierdas esa chispa que te hace ser tú."
    },

    corazon: {
      title: "Tu corazón",
      text:
        "Admiro la sinceridad con la que quieres y la sensibilidad con la que miras a los demás, también esa fe que te acompaña y la manera en que mantienes a Dios presente en tu vida y la belleza también está en todo lo bonito que llevas dentro."
    },

    fortaleza: {
      title: "Tu fortaleza",
      text:
        "Admiro esa fuerza que tienes para seguir adelante, esforzarte y buscar siempre ser mejor y ser sensible no te hace menos fuerte al contrario, también hay valentía en sentir profundamente y continuar persiguiendo tus sueños."
    },

    generosidad: {
      title: "Tu generosidad",
      text:
        "Hay algo especial en quien sabe escuchar, aconsejar y estar presente cuando alguien lo necesita tu disposición para ayudar y buscar soluciones habla muy bien de ti y ojalá la vida te devuelva todo lo bueno que compartes."
    },

    cancion: {
      title: "Contigo en la distancia",
      text:
        "Una canción de Luis Miguel para acompañar este momento tan bonito y especial. Espero que la disfrutes con todo el corazón."
    }
  };

  let lastFocusedElement = null;

  function openModal(memoryKey, tile) {
    const memory = memories[memoryKey];

    if (!memory) return;

    lastFocusedElement = tile;

    // Pausar el video de Mac DeMarco si estuviera reproduciéndose
    const macVideo = document.getElementById("birthdayVideo");
    if (macVideo && !macVideo.paused) {
      macVideo.pause();
    }

    // Calcular el origen de apertura para el zoom cinematográfico suave desde la foto
    if (tile && dialog) {
      const tileRect = tile.getBoundingClientRect();
      const originX = Math.round(tileRect.left + tileRect.width / 2);
      const originY = Math.round(tileRect.top + tileRect.height / 2);
      dialog.style.setProperty("--origin-x", `${originX}px`);
      dialog.style.setProperty("--origin-y", `${originY}px`);
    }

    title.textContent = memory.title;
    text.textContent = memory.text;

    media.replaceChildren();

    // En la pizarra se reproduce única y exclusivamente Luis Miguel en MP4 con audio activo
    if (memoryKey === "cancion") {
      const frame = document.createElement("div");
      frame.className = "modal-video-item";

      const video = document.createElement("video");
      video.title = "Luis Miguel · Contigo en la distancia";
      video.controls = true;
      video.playsInline = true;
      video.src = "video-luis-miguel.mp4";
      video.preload = "metadata";
      video.muted = false;
      video.volume = 1.0;
      video.load();
      frame.appendChild(video);
      media.appendChild(frame);

      // Reproducción suave al abrir
      video.play().catch(() => {});
    } else {
      // Para los recuerdos con fotografías.
      const image = tile.querySelector("img");

      if (image) {
        const enlargedImage = document.createElement("img");

        enlargedImage.src = image.currentSrc || image.src;
        enlargedImage.alt = image.alt || memory.title;

        media.appendChild(enlargedImage);
      }
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    const closeButton = modal.querySelector(".memory-modal__close");

    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeModal() {
    if (!modal.classList.contains("is-open")) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    // Detiene el video cuando se cierra la ventana.
    media.replaceChildren();

    if (lastFocusedElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  }

  board.addEventListener("click", (event) => {
    const tile = event.target.closest(".memory-tile");

    if (!tile) return;

    openModal(tile.dataset.memory, tile);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeModal();
    }
  });
}

/* =========================================================
   6. SOBRE Y CARTA FINAL
   ========================================================= */

function initLetter() {
  const openButton = document.getElementById("openLetter");
  const letter = document.getElementById("letterContent");

  if (!openButton || !letter) return;

  const instruction = openButton.querySelector(".envelope__instruction");

  openButton.addEventListener("click", () => {
    const isOpen =
      openButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      openButton.setAttribute("aria-expanded", "false");
      openButton.classList.remove("is-open");

      letter.hidden = true;

      if (instruction) {
        instruction.textContent = "Toca para abrir";
      }

      return;
    }

    openButton.setAttribute("aria-expanded", "true");
    openButton.classList.add("is-open");

    letter.hidden = false;
    letter.classList.remove("is-revealing");
    requestAnimationFrame(() => letter.classList.add("is-revealing"));

    if (instruction) {
      instruction.textContent = "Carta abierta";
    }

    window.setTimeout(() => {
      letter.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 300);
  });
}

/* =========================================================
   7. MÚSICA DE FONDO
   OPCIONAL
   ========================================================= */

function initMusic() {
  const audio = document.getElementById("backgroundMusic");
  const toggle = document.getElementById("musicToggle");

  if (!audio || !toggle) return;

  const source = audio.querySelector("source");
  const sourcePath = source?.getAttribute("src");

  // Oculta el control si todavía no se ha agregado la música.
  if (!sourcePath || sourcePath.includes("musica-fondo.mp3")) {
    toggle.hidden = true;
    return;
  }

  audio.addEventListener("canplay", () => {
    toggle.hidden = false;
  });

  audio.addEventListener("error", () => {
    toggle.hidden = true;
  });

  toggle.addEventListener("click", async () => {
    const label = toggle.querySelector(".music-toggle__label");

    try {
      if (audio.paused) {
        await audio.play();

        toggle.setAttribute("aria-pressed", "true");

        if (label) {
          label.textContent = "Pausar";
        }
      } else {
        audio.pause();

        toggle.setAttribute("aria-pressed", "false");

        if (label) {
          label.textContent = "Música";
        }
      }
    } catch (error) {
      console.warn("No se pudo reproducir el audio:", error);

      toggle.setAttribute("aria-pressed", "false");

      if (label) {
        label.textContent = "Música";
      }
    }
  });
}
