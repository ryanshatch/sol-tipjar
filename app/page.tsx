import Image from "next/image";
import { TipComposer } from "@/components/TipComposer";
import {
  DEFAULT_DESTINATION_ADDRESS,
  MAX_TIP_AMOUNT_SOL,
  MIN_TIP_AMOUNT_SOL,
  PRESET_TIP_AMOUNTS_SOL,
} from "@/lib/constants";

function SolanaMark() {
  return (
    <Image
      className="brandMark"
      aria-hidden="true"
      src="/triage-mark.png"
      alt=""
      width={32}
      height={32}
      priority
    />
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
          <span>Tip with SOL</span>
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
             Live on mainnet ◎
          </p>

          <h1>
            Support my work,
            <span>on Solana.</span>
          </h1>

          <p className="heroText">
            Tip with SOL. Choose an amount, review the transaction, confirm, done.
          </p>

          <div className="trustRow" aria-label="Tip jar features">
            <span>No account required</span>
            <span>Non-custodial</span>
            <span>On-chain confirmation</span>
            <span>Peer-to-peer</span>
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
          <p className="eyebrow">Built to be simple</p>
          <h2 id="how-it-works">Direct wallet to wallet.</h2>
        </div>

        <div className="stepGrid">
          <article className="stepCard">
            <span className="stepNumber">01</span>
            <h3>Choose your tip</h3>
            <p>Select a preset or enter an amount.</p>
          </article>

          <article className="stepCard">
            <span className="stepNumber">02</span>
            <h3>Review the details</h3>
            <p>
              Confirm the amount and destination before
              approving the transaction.
            </p>
          </article>

          <article className="stepCard">
            <span className="stepNumber">03</span>
            <h3>Send on-chain</h3>
            <p>
              After confirming, your wallet sends it on-chain to Solana.
            </p>
          </article>
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerBrand">
          <SolanaMark />
          <span>Independent, open-source tipping built on Solana.</span>
        </div>

        <p>
          <strong>Simply Secured. Your private keys never leave your wallet. Copyright (c) 2026 Ryan Hatch.</strong>
        </p>
      </footer>
    </main>
  );
}
