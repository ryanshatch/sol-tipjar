# Solana Tip Jar

An open-source Next.js App Router project for receiving native SOL tips through
a Solana Action/Blink.

The project has two connected surfaces:

- A branded public tip-jar page where visitors choose an amount.
- A Solana Action API that creates the unsigned transfer transaction.

The public page sends visitors to Dial to connect a compatible wallet, review
the exact destination and amount, sign, and submit. The server never receives a
private key and cannot sign on the sender's behalf.

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
NEXT_PUBLIC_SITE_URL=https://your-domain.example
SOLANA_RPC_URL=https://your-mainnet-rpc.example
```

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
