'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatEther, JsonRpcProvider, TransactionResponse } from 'ethers';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';

export default function TransactionDetail() {
  const { id } = useParams(); // Use useParams to get the transaction hash from the URL

  const [transaction, setTransaction] = useState<TransactionResponse | null>(
    null
  );

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      console.error('Invalid transaction ID');
      return;
    }

    const txHash = id;
    async function fetchTransaction() {
      try {
        const provider = new JsonRpcProvider('http://127.0.0.1:8545/');
        const tx = await provider.getTransaction(txHash);
        if (tx) setTransaction(tx);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
      }
    }

    fetchTransaction();
  }, [id]);

  if (!transaction) {
    return (
      <Box p={4}>
        <Typography variant="h5">Loading transaction details...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Link href="/transactions">
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
          Go Back
        </Button>
      </Link>
      <Typography variant="h4" gutterBottom>
        Transaction Details
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body1">
            <strong>Transaction Hash:</strong> {transaction.hash}
          </Typography>
          <Typography variant="body1">
            <strong>From:</strong> {transaction.from}
          </Typography>
          <Typography variant="body1">
            <strong>To:</strong> {transaction.to || 'Contract Creation'}
          </Typography>
          <Typography variant="body1">
            <strong>Value:</strong> {formatEther(transaction.value || 0)} ETH
          </Typography>
          <Typography variant="body1">
            <strong>Gas Limit:</strong> {transaction.gasLimit.toString()}
          </Typography>
          <Typography variant="body1">
            <strong>Gas Price:</strong> {formatEther(transaction.gasPrice || 0)}{' '}
            ETH
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
