// Captures the site's hero section as the 1200x630 social share image (assets/og-image.jpg).
// Usage: node reel/tools/og.mjs [url]  (from the project folder)
import { chromium } from "playwright";

const URL = process.argv[2] || "http://localhost:8080/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: "networkidle" });
await page.addStyleTag({ content: `
  .hero { margin: 0 !important; border-radius: 0 !important; min-height: 630px !important; height: 630px; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
`});
await page.evaluate(async () => {
  const v = document.querySelector(".hero__video video");
  v.pause(); v.currentTime = 1.5;
  await new Promise((r) => v.addEventListener("seeked", r, { once: true }));
});
await page.waitForTimeout(800);
await page.locator(".hero").screenshot({ path: "assets/og-image.png" });
await browser.close();
console.log("assets/og-image.png");
