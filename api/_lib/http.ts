/**
 * Minimal structural types for the Vercel Node runtime.
 *
 * Deliberately hand-written rather than importing @vercel/node: that package
 * is a dev-only type dependency, but it pulls in path-to-regexp and an old
 * esbuild carrying published advisories. Nothing here ships to the client, and
 * these few fields are all the handlers actually use.
 */
export interface ApiRequest {
  method?: string;
  body?: Record<string, unknown>;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): ApiResponse;
}
