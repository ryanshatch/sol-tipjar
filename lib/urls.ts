export function getBaseUrlFromRequest(request: Request): string {
  const url = new URL(request.url);
  return url.origin;
}

export function getConfiguredSiteUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) {
    return null;
  }

  return configured.replace(/\/$/, "");
}

export function buildActionUrl(origin: string): string {
  return new URL("/api/actions/tip", origin).toString();
}

export function buildSolanaActionUri(actionUrl: string): string {
  return `solana-action:${actionUrl}`;
}

export function buildDialUrl(actionUrl: string): string {
  return `https://dial.to/?action=${encodeURIComponent(buildSolanaActionUri(actionUrl))}`;
}
