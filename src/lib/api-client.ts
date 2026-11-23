/**
 * Safely fetches an API route across desktop, mobile, and server environments.
 *
 * Rules:
 * 1. If running in a browser on a remote/production domain (e.g. pizzahub-azure.vercel.app or mobile devices),
 *    never attempt http://localhost:5000 (prevents Mixed Content, Private Network Access blocks, and ERR_CONNECTION_REFUSED).
 * 2. If NEXT_PUBLIC_API_URL is set to a real remote server (e.g. on Render/Railway), it attempts it with a safe try/catch.
 * 3. If running locally on localhost/127.0.0.1 and NEXT_PUBLIC_API_URL is configured, it attempts it with a safe try/catch.
 * 4. In all other cases (or if the custom URL fails/throws), it falls back to the internal Next.js App Router API route (/api/...).
 */
export async function safeFetchApi(path: string, init?: RequestInit): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const customUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  // If a remote production backend is provided (not localhost):
  if (customUrl && !customUrl.includes("localhost") && !customUrl.includes("127.0.0.1")) {
    try {
      const res = await fetch(`${customUrl}${normalizedPath}`, init);
      if (res.ok) return res;
    } catch {
      // Remote server unreachable, gracefully fallback to Next.js route
    }
  }

  // If developing locally on a PC where Express may be running on localhost:
  if (
    customUrl &&
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
  ) {
    try {
      const res = await fetch(`${customUrl}${normalizedPath}`, init);
      if (res.ok) return res;
    } catch {
      // Local express offline, gracefully fallback to Next.js route
    }
  }

  // Default to internal Next.js App Router API route (always reliable on Vercel)
  return fetch(normalizedPath, init);
}
