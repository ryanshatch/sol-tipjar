"use client";

import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

export function LinkBuilder() {
  // const [origin, setOrigin] = useState("https://your-project.vercel.app");
  const [origin, setOrigin] = useState("https://sol-tipjar.vercel.app/");

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      setOrigin(process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, ""));
      return;
    }

    setOrigin(window.location.origin);
  }, []);

  const actionUrl = useMemo(() => `${origin}/api/actions/tip`, [origin]);
  const solanaActionUri = useMemo(() => `solana-action:${actionUrl}`, [actionUrl]);
  const dialUrl = useMemo(
    () => `https://dial.to/?action=${encodeURIComponent(solanaActionUri)}`,
    [solanaActionUri],
  );

  return (
    <section className="card stack">
      <div>
        <p className="eyebrow">Share links</p>
        <h2>Blink links</h2>
        <p className="muted">
          After deploying, replace the placeholder domain automatically by visiting this
          page on your Vercel URL.
        </p>
      </div>

      <div className="linkBlock">
        <div>
          <p className="linkLabel">Raw Action URL</p>
          <code>{actionUrl}</code>
        </div>
        <CopyButton value={actionUrl} />
      </div>

      <div className="linkBlock">
        <div>
          <p className="linkLabel">Solana Action URI</p>
          <code>{solanaActionUri}</code>
        </div>
        <CopyButton value={solanaActionUri} />
      </div>

      <div className="linkBlock">
        <div>
          <p className="linkLabel">Dial wrapper URL</p>
          <code>{dialUrl}</code>
        </div>
        <CopyButton value={dialUrl} />
      </div>

      <a className="primaryButton" href={dialUrl} target="_blank" rel="noreferrer">
        Open in Dial
      </a>
    </section>
  );
}
