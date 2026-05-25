type FetchInit = NonNullable<Parameters<typeof fetch>[1]>;

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrf_public=([^;]*)/);
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

const MUTATING = new Set(["POST", "PUT", "DELETE", "PATCH"]);

export async function adminFetch(
  input: string,
  init: FetchInit = {},
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  if (!MUTATING.has(method)) return fetch(input, init);

  const headers = new Headers(init.headers);
  headers.set("x-csrf-token", getCsrfToken());

  return fetch(input, { ...init, headers });
}
