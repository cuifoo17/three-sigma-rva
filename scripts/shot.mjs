import { chromium, devices } from "playwright-core";
const [,, url, out, mode="mobile", full="full"] = process.argv;
const exe = "/Users/brau/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
const browser = await chromium.launch({ executablePath: exe });
const ctx = await browser.newContext(mode === "mobile" ? devices["iPhone 14"] : { viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
// scroll through so every reveal fires, then back to top
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < total; y += 500) { await page.mouse.wheel(0, 500); await page.waitForTimeout(250); }
await page.waitForTimeout(800);
// scroll snap moves the page between full-page tiles; turn it off for the capture only
await page.evaluate(() => { document.documentElement.style.scrollSnapType = "none"; document.documentElement.style.scrollBehavior = "auto"; });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
const sw = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
console.log("scrollWidth/innerWidth", sw.join("/"));
await page.screenshot({ path: out, fullPage: full === "full" });
await browser.close();
