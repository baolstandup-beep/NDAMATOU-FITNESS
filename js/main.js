// Ndamatou Fitness — interactions
const WHATSAPP = "221785081212";
const openWhatsApp = (text) =>
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");

// Planning indicatif — à ajuster selon les horaires réels de la salle
const PLANNING = {
  Lundi:    [["06h30 – 08h00", "Musculation libre", "Accès salle"], ["18h00 – 19h00", "Body Combat", "Coach"], ["19h30 – 20h30", "Renforcement", "Coach"]],
  Mardi:    [["06h30 – 08h00", "Cardio", "Accès salle"], ["18h00 – 19h00", "Attack", "Coach"], ["19h30 – 20h30", "Stretching", "Coach"]],
  Mercredi: [["06h30 – 08h00", "Musculation libre", "Accès salle"], ["18h00 – 19h00", "Danse dynamique", "Coach"], ["19h30 – 20h30", "Body Combat", "Coach"]],
  Jeudi:    [["06h30 – 08h00", "Cardio", "Accès salle"], ["18h00 – 19h00", "Attack", "Coach"], ["19h30 – 20h30", "Renforcement", "Coach"]],
  Vendredi: [["15h00 – 17h00", "Musculation libre", "Accès salle"], ["18h00 – 19h00", "Body Combat", "Coach"]],
  Samedi:   [["08h00 – 09h30", "Fitness collectif", "Coach"], ["10h00 – 11h00", "Danse dynamique", "Coach"]],
  Dimanche: [["09h00 – 11h00", "Séance libre", "Accès salle"]],
};

// Menu mobile
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("menu");
function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menu.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
}
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Vidéo du hero : pas de lecture auto si l'utilisateur préfère moins d'animations
const heroVideo = document.querySelector(".hero__video video");
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  heroVideo.removeAttribute("autoplay");
  heroVideo.pause();
}

// Vidéo de visite : gros bouton lecture aux couleurs de la salle
const visitVideo = document.getElementById("visitVideo");
const visitPlayer = visitVideo.parentElement;
visitPlayer.querySelector(".visit__play").addEventListener("click", () => visitVideo.play());
visitVideo.addEventListener("play", () => visitPlayer.classList.add("is-playing"));
visitVideo.addEventListener("ended", () => visitPlayer.classList.remove("is-playing"));

// Carrousel
const carousel = document.getElementById("carousel");
document.querySelectorAll(".carousel__nav .round").forEach((btn) => {
  btn.addEventListener("click", () => {
    const step = carousel.querySelector(".photo:not(.photo--wide)").offsetWidth + 16;
    carousel.scrollBy({ left: step * Number(btn.dataset.dir), behavior: "smooth" });
  });
});

// Planning à onglets
const tabs = document.querySelector(".tabs");
const schedule = document.getElementById("schedule");
const days = Object.keys(PLANNING);
function renderDay(day) {
  tabs.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.day === day)));
  schedule.innerHTML = PLANNING[day].map(([time, name, coach]) => `
    <div class="slot"><span class="slot__time">${time}</span><span class="slot__name">${name}</span><span class="slot__coach">${coach}</span></div>`).join("");
}
days.forEach((day) => {
  const b = document.createElement("button");
  Object.assign(b, { className: "tab", type: "button", textContent: day });
  b.setAttribute("role", "tab");
  b.dataset.day = day;
  b.addEventListener("click", () => renderDay(day));
  tabs.appendChild(b);
});
renderDay(days[(new Date().getDay() + 6) % 7]); // lundi = 0

// Inscription événements -> WhatsApp
const newsForm = document.getElementById("newsForm");
const newsMsg = document.getElementById("newsMsg");
newsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const tel = document.getElementById("newsTel").value.trim();
  if (tel.replace(/\D/g, "").length < 9) { newsMsg.textContent = "Entre un numéro valide."; return; }
  newsMsg.textContent = "Merci ! Envoie le message WhatsApp pour confirmer.";
  openWhatsApp(`Bonjour Ndamatou Fitness, je veux être informé·e des prochaines Master Class et événements. Mon numéro : ${tel}`);
});

// Formulaire de contact -> message WhatsApp pré-rempli
const form = document.getElementById("form");
const error = document.getElementById("formError");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nom = data.get("nom").trim();
  const tel = data.get("tel").trim();
  if (!nom || !tel) { error.textContent = "Merci d'indiquer ton nom et ton numéro de téléphone."; return; }
  error.textContent = "";
  openWhatsApp([
    "Bonjour Ndamatou Fitness 👋",
    `Je m'appelle ${nom} (${tel}).`,
    `Je suis intéressé·e par : ${data.get("offre")}.`,
    data.get("message").trim(),
  ].filter(Boolean).join("\n"));
});

// Apparition au scroll
const revealables = document.querySelectorAll(".section .container > *, .dark > *");
revealables.forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
  });
}, { threshold: 0.1 });
revealables.forEach((el) => io.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
