# Solana Tip Jar

An open-source Next.js App Router project for receiving native SOL tips through
a Solana Action/Blink.

The project has two connected surfaces:

- A branded public tip-jar page where visitors connect a Wallet
  Standard-compatible Solana wallet and send a tip directly.
- A Solana Action API that creates the unsigned transfer transaction.

The public page requests an unsigned transaction from its own Action API,
checks that the returned transaction contains only the expected native SOL
transfer, and asks the connected wallet to sign and submit it. The server never
receives a private key and cannot sign on the sender's behalf.

Wallets are discovered through the Solana Wallet Standard. Phantom, Solflare,
Backpack, and other compatible wallets can connect without routing the visitor
through a third-party Blink interstitial.

## Action routes

- `GET /api/actions/tip` returns Blink metadata and tip options.
- `GET /api/actions/tip?amount=0.25` returns a single preselected tip action.
- `POST /api/actions/tip?amount=0.25` returns a signable SOL transaction.
- `OPTIONS /api/actions/tip` returns the required CORS response.
- `GET /actions.json` maps supported website paths to the Action API.

## Recipient wallet

The default recipient is:

```text
777ePKXhcxMdJPMA22YeiR6pdMUTadnpT7AUyto2Y24N
```

For production, set the Vercel environment variable:

```text
TIP_DESTINATION_ADDRESS=YOUR_SOLANA_WALLET_ADDRESS
```

You can also set:

```text
SOLANA_RPC_URL=https://your-mainnet-rpc.example
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-browser-safe-mainnet-rpc.example
```

`SOLANA_RPC_URL` is used by the server to build transactions.
`NEXT_PUBLIC_SOLANA_RPC_URL` is optional and is exposed to the browser for
sending and confirming transactions. If it is omitted, the app uses Solana's
public mainnet endpoint.

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Run the release checks with:

```bash
npm run typecheck
npm run build
```
