import type {
  ActionError,
  ActionGetResponse,
  ActionPostRequest,
  ActionPostResponse,
} from "@solana/actions";
import { createPostResponse } from "@solana/actions";
import { SystemProgram, Transaction } from "@solana/web3.js";
import {
  APP_DESCRIPTION,
  APP_TITLE,
  MIN_TIP_AMOUNT_SOL,
  PRESET_TIP_AMOUNTS_SOL,
} from "@/lib/constants";
import { actionHeaders } from "@/lib/action-headers";
import { getSolanaConnection } from "@/lib/solana";
import { buildActionUrl, getBaseUrlFromRequest } from "@/lib/urls";
import {
  getDestinationPublicKey,
  parseSenderPublicKey,
  parseTipAmount,
  solToLamports,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const origin = getBaseUrlFromRequest(request);
    const actionUrl = buildActionUrl(origin);
    const destination = getDestinationPublicKey();

    const payload: ActionGetResponse = {
      type: "action",
      title: APP_TITLE,
      icon: new URL("/icon.png", origin).toString(),
      description: `${APP_DESCRIPTION}\n\nTips go to: ${destination.toBase58()}`,
      label: "Send Tip",
      links: {
        actions: [
          ...PRESET_TIP_AMOUNTS_SOL.map((amount) => ({
            type: "post" as const,
            label: `Tip ${amount} SOL`,
            href: `${actionUrl}?amount=${amount}`,
          })),
          {
            type: "post" as const,
            label: "Custom SOL Tip",
            href: `${actionUrl}?amount={amount}`,
            parameters: [
              {
                name: "amount",
                label: `Amount in SOL, minimum ${MIN_TIP_AMOUNT_SOL}`,
                required: true,
                pattern: "^[0-9]+(\\.[0-9]{1,9})?$",
                patternDescription:
                  "Enter SOL amount with up to 9 decimal places.",
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, { headers: actionHeaders });
  } catch (error) {
    return actionErrorResponse(error);
  }
}

export async function OPTIONS() {
  return Response.json(null, { headers: actionHeaders });
}

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const amountSol = parseTipAmount(requestUrl.searchParams);
    const lamports = solToLamports(amountSol);
    const destination = getDestinationPublicKey();

    const body = (await request.json()) as ActionPostRequest;
    const sender = parseSenderPublicKey(body.account);

    const connection = getSolanaConnection();

    const destinationAccount = await connection.getAccountInfo(destination);

    if (!destinationAccount) {
      const minimumBalance = await connection.getMinimumBalanceForRentExemption(0);

      if (lamports < minimumBalance) {
        throw new Error(
          `The receiving account does not appear to exist yet. Send at least ${minimumBalance / 1_000_000_000} SOL to make it rent-exempt.`,
        );
      }
    }

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: destination,
      lamports,
    });

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");

    const transaction = new Transaction({
      feePayer: sender,
      blockhash,
      lastValidBlockHeight,
    }).add(transferInstruction);

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
        message: `Send ${amountSol} SOL to ${destination.toBase58()}. ${APP_DESCRIPTION}`,
      },
    });

    return Response.json(payload, { headers: actionHeaders });
  } catch (error) {
    return actionErrorResponse(error);
  }
}

function actionErrorResponse(error: unknown): Response {
  const payload: ActionError = {
    message:
      error instanceof Error ? error.message : "Unable to create Solana tip action.",
  };

  return Response.json(payload, {
    status: 400,
    headers: actionHeaders,
  });
}
