import type { BookValues } from "@/components/BookForm";

// The HQ backend (three-sigma-backend). Static export, so the URL is baked in at
// build time: NEXT_PUBLIC_LEADS_URL, local dev points at the backend's dev server.
const base = process.env.NEXT_PUBLIC_LEADS_URL ?? "";

/** Posts one form submission as a new lead. Resolves true when the backend saved it. */
export async function submitLead(values: BookValues): Promise<boolean> {
  if (!base) {
    console.warn("NEXT_PUBLIC_LEADS_URL is not set; lead not sent", values);
    return false;
  }
  try {
    const res = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        phone: values.phone,
        times: values.times,
        message: values.anything,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
