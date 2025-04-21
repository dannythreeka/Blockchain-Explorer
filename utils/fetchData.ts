import { JsonRpcProvider } from 'ethers';
import { getRpcUrl, MAX_BLOCKS_TO_FETCH } from './constants';

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

export async function fetchBlocks(
  provider: JsonRpcProvider,
  count: number
): Promise<BlockData[]> {
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
  const rpcUrl = getRpcUrl();
  const provider = new JsonRpcProvider(rpcUrl);

  const blocks = await fetchBlocks(provider, MAX_BLOCKS_TO_FETCH); // Using the constant for block count
  return blocks;
}
