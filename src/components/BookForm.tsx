"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { book } from "@/content/site";

// The submit button appears once name, email and phone are filled; submitting
// hands the values to onSubmit, which posts them to HQ. Name and phone share
// a row at every width (founder's call); email gets a full row, since half a
// phone screen is too narrow to type an address into.
// "Anything else" is optional.
const fieldClass =
  "w-full rounded-xl border border-primary/15 bg-surface px-4 py-3 text-base text-primary placeholder:text-primary/40 focus:border-primary focus:outline-none md:text-sm";

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
  const ready = (["name", "email", "phone"] as const).every((k) => values[k].trim().length > 0);

  const update =
    (key: "name" | "email" | "phone" | "anything") =>
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
          <span className="text-sm font-bold">{book.fields.name}</span>
          <input
            type="text"
            autoComplete="name"
            className={fieldClass}
            value={values.name}
            onChange={update("name")}
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
        <span className="text-sm font-bold">{book.fields.anything}</span>
        <textarea
          rows={4}
          className={`${fieldClass} resize-y`}
          value={values.anything}
          onChange={update("anything")}
        />
      </label>
      {ready && (
        <div className="pt-2">
          <Button
            type="submit"
            variant="secondary"
            className={`w-full md:w-auto ${busy ? "pointer-events-none scale-[0.98] bg-primary/10" : ""}`}
          >
            {busy ? "Sending…" : book.submit}
          </Button>
          {error && (
            <p role="alert" className="mt-3 text-sm font-bold text-primary">
              {error}
            </p>
          )}
        </div>
      )}
    </form>
  );
}
