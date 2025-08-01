'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { fetchBlocks, createValidatedProvider } from '@/utils/fetchData';
import { BlockData, SelectedBlock, TransactionData } from '@/utils/schema';
import TransactionDetails from '@/app/_components/TransactionDetails';
import { getCreateAddress } from 'ethers'; // Import from ethers library
import ErrorNotification from '@/app/_components/ErrorNotification';

// Create a modified type that represents blocks with transaction count instead of transaction array
type BlockWithTransactionCount = Omit<BlockData, 'transactions'> & {
  transactions: number;
};

export default function Blocks() {
  const [blocks, setBlocks] = useState<BlockWithTransactionCount[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<SelectedBlock | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        // Use our validated provider
        const provider = await createValidatedProvider();
        const blockData = await fetchBlocks(provider, 10);

        setBlocks(
          blockData.map((block) => ({
            ...block,
            transactions: block.transactions.length, // Convert transactions array to its length
          }))
        );
      } catch (error) {
        console.error('Error fetching blocks:', error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(
            'Failed to connect to the Ethereum node. Please check your network settings and ensure your node is running.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // FIXME: using fetchData.ts
  // Explicitly type parameters
  const fetchBlockDetails = async (blockNumber: number) => {
    try {
      setError(null);

      // Use our validated provider
      const provider = await createValidatedProvider();

      const block = await provider.getBlock(blockNumber);
      if (!block) {
        console.error('Block not found');
        return;
      }

      const transactions = await Promise.all(
        block.transactions.map(async (txHash) => {
          const tx = await provider.getTransaction(txHash);
          if (!tx) {
            console.error('Transaction not found');
            return null;
          }

          const isCreatedContract = tx.to === null;
          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            // Use the getCreateAddress utility for contract creation transactions
            createdContractAddress: isCreatedContract
              ? getCreateAddress({ from: tx.from, nonce: tx.nonce })
              : null,
            gasLimit: tx.gasLimit.toString(),
            value: tx.value.toString(),
            data: tx.data,
          };
        })
      );

      setSelectedBlock({
        number: block.number,
        gasUsed: block.gasUsed.toString(),
        gasLimit: block.gasLimit.toString(),
        timestamp: block.timestamp,
        hash: block.hash || 'N/A', // Provide fallback for null hash
        transactions: transactions.filter(
          (tx) => tx !== null
        ) as TransactionData[], // Filter out null transactions
      });
    } catch (error) {
      console.error('Error fetching block details:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          'Failed to connect to the Ethereum node when fetching block details.'
        );
      }
    }
  };

  if (error) {
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Recent Blocks
        </Typography>
        <ErrorNotification error={error} />
      </Box>
    );
  }

  if (selectedBlock) {
    return (
      <Box p={4}>
        <Button variant="contained" onClick={() => setSelectedBlock(null)}>
          Back
        </Button>
        <Typography variant="h5" gutterBottom>
          Block Number: {selectedBlock.number}
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">
            <strong>Gas Used:</strong> {selectedBlock.gasUsed}
          </Typography>
          <Typography variant="body1">
            <strong>Gas Limit:</strong> {selectedBlock.gasLimit}
          </Typography>
          <Typography variant="body1">
            <strong>Mined On:</strong>{' '}
            {new Date(selectedBlock.timestamp * 1000).toLocaleString()}
          </Typography>
          <Typography variant="body1">
            <strong>Block Hash:</strong> {selectedBlock.hash}
          </Typography>
        </Box>
        <Box mt={4}>
          <Typography variant="h6">Transactions</Typography>
          {selectedBlock.transactions.map((tx, idx) => (
            <TransactionDetails key={idx} transaction={tx} />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Recent Blocks
      </Typography>

      {isLoading ? (
        <Typography>Loading blocks...</Typography>
      ) : blocks.length > 0 ? (
        blocks.map((block) => (
          <Card
            key={block.hash}
            variant="outlined"
            sx={{ cursor: 'pointer', mb: 2 }}
            onClick={() => fetchBlockDetails(block.number)}
          >
            <CardContent>
              <Typography variant="body1">
                <strong>Block Number:</strong> {block.number}
              </Typography>
              <Typography variant="body1">
                <strong>Mined On:</strong> {block.timestamp}
              </Typography>
              <Typography variant="body1">
                <strong>Block Hash:</strong> {block.hash}
              </Typography>
              <Typography variant="body1">
                <strong>Gas Used:</strong> {block.gasUsed}
              </Typography>
              <Typography variant="body1">
                <strong>Transactions:</strong> {block.transactions}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No blocks found on the connected Ethereum node.</Typography>
      )}
    </Box>
  );
}
