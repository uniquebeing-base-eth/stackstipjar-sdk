import {
  AnchorMode,
  broadcastTransaction,
  makeSTXTokenTransfer,
  TxBroadcastResult,
} from "@stacks/transactions";
import { StacksMainnet, StacksTestnet } from "@stacks/network";
import { StacksNetworkName, stxToMicroStx } from "./constants";

export interface SendTipOptions {
  /** Recipient Stacks address (e.g. "SP..." or "ST..."). */
  recipient: string;
  /** Amount of STX to tip (e.g. 0.1). */
  amount: number | string;
  /** Sender's private key (hex string). */
  senderKey: string;
  /** Network to broadcast on. Defaults to "mainnet". */
  network?: StacksNetworkName;
  /** Optional memo to attach to the transfer (max 34 bytes). */
  memo?: string;
  /** Optional fee in microSTX. If omitted, the network estimates it. */
  fee?: bigint | number;
  /** Optional explicit nonce. */
  nonce?: bigint | number;
}

export interface SendTipResult {
  /** Broadcasted transaction ID. */
  txId: string;
  /** Raw broadcast result from the Stacks node. */
  raw: TxBroadcastResult;
}

/**
 * Build, sign, and broadcast a STX transfer (a "tip") on the Stacks blockchain.
 */
export async function sendTip(options: SendTipOptions): Promise<SendTipResult> {
  const {
    recipient,
    amount,
    senderKey,
    network = "mainnet",
    memo,
    fee,
    nonce,
  } = options;

  if (!recipient) throw new Error("sendTip: 'recipient' is required");
  if (amount === undefined || amount === null)
    throw new Error("sendTip: 'amount' is required");
  if (!senderKey) throw new Error("sendTip: 'senderKey' is required");

  const stacksNetwork =
    network === "testnet" ? new StacksTestnet() : new StacksMainnet();

  const microAmount = stxToMicroStx(amount);

  try {
    const transaction = await makeSTXTokenTransfer({
      recipient,
      amount: microAmount,
      senderKey,
      network: stacksNetwork,
      memo,
      anchorMode: AnchorMode.Any,
      ...(fee !== undefined ? { fee: BigInt(fee) } : {}),
      ...(nonce !== undefined ? { nonce: BigInt(nonce) } : {}),
    });

    const result = await broadcastTransaction(transaction, stacksNetwork);

    if ("error" in result && result.error) {
      throw new Error(
        `sendTip: broadcast failed: ${result.error} - ${result.reason ?? ""}`
      );
    }

    return {
      txId: (result as { txid: string }).txid,
      raw: result,
    };
  } catch (err) {
    throw new Error(`sendTip: ${(err as Error).message}`);
  }
}