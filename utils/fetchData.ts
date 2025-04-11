// Extract shared logic for fetching blocks and transactions into a utility function
import { JsonRpcProvider } from 'ethers';

export async function fetchAllBlocksAndTransactions(provider: JsonRpcProvider) {
  const latestBlockNumber = await provider.getBlockNumber();
  const blocksWithTransactions = await Promise.all(
    Array.from({ length: latestBlockNumber + 1 }, (_, i) => i).map(
      async (blockNumber) => {
        const block = await provider.getBlock(blockNumber);
        if (block) {
          const transactions = await Promise.all(
            block.transactions.map(async (txHash: string) => {
              const tx = await provider.getTransaction(txHash);
              return {
                hash: tx?.hash || 'N/A',
                from: tx?.from || 'N/A',
                to: tx?.to || 'Contract Creation',
                gasLimit: tx?.gasLimit.toString() || '0',
                value: tx?.value.toString() || '0',
                data: tx?.data || 'No data available',
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
        }
        return null;
      }
    )
  );
  return blocksWithTransactions.filter((block) => block !== null);
}