// Ndamatou Fitness — interactions
const WHATSAPP = "221785081212";

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

// Planning à onglets
const tabs = document.querySelector(".tabs");
const schedule = document.getElementById("schedule");
const days = Object.keys(PLANNING);
const todayIndex = (new Date().getDay() + 6) % 7; // lundi = 0

function renderDay(day) {
  tabs.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t.dataset.day === day)));
  schedule.innerHTML = PLANNING[day].map(([time, name, coach]) => `
    <div class="slot"><span class="slot__time">${time}</span><span class="slot__name">${name}</span><span class="slot__coach">${coach}</span></div>`).join("");
}
days.forEach((day) => {
  const b = document.createElement("button");
  b.className = "tab";
  b.type = "button";
  b.role = "tab";
  b.dataset.day = day;
  b.textContent = day;
  b.addEventListener("click", () => renderDay(day));
  tabs.appendChild(b);
});
renderDay(days[todayIndex]);

// Formulaire -> message WhatsApp pré-rempli
const form = document.getElementById("form");
const error = document.getElementById("formError");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nom = data.get("nom").trim();
  const tel = data.get("tel").trim();
  if (!nom || !tel) {
    error.textContent = "Merci d'indiquer ton nom et ton numéro de téléphone.";
    return;
  }
  error.textContent = "";
  const text = [
    "Bonjour Ndamatou Fitness 👋",
    `Je m'appelle ${nom} (${tel}).`,
    `Je suis intéressé·e par : ${data.get("offre")}.`,
    data.get("message").trim(),
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

// Apparition au scroll
const revealables = document.querySelectorAll(".section .container > *");
revealables.forEach((el) => el.classList.add("reveal"));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
revealables.forEach((el) => io.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
