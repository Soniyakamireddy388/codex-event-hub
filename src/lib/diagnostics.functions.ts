import { createServerFn } from "@tanstack/react-start";

import { buildDiagnosticsReport } from "./diagnostics.server";

export const getDiagnostics = createServerFn({ method: "GET" }).handler(async () => {
  return buildDiagnosticsReport();
});
