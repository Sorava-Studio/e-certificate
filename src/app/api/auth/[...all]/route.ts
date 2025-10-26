import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth"; // path to your auth file

// Wrap the Better Auth handlers to ensure CORS headers are returned
const { POST: _POST, GET: _GET } = toNextJsHandler(auth);

const defaultCorsHeaders = {
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function attachCorsHeaders(response: Response, origin: string | null) {
  const headers = new Headers(response.headers);
  // Use request origin when available (more secure than '*')
  headers.set("Access-Control-Allow-Origin", origin ?? "*");
  for (const [k, v] of Object.entries(defaultCorsHeaders)) {
    headers.set(k, v as string);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const OPTIONS = (request: Request) => {
  const origin = request.headers.get("origin");
  const headers = new Headers({ ...defaultCorsHeaders });
  headers.set("Access-Control-Allow-Origin", origin ?? "*");
  return new Response(null, { status: 204, headers });
};

export const POST = async (request: Request) => {
  const origin = request.headers.get("origin");
  const res = await _POST(request);
  return attachCorsHeaders(res, origin);
};

export const GET = async (request: Request) => {
  const origin = request.headers.get("origin");
  const res = await _GET(request);
  return attachCorsHeaders(res, origin);
};
