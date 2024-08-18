import { createRouteHandler } from "uploadthing/next";

import { FileRoute } from "./core";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: FileRoute,

  // Apply an (optional) custom config:
  // config: { ... },
});
