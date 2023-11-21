import { Interface, JsonFragment} from "ethers";

export type CallInput = {
  target: string;
  interface?: Interface | JsonFragment[];
  function: string;
  args?: Array<any>;
}

export interface UniswapPairReserves {
  reserve0: BigInt;
  reserve1: BigInt;
  blockTimestampLast: number;
}

export interface UniswapReservesData {
  [key: string]: UniswapPairReserves;
}

export interface TokenBalances {
  [key: string]: BigInt;
}

export interface TokenBalanceAndAllowance {
  balance: BigInt;
  allowance: BigInt;
}

export interface TokenBalancesAndAllowances {
  [key: string]: TokenBalanceAndAllowance;
}