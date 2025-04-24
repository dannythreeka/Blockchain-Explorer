import { Contract, ethers } from 'ethers';
import { createValidatedProvider } from './fetchData';

export interface ContractEvent {
  name: string;
  signature: string;
  inputs: Array<{ name: string; type: string; indexed: boolean }>;
}

export interface ParsedAbiItem {
  name?: string;
  type: string;
  inputs?: Array<{ name: string; type: string; indexed?: boolean }>;
  outputs?: Array<{ name: string; type: string }>;
  stateMutability?: string;
  anonymous?: boolean;
}

/**
 * Creates a contract instance from an address and ABI
 */
export async function createContract(
  address: string,
  abi: string | Array<any>,
  withSigner = false
): Promise<Contract> {
  // Get the provider
  const provider = await createValidatedProvider();

  // Parse the ABI if it's a string
  const parsedAbi = typeof abi === 'string' ? JSON.parse(abi) : abi;

  // Create the contract with or without a signer
  if (withSigner) {
    // Note: This will prompt the user to connect their wallet
    // If you're using a specific wallet integration, you'll need to modify this
    const signer = await provider.getSigner();
    return new ethers.Contract(address, parsedAbi, signer);
  }

  // Read-only contract
  return new ethers.Contract(address, parsedAbi, provider);
}

/**
 * Extract events from a contract ABI
 */
export function extractContractEvents(abi: Array<any>): ContractEvent[] {
  return abi
    .filter((item) => item.type === 'event')
    .map((item) => ({
      name: item.name,
      signature: `${item.name}(${item.inputs
        .map((i: any) => i.type)
        .join(',')})`,
      inputs: item.inputs,
    }));
}

/**
 * Formats a contract call result for display
 */
export function formatContractCallResult(result: any): string {
  if (result === undefined || result === null) {
    return 'null';
  }

  // Handle BigNumber objects
  if (ethers.BigNumber.isBigNumber(result)) {
    return result.toString();
  }

  // Handle arrays (including arrays of BigNumbers)
  if (Array.isArray(result)) {
    const formattedArray = result.map((item) =>
      ethers.BigNumber.isBigNumber(item) ? item.toString() : item
    );
    return JSON.stringify(formattedArray, null, 2);
  }

  // Handle objects
  if (typeof result === 'object') {
    const formattedObject = Object.fromEntries(
      Object.entries(result).map(([key, value]) => [
        key,
        ethers.BigNumber.isBigNumber(value) ? value.toString() : value,
      ])
    );
    return JSON.stringify(formattedObject, null, 2);
  }

  return String(result);
}

/**
 * Get past events for a contract
 */
export async function getContractEvents(
  contract: Contract,
  eventName: string,
  fromBlock = 0,
  toBlock = 'latest'
): Promise<ethers.Event[]> {
  try {
    const filter = contract.filters[eventName]();
    return await contract.queryFilter(filter, fromBlock, toBlock);
  } catch (error) {
    console.error('Error fetching contract events:', error);
    throw error;
  }
}

/**
 * Parse and validate contract ABI
 */
export function parseContractAbi(abiString: string): ParsedAbiItem[] {
  try {
    const parsed = JSON.parse(abiString);
    if (!Array.isArray(parsed)) {
      throw new Error('ABI must be an array');
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid ABI format: ${error.message}`);
    }
    throw new Error('Failed to parse ABI');
  }
}

/**
 * Verify if a string is a valid Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
  return ethers.utils.isAddress(address);
}

/**
 * Estimate gas for a contract method call
 */
export async function estimateGasForContractCall(
  contract: Contract,
  methodName: string,
  args: any[] = []
): Promise<string> {
  try {
    const gasEstimate = await contract.estimateGas[methodName](...args);
    return gasEstimate.toString();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Gas estimation error: ${error.message}`);
    }
    throw new Error('Failed to estimate gas');
  }
}
