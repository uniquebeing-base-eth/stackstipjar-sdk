import { STACKS_API_URLS, StacksNetworkName, microStxToStx } from "./constants";

export interface GetBalanceOptions {
  /** Network to query. Defaults to "mainnet". */
  network?: StacksNetworkName;
  /** Optional custom Stacks API base URL (overrides network default). */
  apiUrl?: string;
}

export interface BalanceResult {
  /** Wallet address queried. */
  address: string;
  /** Balance in microSTX (raw, as string to avoid precision loss). */
  microStx: string;
  /** Balance formatted in STX. */
  stx: number;
}

/**
 * Fetch the STX balance for a given Stacks wallet address.
 */
export async function getBalance(
  address: string,
  options: GetBalanceOptions = {}
): Promise<BalanceResult> {
  if (!address || typeof address !== "string") {
    throw new Error("getBalance: a valid Stacks address is required");
  }

  const network: StacksNetworkName = options.network ?? "mainnet";
  const baseUrl = options.apiUrl ?? STACKS_API_URLS[network];
  const url = `${baseUrl}/extended/v1/address/${address}/stx`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new Error(
      `getBalance: network request failed: ${(err as Error).message}`
    );
  }

  if (!response.ok) {
    throw new Error(
      `getBalance: API request failed (${response.status} ${response.statusText})`
    );
  }

  const data = (await response.json()) as { balance?: string };
  const microStx = data.balance ?? "0";

  return {
    address,
    microStx,
    stx: microStxToStx(microStx),
  };
}