"use client";

import { useEffect } from "react";

// The vendor runtime walks the DOM on load and tags every matching element
// with `data-ux4g-init="true"` (see ux4g-web-components/dist/runtime/design-system.mjs).
// If that import runs eagerly (module scope), its DOM mutations can race with
// React's hydration pass and trigger hydration-mismatch warnings on pages with
// many icons. Deferring the import to a post-mount effect ensures it only runs
// after hydration has committed.
export function Ux4gRuntime() {
  useEffect(() => {
    import("ux4g-web-components/design-system");
  }, []);

  return null;
}
