// Owner opt-out shared by the Meta Pixel and the HQ tracker. Open the site
// once per browser with ?me=1 and that browser is never tracked again
// (?me=0 turns tracking back on). The flag lives in localStorage, so it has
// to be set separately in Safari, Chrome and the Facebook / Instagram in-app
// browsers, and Safari drops it after seven days without a tap on the site.
// Everyone else is untouched. Safe to hand to friends and family.
const KEY = "ts_owner";

/** True when this browser has opted out. Handles ?me=1 / ?me=0 and strips the param from the URL. Idempotent. */
export function ownerBrowser(): boolean {
  try {
    const q = new URLSearchParams(location.search);
    const me = q.get("me");
    if (me === "1") localStorage.setItem(KEY, "1");
    else if (me === "0") localStorage.removeItem(KEY);
    if (me !== null) {
      q.delete("me");
      const search = q.toString();
      history.replaceState(history.state, "", location.pathname + (search ? `?${search}` : "") + location.hash);
    }
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}
