// ===============================
// EFEITO DE DIGITAÇÃO
// ===============================

const words = [

    "Monitorando ameaças...",
    "Analisando incidentes...",
    "Protegendo sistemas...",
    "Automatizando processos...",
    "SOC Analyst...",
    "Cyber Security..."
];

let wordIndex = 0;
let letterIndex = 0;
let currentWord = "";
let isDeleting = false;

function typeEffect() {

    currentWord = words[wordIndex];

    if (!isDeleting) {

        letterIndex++;

    } else {

        letterIndex--;

    }

    document.getElementById("text").textContent =
        currentWord.substring(0, letterIndex);

    let speed = isDeleting ? 50 : 120;

    if (!isDeleting && letterIndex === currentWord.length) {

        speed = 1800;
        isDeleting = true;

    } else if (isDeleting && letterIndex === 0) {

        isDeleting = false;
        wordIndex++;

        if (wordIndex === words.length) {

            wordIndex = 0;
        }
    }

    setTimeout(typeEffect, speed);
}

typeEffect();


// ===============================
// ANIMAÇÃO AO ROLAR A PÁGINA
// ===============================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");
        }
    });

}, {
    threshold: 0.15
});

document.querySelectorAll(
    ".card, .projeto-card, .stat, .skill, .tools span, .sobre-card"
).forEach((el) => {

    el.classList.add("hidden");
    observer.observe(el);
});


// ===============================
// CONTADOR ANIMADO
// ===============================

const stats = document.querySelectorAll(".stat h3");

const animateCounter = (element, target) => {

    let count = 0;

    const increment = target / 60;

    const update = () => {

        count += increment;

        if (count < target) {

            element.innerText = Math.floor(count);

            requestAnimationFrame(update);

        } else {

            element.innerText = target;
        }
    };

    update();
};

const statObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const el = entry.target;

            const text = el.innerText;

            if (
                text.includes("%") ||
                text.includes("→") ||
                text.includes("h")
            ) {
                return;
            }

            const target = parseInt(text);

            if (!isNaN(target)) {

                el.innerText = "0";

                animateCounter(el, target);
            }

            statObserver.unobserve(el);
        }
    });

}, {
    threshold: 0.5
});

stats.forEach(stat => {

    statObserver.observe(stat);
});


// ===============================
// EFEITO PARALLAX
// ===============================

window.addEventListener("scroll", () => {

    const glow = document.querySelector(".background-glow");

    let value = window.scrollY * 0.2;

    glow.style.transform =
        `translateY(${value}px)`;
});


// ===============================
// BOTÃO VOLTAR AO TOPO
// ===============================

const topButton = document.createElement("button");

topButton.innerHTML = "↑";

topButton.id = "topButton";

document.body.appendChild(topButton);

topButton.style.position = "fixed";
topButton.style.bottom = "25px";
topButton.style.right = "25px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.border = "none";
topButton.style.borderRadius = "50%";
topButton.style.background = "#00ff9d";
topButton.style.color = "#000";
topButton.style.fontSize = "22px";
topButton.style.cursor = "pointer";
topButton.style.display = "none";
topButton.style.zIndex = "9999";
topButton.style.boxShadow = "0 0 15px rgba(0,255,157,.4)";

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";
    }
});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,
        behavior: "smooth"
    });
});


// ===============================
// EFEITO BRILHO NO NOME
// ===============================

const heroTitle = document.querySelector(".hero h1");

setInterval(() => {

    heroTitle.style.textShadow =
        "0 0 10px #00ff9d, 0 0 25px #00ff9d";

    setTimeout(() => {

        heroTitle.style.textShadow = "none";

    }, 1000);

}, 4000);