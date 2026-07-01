import { clusterApiUrl, Connection } from "@solana/web3.js";
import { DEFAULT_SOLANA_CLUSTER } from "@/lib/constants";

export function getSolanaConnection(): Connection {
  const endpoint =
    process.env.SOLANA_RPC_URL?.trim() || clusterApiUrl(DEFAULT_SOLANA_CLUSTER);

  return new Connection(endpoint, "confirmed");
}
