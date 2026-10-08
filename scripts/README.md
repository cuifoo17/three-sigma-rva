# Phone and desktop checks

Headless Chrome via `--window-size=390,…` silently lays the page out at ~500px
(Chrome's minimum window width), so phone captures from it are wrong. These
scripts drive a real phone-emulated browser instead (Playwright, iPhone 14
profile). They use the Chromium that Playwright has already cached on this Mac;
if the path in the script doesn't exist, run `npx playwright install chromium`
and update `exe`.

Dev server must be running (`npm run dev`).

```sh
# full-page screenshot, phone or desktop; "fold" captures only the first screen
node scripts/shot.mjs http://localhost:3000 /tmp/home-m.png mobile full
node scripts/shot.mjs http://localhost:3000 /tmp/home-d.png desktop fold

# walks the phone UI: opens the menu, taps a row to open its pop-up,
# fills the form until Submit appears; writes menu.png, popup.png, form.png
node scripts/interact.mjs /tmp
```

Both print `scrollWidth/innerWidth`; if the two numbers differ, something
overflows horizontally.
