import { LinkBuilder } from "@/components/LinkBuilder";
import {
  APP_DESCRIPTION,
  APP_TITLE,
  DEFAULT_DESTINATION_ADDRESS,
  MAX_TIP_AMOUNT_SOL,
  MIN_TIP_AMOUNT_SOL,
  PRESET_TIP_AMOUNTS_SOL,
} from "@/lib/constants";

export default function HomePage() {
  const destination =
    process.env.TIP_DESTINATION_ADDRESS?.trim() || DEFAULT_DESTINATION_ADDRESS;

  return (
    <main className="pageShell">
      <section className="hero">
        <p className="eyebrow">Vercel Solana Action</p>
        <h1>{APP_TITLE}</h1>
        <p className="heroText">{APP_DESCRIPTION}</p>
      </section>

      <section className="grid">
        <section className="card stack">
          <div>
            <p className="eyebrow">Recipient</p>
            <h2>Tip destination</h2>
          </div>
          <code className="walletCode">{destination}</code>
          <p className="muted">
            Change this in <code>lib/constants.ts</code> or set the Vercel environment
            variable <code>TIP_DESTINATION_ADDRESS</code>.
          </p>
        </section>

        <section className="card stack">
          <div>
            <p className="eyebrow">Amounts</p>
            <h2>Configured options</h2>
          </div>
          <div className="pillRow">
            {PRESET_TIP_AMOUNTS_SOL.map((amount) => (
              <span className="pill" key={amount}>
                {amount} SOL
              </span>
            ))}
          </div>
          <p className="muted">
            Custom tips are allowed from {MIN_TIP_AMOUNT_SOL} SOL to {MAX_TIP_AMOUNT_SOL} SOL.
          </p>
        </section>
      </section>

      <LinkBuilder />

      <section className="card stack">
        <p className="eyebrow">Endpoints</p>
        <h2>Production routes</h2>
        <div className="endpointList">
          <code>GET /api/actions/tip</code>
          <code>POST /api/actions/tip?amount=0.25</code>
          <code>OPTIONS /api/actions/tip</code>
          <code>GET /actions.json</code>
        </div>
      </section>
    </main>
  );
}
