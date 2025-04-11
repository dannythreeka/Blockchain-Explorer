'use client';

import React, { useEffect, useState } from 'react';
import { JsonRpcProvider, formatEther } from 'ethers';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
} from '@mui/material';

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
  // Update state types
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<SelectedBlock | null>(null);

  useEffect(() => {
    async function fetchBlocks() {
      try {
        const provider = new JsonRpcProvider('http://127.0.0.1:8545/');
        const latestBlockNumber = await provider.getBlockNumber();
        const blockData = await Promise.all(
          Array.from({ length: 10 }, (_, i) => latestBlockNumber - i).map(
            async (blockNumber) => {
              const block = await provider.getBlock(blockNumber);
              if (!block) return null;
              return {
                number: block.number,
                timestamp: new Date(block.timestamp * 1000).toLocaleString(),
                hash: block.hash,
                gasUsed: block.gasUsed.toString(),
                transactions: block.transactions.length,
              };
            }
          )
        );

        // Filter out null values from blocks
        const uniqueBlocks = blockData.filter((block): block is BlockData => block !== null);
        setBlocks(uniqueBlocks);
      } catch (error) {
        console.error('Error fetching blocks:', error);
      }
    }

    fetchBlocks();
  }, []);

  // Explicitly type parameters
  const fetchBlockDetails = async (blockNumber: number) => {
    try {
      const provider = new JsonRpcProvider('http://127.0.0.1:8545/');
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
    }
  };

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

      {blocks.map((block, index) => (
        <Card
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
      ))}
    </Box>
  );
}
