import { createActionHeaders } from "@solana/actions";

// Standard Solana Actions headers, including the required CORS headers for Blinks.
export const actionHeaders = createActionHeaders();

export const jsonHeaders = {
  ...actionHeaders,
  "Content-Type": "application/json",
};
