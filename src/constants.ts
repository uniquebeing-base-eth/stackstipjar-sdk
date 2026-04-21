/**
 * Numbers of decimals used by STX (1 STX = 1,000,000 microSTX).
 */
export const STX_DECIMALS = 6;

/**
 * Multiplier to convert between STX and microSTX.
 */
export const MICRO_STX_PER_STX = 10 ** STX_DECIMALS;

/**
 * Supported Stacks networks.
 */
export type StacksNetworkName = "mainnet" | "testnet";

/**
 * Default Hiro Stacks API base URLs by network.
 */
export const STACKS_API_URLS: Record<StacksNetworkName, string> = {
  mainnet: "https://api.mainnet.hiro.so",
  testnet: "https://api.testnet.hiro.so",
};

/**
 * Convert a STX amount (decimal) to microSTX (integer bigint).
 */
export function stxToMicroStx(amount: number | string): bigint {
  const value = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`Invalid STX amount: ${amount}`);
  }
  return BigInt(Math.round(value * MICRO_STX_PER_STX));
}

/**
 * Convert microSTX (integer) to a human-readable STX number.
 */
export function microStxToStx(microStx: bigint | number | string): number {
  const value = typeof microStx === "bigint" ? Number(microStx) : Number(microStx);
  return value / MICRO_STX_PER_STX;
}
