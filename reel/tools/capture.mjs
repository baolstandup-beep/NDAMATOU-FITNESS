// Captures each section of the live site with scroll-reveal forced on.
// Usage: node reel/tools/capture.mjs  (from the project folder)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const URL = "https://ndamatou-fitness.vercel.app/";
const OUT = "reel/assets/real";
mkdirSync(OUT, { recursive: true });

const SECTIONS = {
  hero: "header.hero",
  about: "#apropos",
  cours: "#cours",
  visite: "#visite",
  espaces: ".spaces",
  equipe: "#equipe",
  dark: ".dark",
  planning: "#planning",
  tarifs: "#tarifs",
  tiktok: "#tiktok",
  presse: "#presse",
  map: ".map",
  contact: "#contact",
};

async function prepare(page) {
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible"));
    document.querySelectorAll("[loading=lazy]").forEach((e) => (e.loading = "eager"));
    // Pause hero video on a frame so screenshots are stable.
    document.querySelectorAll("video").forEach((v) => { v.pause(); });
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((r) => setTimeout(r, 2500));
    window.scrollTo(0, 0);
    await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })));
  });
  await page.addStyleTag({ content: ".reveal{opacity:1!important;transform:none!important} *{transition:none!important;animation:none!important}" });
  await page.waitForTimeout(3000); // map iframe tiles
}

const browser = await chromium.launch();
for (const [label, vp, dpr] of [["m", { width: 390, height: 844 }, 3], ["d", { width: 1440, height: 900 }, 2]]) {
  const page = await browser.newPage({ viewport: vp, deviceScaleFactor: dpr });
  await prepare(page);
  await page.screenshot({ path: `${OUT}/${label}_viewport.png` });
  for (const [name, sel] of Object.entries(SECTIONS)) {
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(name === "map" ? 2500 : 400);
    await el.screenshot({ path: `${OUT}/${label}_${name}.png` });
    console.log(`${OUT}/${label}_${name}.png`);
  }
  // Menu opened (mobile only)
  if (label === "m") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click(".nav__toggle");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}/m_menu.png` });
  }
  await page.close();
}
await browser.close();
