"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { touched, track, type FormField } from "@/lib/analytics";
import { book } from "@/content/site";

// The submit button is always there, greyed out until the name has two
// characters, the phone is a full ten digits and the email has two; submitting
// hands the values to onSubmit, which posts them to HQ. Name and phone share
// a row at every width (founder's call); email gets a full row, since half a
// phone screen is too narrow to type an address into.
// "Anything else" is optional.
const fieldClass =
  "w-full rounded-xl border border-primary/15 bg-surface px-4 py-3 text-base text-primary placeholder:text-primary/40 focus:border-primary focus:outline-none md:text-sm";

// US phone as (xxx) xxx-xxxx while they type: digits only, ten at most, the
// punctuation added as soon as each group is there. A leading country code 1
// (autofill often gives +1 ...) is dropped. Posted in this shape.
function formatPhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) d = d.slice(1);
  d = d.slice(0, 10);
  if (d.length === 0) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export type BookValues = {
  name: string;
  email: string;
  phone: string;
  // No picker any more (founder's call); stays in the payload, always empty.
  times: string[];
  anything: string;
};

export default function BookForm({
  onSubmit,
  busy = false,
  error = null,
}: {
  onSubmit?: (values: BookValues) => void;
  // Held in its pressed look while the page works (posting, then the book
  // screen capturing the section for its cube twist).
  busy?: boolean;
  // Shown under the button when the post failed; the form keeps its values.
  error?: string | null;
}) {
  const [values, setValues] = useState<BookValues>({
    name: "",
    email: "",
    phone: "",
    times: [],
    anything: "",
  });
  const ready =
    values.name.trim().length >= 2 &&
    values.phone.replace(/\D/g, "").length === 10 &&
    values.email.trim().length >= 2;

  // HQ analytics: the first time the button lights up.
  useEffect(() => {
    if (ready) track("formReady");
  }, [ready]);

  const update =
    (key: FormField) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      touched(key);
      setValues((v) => ({
        ...v,
        [key]: key === "phone" ? formatPhone(e.target.value) : e.target.value,
      }));
    };
  // HQ analytics: a tap into any field counts as starting the form.
  const started = () => track("formStarted");

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (ready && !busy) onSubmit?.(values);
      }}
      aria-busy={busy}
      noValidate
    >
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5">
          <span className="text-sm font-bold">{book.fields.name}</span>
          <input
            type="text"
            autoComplete="name"
            className={fieldClass}
            value={values.name}
            onChange={update("name")}
            onFocus={started}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-bold">{book.fields.phone}</span>
          <input
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={fieldClass}
            value={values.phone}
            onChange={update("phone")}
            onFocus={started}
          />
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-bold">{book.fields.email}</span>
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          className={fieldClass}
          value={values.email}
          onChange={update("email")}
          onFocus={started}
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-sm font-bold">{book.fields.anything}</span>
        <textarea
          rows={3}
          className={`${fieldClass} resize-y`}
          value={values.anything}
          onChange={update("anything")}
          onFocus={started}
        />
      </label>
      <div className="pt-2">
        <Button
          type="submit"
          variant="navy"
          disabled={!ready}
          className={`w-full md:w-auto ${busy ? "pointer-events-none scale-[0.98] brightness-90" : ""}`}
        >
          {busy ? "Sending…" : book.submit}
        </Button>
        {error && (
          <p role="alert" className="mt-3 text-sm font-bold text-primary">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
