import { TipComposer } from "@/components/TipComposer";
import {
  DEFAULT_DESTINATION_ADDRESS,
  MAX_TIP_AMOUNT_SOL,
  MIN_TIP_AMOUNT_SOL,
  PRESET_TIP_AMOUNTS_SOL,
} from "@/lib/constants";

function SolanaMark() {
  return (
    <span className="solanaMark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20">
      <path d="M6 14 14 6m-6 0h6v6" />
    </svg>
  );
}

export default function HomePage() {
  const destination =
    process.env.TIP_DESTINATION_ADDRESS?.trim() ||
    DEFAULT_DESTINATION_ADDRESS;

  return (
    <main className="pageShell">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />

      <header className="siteHeader">
        <a className="brand" href="#top" aria-label="SOL Tip Jar home">
          <SolanaMark />
          <span>SOL TIPJAR</span>
        </a>

        <a
          className="headerLink"
          href="https://github.com/ryanshatch/sol-tipjar"
          target="_blank"
          rel="noreferrer"
        >
          View source
          <ArrowIcon />
        </a>
      </header>

      <section className="heroGrid" id="top">
        <div className="heroCopy">
          <p className="eyebrow">
            <span className="liveDot" />
            Open on Solana mainnet
          </p>
          <h1>
            Support the work,
            <span>straight on-chain.</span>
          </h1>
          <p className="heroText">
            Send a SOL tip in a few clicks. Choose an amount, review the
            transaction in your wallet, and you&apos;re done.
          </p>

          <div className="trustRow" aria-label="Tip jar features">
            <span>No account</span>
            <span>No custody</span>
            <span>On-chain receipt</span>
          </div>
        </div>

        <TipComposer
          destination={destination}
          minAmount={MIN_TIP_AMOUNT_SOL}
          maxAmount={MAX_TIP_AMOUNT_SOL}
          presets={[...PRESET_TIP_AMOUNTS_SOL]}
        />
      </section>

      <section className="processSection" aria-labelledby="how-it-works">
        <div className="sectionHeading">
          <p className="eyebrow">Simple by design</p>
          <h2 id="how-it-works">From your wallet to mine.</h2>
        </div>

        <div className="stepGrid">
          <article className="stepCard">
            <span className="stepNumber">01</span>
            <h3>Choose a tip</h3>
            <p>Select a preset or enter any supported SOL amount.</p>
          </article>
          <article className="stepCard">
            <span className="stepNumber">02</span>
            <h3>Review it</h3>
            <p>Your wallet shows the amount and destination before approval.</p>
          </article>
          <article className="stepCard">
            <span className="stepNumber">03</span>
            <h3>Send on-chain</h3>
            <p>The signed transaction is submitted directly to Solana.</p>
          </article>
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerBrand">
          <SolanaMark />
          <span>Independent, open-source tipping on Solana.</span>
        </div>
        <p>Private keys never touch this site.</p>
      </footer>
    </main>
  );
}
