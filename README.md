# Solana Tip Jar

I delveloped this as an alternative since solscan is no longer hosting their Solana tipping action/blink.<br>This project is meant to replace it and be an open source and a complete Next.js App Router project that hosts a Solana Action/Blink for receiving native SOL tips.

The Action endpoint exposes:

- `GET /api/actions/tip` — returns Blink metadata and tip buttons
- `POST /api/actions/tip?amount=0.01` — returns a signable SOL transfer transaction
- `OPTIONS /api/actions/tip` — returns the required CORS response for Blink clients
- `GET /actions.json` — maps supported website paths to Action API paths

## Recipient wallet

Default recipient:

```txt
777ePKXhcxMdJPMA22YeiR6pdMUTadnpT7AUyto2Y24N
```

To change it, you will either need to edit `lib/constants.ts` or set it as an environment variable:

```txt
TIP_DESTINATION_ADDRESS=YOUR_SOLANA_WALLET_ADDRESS
```

## Local development

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

Test the metadata endpoint:

```bash
curl -i http://localhost:3000/api/actions/tip
```

Test a POST transaction response using any valid sender public key:

```bash
curl -X POST 'http://localhost:3000/api/actions/tip?amount=0.01' \
  -H 'Content-Type: application/json' \
  -d '{"account":"7KFnSPTQe5xYwYyQpCCvD6KJ1yk1xMsbJwtyPaUVxYf3"}'
```

That POST response should include a base64-encoded transaction. A wallet/client signs and submits it; the server does not hold private keys.

<hr>

## Notes

- Its always a good idea to utilize a real mainnet RPC provider, especially for production, as the public RPC can rate-limit.
- If the destination wallet has never existed on-chain and the user sends a very tiny amount, the transaction may fail because the recipient account must become rent-exempt. The code checks this and returns a clear error.
