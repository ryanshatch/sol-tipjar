"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemInstruction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { CopyButton } from "@/components/CopyButton";

type TipComposerProps = {
  destination: string;
  minAmount: number;
  maxAmount: number;
  presets: number[];
};

type TipStage =
  | "idle"
  | "preparing"
  | "signing"
  | "confirming"
  | "success"
  | "error";

type TipStatus = {
  stage: TipStage;
  message?: string;
  signature?: string;
};

type ActionResponse = {
  transaction?: unknown;
  message?: unknown;
};

export function TipComposer({
  destination,
  minAmount,
  maxAmount,
  presets,
}: TipComposerProps) {
  const [amount, setAmount] = useState(String(presets[0] ?? minAmount));
  const [tipStatus, setTipStatus] = useState<TipStatus>({ stage: "idle" });
  const { connection } = useConnection();
  const {
    connected,
    connecting,
    disconnect,
    disconnecting,
    publicKey,
    sendTransaction,
    wallet,
  } = useWallet();
  const { setVisible } = useWalletModal();

  const numericAmount = Number(amount);
  const hasValidFormat = /^(?:0|[1-9]\d*)(?:\.\d{1,9})?$/.test(amount);
  const isValid =
    hasValidFormat &&
    Number.isFinite(numericAmount) &&
    numericAmount >= minAmount &&
    numericAmount <= maxAmount;

  const shortDestination = `${destination.slice(0, 7)}…${destination.slice(
    -7,
  )}`;
  const walletAddress = publicKey?.toBase58() ?? "";
  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 5)}…${walletAddress.slice(-5)}`
    : "Not connected";
  const isBusy =
    tipStatus.stage === "preparing" ||
    tipStatus.stage === "signing" ||
    tipStatus.stage === "confirming";
  const controlsDisabled = isBusy || connecting || disconnecting;

  function updateAmount(nextAmount: string) {
    setAmount(nextAmount);

    if (tipStatus.stage === "success" || tipStatus.stage === "error") {
      setTipStatus({ stage: "idle" });
    }
  }

  async function handleWalletControl() {
    if (controlsDisabled) {
      return;
    }

    if (!connected) {
      setVisible(true);
      return;
    }

    try {
      await disconnect();
      setTipStatus({ stage: "idle" });
    } catch (error) {
      setTipStatus({
        stage: "error",
        message: getFriendlyErrorMessage(error),
      });
    }
  }

  async function handleTip() {
    if (!isValid || controlsDisabled) {
      return;
    }

    if (!connected || !publicKey) {
      setVisible(true);
      return;
    }

    let submittedSignature: string | undefined;

    try {
      setTipStatus({
        stage: "preparing",
        message: "Preparing your transaction…",
      });

      const response = await fetch(
        `/api/actions/tip?amount=${encodeURIComponent(amount)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ account: publicKey.toBase58() }),
        },
      );
      const payload = (await response
        .json()
        .catch(() => null)) as ActionResponse | null;

      if (!response.ok) {
        throw new Error(
          typeof payload?.message === "string"
            ? payload.message
            : "The tip transaction could not be prepared.",
        );
      }

      if (typeof payload?.transaction !== "string") {
        throw new Error("The server returned an invalid tip transaction.");
      }

      const transaction = Transaction.from(
        decodeBase64(payload.transaction),
      );
      validateTipTransaction(
        transaction,
        publicKey,
        destination,
        numericAmount,
      );

      setTipStatus({
        stage: "signing",
        message: "Review and approve the transaction in your wallet.",
      });

      const signature = await sendTransaction(transaction, connection, {
        maxRetries: 3,
        preflightCommitment: "confirmed",
      });
      submittedSignature = signature;

      setTipStatus({
        stage: "confirming",
        message: "Transaction sent. Waiting for confirmation…",
        signature,
      });

      const confirmation = await connection.confirmTransaction(
        signature,
        "confirmed",
      );

      if (confirmation.value.err) {
        throw new Error("Solana rejected the transaction.");
      }

      setTipStatus({
        stage: "success",
        message:
          typeof payload.message === "string"
            ? payload.message
            : `Your ${amount} SOL tip was confirmed.`,
        signature,
      });
    } catch (error) {
      setTipStatus({
        stage: "error",
        message: getFriendlyErrorMessage(error),
        signature: submittedSignature,
      });
    }
  }

  const tipButtonLabel = !isValid
    ? "Enter a valid amount"
    : connecting
      ? "Connecting wallet…"
      : disconnecting
        ? "Disconnecting wallet…"
        : tipStatus.stage === "preparing"
          ? "Preparing transaction…"
          : tipStatus.stage === "signing"
            ? "Approve in your wallet…"
            : tipStatus.stage === "confirming"
              ? "Confirming on Solana…"
              : connected
                ? `Tip ${amount} SOL`
                : "Connect wallet to tip";

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
              disabled={controlsDisabled}
              onClick={() => updateAmount(presetValue)}
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
            disabled={controlsDisabled}
            value={amount}
            onChange={(event) => updateAmount(event.target.value.trim())}
          />
          <strong>SOL</strong>
        </span>
      </label>

      <p className={`amountHelp${isValid ? "" : " error"}`} id="amount-help">
        {isValid
          ? `Allowed range: ${minAmount}–${maxAmount} SOL`
          : `Enter an amount from ${minAmount} to ${maxAmount} SOL.`}
      </p>

      <div className={`walletRow${connected ? " connected" : ""}`}>
        <div className="walletIdentity">
          <span>Wallet</span>
          <code title={walletAddress || undefined}>
            {connected && wallet
              ? `${wallet.adapter.name} · ${shortWallet}`
              : shortWallet}
          </code>
        </div>
        <button
          className="walletControl"
          type="button"
          disabled={controlsDisabled}
          onClick={handleWalletControl}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
      </div>

      <button
        className="tipButton"
        type="button"
        disabled={!isValid || controlsDisabled}
        onClick={handleTip}
      >
        {isBusy && <span className="buttonSpinner" aria-hidden="true" />}
        {tipButtonLabel}
        {!isBusy && isValid && (
          <svg aria-hidden="true" viewBox="0 0 20 20">
            <path d="m7 5 5 5-5 5" />
          </svg>
        )}
      </button>

      {tipStatus.stage !== "idle" && tipStatus.message && (
        <div
          className={`tipStatus ${tipStatus.stage}`}
          role={tipStatus.stage === "error" ? "alert" : "status"}
        >
          <span className="statusIcon" aria-hidden="true" />
          <div>
            <strong>
              {tipStatus.stage === "success"
                ? "Tip confirmed"
                : tipStatus.stage === "error"
                  ? tipStatus.signature
                    ? "Confirmation issue"
                    : "Tip not sent"
                  : "Transaction in progress"}
            </strong>
            <p>{tipStatus.message}</p>
            {tipStatus.signature && (
              <a
                href={`https://explorer.solana.com/tx/${tipStatus.signature}?cluster=mainnet-beta`}
                target="_blank"
                rel="noreferrer"
              >
                View on Solana Explorer
              </a>
            )}
          </div>
        </div>
      )}

      <div className="recipientRow">
        <div>
          <span>Recipient</span>
          <code title={destination}>{shortDestination}</code>
        </div>
        <CopyButton value={destination} label="Copy" />
      </div>
    </aside>
  );
}

function decodeBase64(value: string): Uint8Array {
  try {
    const binary = window.atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  } catch {
    throw new Error("The server returned an unreadable tip transaction.");
  }
}

function validateTipTransaction(
  transaction: Transaction,
  sender: PublicKey,
  destination: string,
  amountSol: number,
) {
  if (!transaction.feePayer?.equals(sender)) {
    throw new Error("The transaction fee payer does not match your wallet.");
  }

  if (transaction.instructions.length !== 1) {
    throw new Error("The transaction contains unexpected instructions.");
  }

  const instruction = transaction.instructions[0];

  if (!instruction.programId.equals(SystemProgram.programId)) {
    throw new Error("The transaction is not a native SOL transfer.");
  }

  let transfer: ReturnType<typeof SystemInstruction.decodeTransfer>;

  try {
    transfer = SystemInstruction.decodeTransfer(instruction);
  } catch {
    throw new Error("The transaction contains an invalid SOL transfer.");
  }

  const expectedDestination = new PublicKey(destination);
  const expectedLamports = BigInt(Math.round(amountSol * LAMPORTS_PER_SOL));

  if (
    !transfer.fromPubkey.equals(sender) ||
    !transfer.toPubkey.equals(expectedDestination) ||
    BigInt(transfer.lamports) !== expectedLamports
  ) {
    throw new Error(
      "The transaction details do not match the selected tip.",
    );
  }
}

function getFriendlyErrorMessage(error: unknown): string {
  const message =
    error instanceof Error ? error.message : "The tip could not be sent.";

  if (/user rejected|rejected the request|declined|cancelled/i.test(message)) {
    return "The transaction was cancelled in your wallet.";
  }

  if (
    /insufficient|attempt to debit an account but found no record/i.test(
      message,
    )
  ) {
    return "The connected wallet does not have enough SOL for the tip and network fee.";
  }

  if (/blockhash not found|expired/i.test(message)) {
    return "The transaction expired before confirmation. Please try again.";
  }

  if (/failed to fetch|network request failed|networkerror/i.test(message)) {
    return "The Solana network could not be reached. Please try again.";
  }

  return message;
}
