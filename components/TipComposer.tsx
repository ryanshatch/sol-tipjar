"use client";

import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

type TipComposerProps = {
  destination: string;
  minAmount: number;
  maxAmount: number;
  presets: number[];
};

export function TipComposer({
  destination,
  minAmount,
  maxAmount,
  presets,
}: TipComposerProps) {
  const [origin, setOrigin] = useState("https://sol-tipjar.vercel.app");
  const [amount, setAmount] = useState(String(presets[0] ?? minAmount));

  useEffect(() => {
    const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    setOrigin(
      configuredOrigin
        ? configuredOrigin.replace(/\/$/, "")
        : window.location.origin,
    );
  }, []);

  const numericAmount = Number(amount);
  const hasValidFormat = /^(?:0|[1-9]\d*)(?:\.\d{1,9})?$/.test(amount);
  const isValid =
    hasValidFormat &&
    Number.isFinite(numericAmount) &&
    numericAmount >= minAmount &&
    numericAmount <= maxAmount;

  const actionUrl = `${origin}/api/actions/tip?amount=${encodeURIComponent(
    amount,
  )}`;
  const actionUri = `solana-action:${actionUrl}`;
  const dialUrl = isValid
    ? `https://dial.to/?action=${encodeURIComponent(actionUri)}`
    : "";

  const shortDestination = `${destination.slice(0, 7)}…${destination.slice(
    -7,
  )}`;

  return (
    <aside className="tipCard" aria-labelledby="tip-card-title">
      <div className="tipCardTop">
        <div>
          <p className="cardKicker">Send a tip</p>
          <h2 id="tip-card-title">Choose an amount</h2>
        </div>
        <span className="networkBadge">
          <span />
          Mainnet
        </span>
      </div>

      <div className="presetGrid">
        {presets.map((preset) => {
          const presetValue = String(preset);
          const isSelected = amount === presetValue;

          return (
            <button
              className={`presetButton${isSelected ? " selected" : ""}`}
              key={preset}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setAmount(presetValue)}
            >
              <strong>{preset}</strong>
              <span>SOL</span>
            </button>
          );
        })}
      </div>

      <label className="amountField">
        <span>Custom amount</span>
        <span className="inputShell">
          <input
            inputMode="decimal"
            aria-describedby="amount-help"
            aria-invalid={!isValid}
            value={amount}
            onChange={(event) => setAmount(event.target.value.trim())}
          />
          <strong>SOL</strong>
        </span>
      </label>

      <p className={`amountHelp${isValid ? "" : " error"}`} id="amount-help">
        {isValid
          ? `Allowed range: ${minAmount}–${maxAmount} SOL`
          : `Enter an amount from ${minAmount} to ${maxAmount} SOL.`}
      </p>

      {isValid ? (
        <a
          className="tipButton"
          href={dialUrl}
          target="_blank"
          rel="noreferrer"
        >
          Tip {amount} SOL
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="m7 5 5 5-5 5" />
          </svg>
        </a>
      ) : (
        <button className="tipButton" type="button" disabled>
          Enter a valid amount
        </button>
      )}

      <div className="recipientRow">
        <div>
          <span>Recipient</span>
          <code title={destination}>{shortDestination}</code>
        </div>
        <CopyButton value={destination} label="Copy" />
      </div>

      <p className="walletNote">
        Opens a Solana Action in Dial. You approve the final transaction in
        your own wallet.
      </p>
    </aside>
  );
}
