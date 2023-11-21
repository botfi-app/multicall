import { AbiCoder } from "ethers";
import { toProvider } from "./utils";

import { TokenBalances, TokenBalancesAndAllowances } from './types';
import { MultiTokenBalanceAndAllowanceGetter, MultiTokenBalanceGetter } from './bytecode.json'

const defaultAbiCoder = AbiCoder.defaultAbiCoder()

export async function getBalances(
  provider_: any,
  tokens: string[],
  account: string
): Promise<[number, TokenBalances]> {
  const provider = toProvider(provider_);
  const inputData = defaultAbiCoder.encode(['address[]', 'address'], [tokens, account]);
  const bytecode = MultiTokenBalanceGetter.concat(inputData.slice(2));
  const encodedReturnData = await provider.call({ data: bytecode });
  const [blockNumber, decodedReturnData] = defaultAbiCoder.decode(['uint256', 'uint256[]'], encodedReturnData);
  const balances: TokenBalances = {};
  for (let i = 0; i < tokens.length; i++) {
    balances[tokens[i]] = decodedReturnData[i];
  }
  return [blockNumber.toNumber(), balances];
}

export async function getBalancesAndAllowances(
  provider_: any,
  tokens: string[],
  owner: string,
  spender: string
): Promise<[number, TokenBalancesAndAllowances]> {
  const provider = toProvider(provider_);
  const inputData = defaultAbiCoder.encode(['address[]', 'address', 'address'], [tokens, owner, spender]);
  const bytecode = MultiTokenBalanceAndAllowanceGetter.concat(inputData.slice(2));
  const encodedReturnData = await provider.call({ data: bytecode });
  const [blockNumber, decodedReturnData] = defaultAbiCoder.decode(['uint256', 'uint256[2][]'], encodedReturnData);
  const balancesAndAllowances: TokenBalancesAndAllowances = {};
  for (let i = 0; i < tokens.length; i++) {
    const [balance, allowance] = decodedReturnData[i];
    balancesAndAllowances[tokens[i]] = { balance, allowance };
  }
  return [blockNumber.toNumber(), balancesAndAllowances];
}