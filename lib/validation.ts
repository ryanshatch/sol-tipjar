import { PublicKey } from "@solana/web3.js";
import {
  DEFAULT_DESTINATION_ADDRESS,
  DEFAULT_TIP_AMOUNT_SOL,
  MAX_TIP_AMOUNT_SOL,
  MIN_TIP_AMOUNT_SOL,
} from "@/lib/constants";

export function getDestinationPublicKey(): PublicKey {
  const destination =
    process.env.TIP_DESTINATION_ADDRESS?.trim() || DEFAULT_DESTINATION_ADDRESS;

  try {
    return new PublicKey(destination);
  } catch {
    throw new Error("Server misconfiguration: TIP_DESTINATION_ADDRESS is not a valid Solana public key.");
  }
}

export function parseSenderPublicKey(value: unknown): PublicKey {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error('Invalid request body: expected { "account": "<wallet public key>" }.');
  }

  try {
    return new PublicKey(value);
  } catch {
    throw new Error("Invalid account: the provided wallet public key is not valid.");
  }
}

export function parseTipAmount(searchParams: URLSearchParams): number {
  const rawAmount = searchParams.get("amount");

  if (rawAmount === null || rawAmount.trim() === "") {
    return DEFAULT_TIP_AMOUNT_SOL;
  }

  const amount = Number(rawAmount);

  if (!Number.isFinite(amount)) {
    throw new Error("Invalid amount: amount must be a number.");
  }

  if (amount < MIN_TIP_AMOUNT_SOL) {
    throw new Error(`Invalid amount: minimum tip is ${MIN_TIP_AMOUNT_SOL} SOL.`);
  }

  if (amount > MAX_TIP_AMOUNT_SOL) {
    throw new Error(`Invalid amount: maximum tip is ${MAX_TIP_AMOUNT_SOL} SOL.`);
  }

  return amount;
}

export function solToLamports(amountSol: number): number {
  const lamports = Math.round(amountSol * 1_000_000_000);

  if (!Number.isSafeInteger(lamports) || lamports <= 0) {
    throw new Error("Invalid amount: could not convert SOL amount into lamports safely.");
  }

  return lamports;
}
