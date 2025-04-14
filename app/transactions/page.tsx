'use client';

import React, { useEffect, useState } from 'react';
import { JsonRpcProvider, formatEther } from 'ethers';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { fetchBlocks } from '../../utils/fetchData';
import Link from 'next/link';

interface TransactionData {
  hash: string;
  from: string;
  to: string | null;
  gasLimit: string;
  value: string;
  data?: string; // Added optional data field
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const rpcUrl =
          localStorage.getItem('rpcUrl') || 'http://127.0.0.1:8545/';
        const provider = new JsonRpcProvider(rpcUrl);
        const blocks = await fetchBlocks(provider, 10);
        const allTransactions = blocks.flatMap((block) => block.transactions);
        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Recent Transactions
      </Typography>

      {transactions.map((tx) => (
        <Card
          key={tx.hash}
          variant="outlined"
          sx={{ cursor: 'pointer', mb: 2 }}
        >
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
              <strong>Value:</strong> {formatEther(tx.value)} ETH
            </Typography>
            <Link href={`/transactions/${tx.hash}`} passHref>
              <Button variant="contained" color="primary">
                View Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
