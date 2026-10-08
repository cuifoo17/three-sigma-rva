"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { book } from "@/content/site";
import { enrolling } from "@/content/deck";

// Dummy form: the submit button appears once every required field is filled,
// and submitting sends nothing yet; it just hands the values to onSubmit.
// Names sit side by side at every width. Email and phone pair up from
// tablet width and stack on phones, where half a screen is too narrow to
// type an address into. Preferred days is optional, one tap.
const fieldClass =
  "w-full rounded-xl border border-primary/15 bg-surface px-4 py-3 text-base text-primary placeholder:text-primary/40 focus:border-primary focus:outline-none md:text-sm";

export type BookValues = {
  parent: string;
  child: string;
  email: string;
  phone: string;
  days: string;
  background: string;
};

export default function BookForm({
  onSubmit,
  busy = false,
}: {
  onSubmit?: (values: BookValues) => void;
  // Held in its pressed look while the page works (the book screen captures
  // the section for its cube twist).
  busy?: boolean;
}) {
  const [values, setValues] = useState<BookValues>({
    parent: "",
    child: "",
    email: "",
    phone: "",
    days: "",
    background: "",
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- TODO(dev): drop with the line below
  const complete = (["parent", "child", "email", "phone", "background"] as const).every(
    (k) => values[k].trim().length > 0,
  );
  const ready = true; // TODO(dev): restore `complete` gate before launch (const ready = complete;)

  const update =
    (key: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

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
          <span className="text-sm font-bold">{book.fields.parent}</span>
          <input
            type="text"
            autoComplete="name"
            className={fieldClass}
            value={values.parent}
            onChange={update("parent")}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-sm font-bold">{book.fields.child}</span>
          <input
            type="text"
            className={fieldClass}
            value={values.child}
            onChange={update("child")}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-3">
        <label className="grid gap-1.5">
          <span className="text-sm font-bold">{book.fields.email}</span>
          <input
            type="email"
            autoComplete="email"
            inputMode="email"
            className={fieldClass}
            value={values.email}
            onChange={update("email")}
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
          />
        </label>
      </div>

      <fieldset className="grid gap-1.5">
        <legend className="text-sm font-bold">{book.fields.days}</legend>
        <div className="grid grid-cols-3 gap-2">
          {enrolling.cohorts.map((c) => {
            const on = values.days === c.days;
            return (
              <button
                key={c.days}
                type="button"
                aria-pressed={on}
                onClick={() => setValues((v) => ({ ...v, days: on ? "" : c.days }))}
                className={`min-h-touch rounded-xl border px-2 py-2 text-base font-bold transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:text-sm ${
                  on
                    ? "border-primary bg-primary text-background"
                    : "border-primary/15 bg-surface text-primary hover:border-primary/40"
                }`}
              >
                {c.days}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="grid gap-1.5">
        <span className="text-sm font-bold">{book.fields.background}</span>
        <textarea
          rows={5}
          className={`${fieldClass} resize-y`}
          value={values.background}
          onChange={update("background")}
        />
      </label>
      {ready && (
        <div className="pt-2">
          <Button
            type="submit"
            variant="secondary"
            className={`w-full md:w-auto ${busy ? "pointer-events-none scale-[0.98] bg-primary/10" : ""}`}
          >
            {book.submit}
          </Button>
        </div>
      )}
    </form>
  );
}
