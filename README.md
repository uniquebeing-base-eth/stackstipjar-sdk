# stx-tip-jar-sdk

TypeScript SDK for sending **STX tips** and fetching balances on the [Stacks](https://www.stacks.co/) blockchain.

Built on top of [`@stacks/transactions`](https://www.npmjs.com/package/@stacks/transactions) and [`@stacks/network`](https://www.npmjs.com/package/@stacks/network), exposed as a small, framework-agnostic API.

Repository: https://github.com/uniquebeing-base-eth/stackstipjar-sdk

## Installation

```bash
npm install stx-tip-jar-sdk
```

## Quick start

```ts
import { sendTip, getBalance } from "stx-tip-jar-sdk";

// Fetch a balance (defaults to mainnet)
const balance = await getBalance("SP2J6ZY48GV1EZ5V2V5RB9MP66SW...");
console.log(balance.stx, "STX");

// Send a 0.1 STX tip
const { txId } = await sendTip({
  recipient: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW...",
  amount: 0.1,
  senderKey: process.env.STX_PRIVATE_KEY!,
  network: "mainnet",
});
console.log("Broadcasted:", txId);
```

## API

### `getBalance(address, options?)`

| Param              | Type                       | Description                          |
| ------------------ | -------------------------- | ------------------------------------ |
| `address`          | `string`                   | Stacks wallet address                |
| `options.network`  | `"mainnet"` \| `"testnet"` | Defaults to `"mainnet"`              |
| `options.apiUrl`   | `string`                   | Optional custom Stacks API base URL  |

Returns `{ address, microStx, stx }`.

### `sendTip(options)`

| Param       | Type                       | Description                            |
| ----------- | -------------------------- | -------------------------------------- |
| `recipient` | `string`                   | Recipient Stacks address               |
| `amount`    | `number \| string`         | Amount in STX (e.g. `0.1`)             |
| `senderKey` | `string`                   | Hex-encoded sender private key         |
| `network`   | `"mainnet"` \| `"testnet"` | Defaults to `"mainnet"`                |
| `memo`      | `string?`                  | Optional memo (max 34 bytes)           |
| `fee`       | `bigint \| number?`        | Optional fee override (microSTX)       |
| `nonce`     | `bigint \| number?`        | Optional nonce override                |

Returns `{ txId, raw }`.

### Constants

- `STX_DECIMALS` — `6`
- `MICRO_STX_PER_STX` — `1_000_000`
- `STACKS_API_URLS` — default Hiro API URLs by network
- `stxToMicroStx(amount)` / `microStxToStx(microAmount)` — unit helpers

## Build

```bash
npm install
npm run build
```

## Publish

```bash
npm login
npm publish --access public
```

## License

MIT