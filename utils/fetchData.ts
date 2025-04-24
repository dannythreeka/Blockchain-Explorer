import { JsonRpcProvider } from 'ethers';
import { getRpcUrl, MAX_BLOCKS_TO_FETCH, REQUEST_TIMEOUT } from './constants';

interface TransactionData {
  hash: string;
  from: string;
  to: string | null;
  gasLimit: string;
  value: string;
  data?: string;
}

interface BlockData {
  number: number;
  timestamp: string;
  hash: string;
  gasUsed: string;
  transactions: TransactionData[]; // Update transactions to be an array of TransactionData
}

/**
 * Validates the connection to the Ethereum node
 * @param provider The JsonRpcProvider instance
 * @returns A promise that resolves if connection is valid
 * @throws Error if connection fails
 */
export async function validateConnection(
  provider: JsonRpcProvider
): Promise<boolean> {
  try {
    // Set a timeout to prevent hanging if the node is unreachable
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `Connection timed out after ${REQUEST_TIMEOUT}ms. Please check if your Ethereum node is running at ${getRpcUrl()}`
          )
        );
      }, REQUEST_TIMEOUT);
    });

    // Race between getting block number and timeout
    await Promise.race([provider.getBlockNumber(), timeout]);

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(
        `Failed to connect to the Ethereum node at ${getRpcUrl()}. Please check if your node is running.`
      );
    }
  }
}

/**
 * Creates a JsonRpcProvider with built-in connection validation
 */
export function createValidatedProvider(): Promise<JsonRpcProvider> {
  const provider = new JsonRpcProvider(getRpcUrl());

  return validateConnection(provider).then(() => provider);
}

export async function fetchBlocks(
  provider: JsonRpcProvider,
  count: number
): Promise<BlockData[]> {
  // Validate connection before proceeding
  await validateConnection(provider);

  const latestBlockNumber = await provider.getBlockNumber();
  const blockData = await Promise.all(
    Array.from(
      { length: latestBlockNumber >= count ? count : latestBlockNumber + 1 },
      (_, i) => latestBlockNumber - i
    ).map(async (blockNumber): Promise<BlockData | null> => {
      if (blockNumber < 0) {
        throw new Error('blockNumber cannot be negative');
      }
      const block = await provider.getBlock(blockNumber);
      if (!block) return null;
      const transactions = await Promise.all(
        block.transactions.map(async (txHash: string) => {
          const tx = await provider.getTransaction(txHash);
          console.log('Transaction:', tx);
          return {
            hash: tx?.hash || 'N/A',
            from: tx?.from || 'N/A',
            to: tx?.to || null,
            gasLimit: tx?.gasLimit.toString() || '0',
            value: tx?.value.toString() || '0',
            data: tx?.data || undefined,
          };
        })
      );
      return {
        number: block.number,
        timestamp: new Date(block.timestamp * 1000).toLocaleString(),
        hash: block.hash || 'N/A',
        gasUsed: block.gasUsed.toString(),
        transactions,
      };
    })
  );

  // Filter out null values and remove duplicate blocks by hash
  const uniqueBlocks = blockData.filter(
    (block, index, self) =>
      block !== null && self.findIndex((b) => b?.hash === block.hash) === index
  );

  return uniqueBlocks as BlockData[];
}

export async function fetchAllBlocksAndTransactions() {
  try {
    const provider = await createValidatedProvider();
    const blocks = await fetchBlocks(provider, MAX_BLOCKS_TO_FETCH); // Using the constant for block count
    return blocks;
  } catch (error) {
    console.error('Error fetching blocks and transactions:', error);
    throw error; // Re-throw to handle in the UI layer
  }
}
