export function getBaseUrlFromRequest(request: Request): string {
  const url = new URL(request.url);
  return url.origin;
}

export function buildActionUrl(origin: string): string {
  return new URL("/api/actions/tip", origin).toString();
}
