'use client';

import React, { useEffect, useState } from 'react';
import { formatEther } from 'ethers';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { fetchBlocks, createValidatedProvider } from '../../utils/fetchData';
import { getRpcUrl } from '../../utils/constants';

// Define types for blocks and selectedBlock
interface BlockData {
  number: number;
  timestamp: string;
  hash: string;
  gasUsed: string;
  transactions: number;
}

interface SelectedBlock {
  number: number;
  gasUsed: string;
  gasLimit: string;
  timestamp: number;
  hash: string;
  transactions: Array<{
    hash: string;
    from: string;
    to: string | null;
    gasLimit: string;
    value: string;
  }>;
}

export default function Blocks() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
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
          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            gasLimit: tx.gasLimit.toString(),
            value: tx.value.toString(),
          };
        })
      );

      setSelectedBlock({
        number: block.number,
        gasUsed: block.gasUsed.toString(),
        gasLimit: block.gasLimit.toString(),
        timestamp: block.timestamp,
        hash: block.hash || 'N/A', // Provide fallback for null hash
        transactions: transactions.filter((tx) => tx !== null), // Filter out null transactions
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

  // Error notification component
  const ErrorNotification = () => (
    <Card
      variant="outlined"
      sx={{ mb: 2, bgcolor: 'error.light', color: 'error.contrastText' }}
    >
      <CardContent>
        <Typography variant="h6">Connection Error</Typography>
        <Typography variant="body1">{error}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Please check if:
          <ul>
            <li>Your Ethereum node is running</li>
            <li>
              The RPC URL is correctly configured (current URL: {getRpcUrl()})
            </li>
            <li>Your network connection is stable</li>
          </ul>
        </Typography>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Recent Blocks
        </Typography>
        <ErrorNotification />
      </Box>
    );
  }

  if (selectedBlock) {
    return (
      <Box p={4}>
        <Button variant="contained" onClick={() => setSelectedBlock(null)}>
          &lt;- Back
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
            <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body1">
                  <strong>Transaction Hash:</strong> {tx.hash}
                </Typography>
                <Typography variant="body1">
                  <strong>From:</strong> {tx.from}
                </Typography>
                <Typography variant="body1">
                  <strong>To:</strong> {tx.to || 'Contract Creation'}
                </Typography>
                <Typography variant="body1">
                  <strong>Gas Used:</strong> {tx.gasLimit}
                </Typography>
                <Typography variant="body1">
                  <strong>Value:</strong> {formatEther(tx.value)} ETH
                </Typography>
              </CardContent>
            </Card>
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
