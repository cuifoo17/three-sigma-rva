"use client";

import { useEffect } from "react";
import { start } from "@/lib/analytics";

// Mounts the HQ page tracker once the page is up (see lib/analytics).
export default function Analytics() {
  useEffect(() => start(), []);
  return null;
}
