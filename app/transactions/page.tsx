'use client';

import React, { useEffect, useState } from 'react';
import { JsonRpcProvider, formatEther } from 'ethers';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { fetchBlocks } from '../../utils/fetchData';

interface TransactionData {
  hash: string;
  from: string;
  to: string | null;
  gasLimit: string;
  value: string;
  data?: string; // Added optional data field
}

interface BlockData {
  number: number;
  timestamp: string;
  hash: string;
  gasUsed: string;
  transactions: TransactionData[];
}

export default function Transactions() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const rpcUrl =
          localStorage.getItem('rpcUrl') || 'http://127.0.0.1:8545/';
        const provider = new JsonRpcProvider(rpcUrl);
        const blockData = await fetchBlocks(provider, 10);
        setBlocks(blockData);
      } catch (error) {
        console.error('Error fetching blocks and transactions:', error);
      }
    }

    fetchData();
  }, []);

  if (selectedTransaction) {
    return (
      <Box p={4}>
        <Button
          variant="contained"
          onClick={() => setSelectedTransaction(null)}
        >
          &lt;- Back
        </Button>
        <Typography variant="h5" gutterBottom>
          Transaction Hash: {selectedTransaction.hash}
        </Typography>
        <Box mt={2}>
          <Typography variant="body1">
            <strong>From:</strong> {selectedTransaction.from}
          </Typography>
          <Typography variant="body1">
            <strong>To:</strong> {selectedTransaction.to || 'Contract Creation'}
          </Typography>
          <Typography variant="body1">
            <strong>Gas Limit:</strong> {selectedTransaction.gasLimit}
          </Typography>
          <Typography variant="body1">
            <strong>Value:</strong> {formatEther(selectedTransaction.value)} ETH
          </Typography>
        </Box>
        {/* Add TX DATA to the transaction details view */}
        <Box mt={4}>
          <Typography variant="h6">TX DATA</Typography>
          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
            {selectedTransaction.data || 'No data available'}
          </Typography>
        </Box>
        {/* Add a badge for the type of transaction in the transaction details view */}
        <Box
          mt={4}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6">Transaction Details</Typography>
          <Box
            sx={{
              backgroundColor:
                selectedTransaction.to === 'Contract Creation'
                  ? 'red'
                  : 'green',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}
          >
            {selectedTransaction.to === 'Contract Creation'
              ? 'CONTRACT CREATION'
              : 'VALUE TRANSFER'}
          </Box>
        </Box>
      </Box>
    );
  }

  const sortedBlocks: BlockData[] = [...blocks].sort(
    (a, b) => b.number - a.number
  );

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Recent Transactions
      </Typography>
      {sortedBlocks.map((block) => {
        // Sort transactions in descending order (latest to oldest)
        const sortedTransactions: TransactionData[] = [
          ...block.transactions,
        ].sort((a: TransactionData, b: TransactionData) => {
          return b.hash.localeCompare(a.hash); // Assuming hash order correlates with time
        });

        // Separate transactions into CONTRACT CREATION and VALUE TRANSFER
        const contractCreationTransactions = sortedTransactions.filter(
          (tx: TransactionData) => tx.to === null // Contract creation transactions have a null 'to' field
        );
        const valueTransferTransactions = sortedTransactions.filter(
          (tx: TransactionData) => tx.to !== null // Value transfer transactions have a non-null 'to' field
        );

        return (
          <Box key={block.number} mb={4}>
            <Typography variant="h6" gutterBottom>
              Block #{block.number} - {block.timestamp}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Contract Creation Transactions
            </Typography>
            {contractCreationTransactions.map((tx: TransactionData) => (
              <Card
                key={tx.hash}
                variant="outlined"
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedTransaction(tx)}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      <strong>Transaction Hash:</strong> {tx.hash}
                    </Typography>
                    <Typography variant="body1">
                      <strong>From:</strong> {tx.from}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Gas Limit:</strong> {tx.gasLimit}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Value:</strong> {formatEther(tx.value)} ETH
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                    }}
                  >
                    CONTRACT CREATION
                  </Box>
                </CardContent>
              </Card>
            ))}

            <Typography variant="h6" gutterBottom>
              Value Transfer Transactions
            </Typography>
            {valueTransferTransactions.map((tx: TransactionData) => (
              <Card
                key={tx.hash}
                variant="outlined"
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedTransaction(tx)}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body1">
                      <strong>Transaction Hash:</strong> {tx.hash}
                    </Typography>
                    <Typography variant="body1">
                      <strong>From:</strong> {tx.from}
                    </Typography>
                    <Typography variant="body1">
                      <strong>To:</strong> {tx.to}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Gas Limit:</strong> {tx.gasLimit}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Value:</strong> {formatEther(tx.value)} ETH
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: 'green',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                    }}
                  >
                    VALUE TRANSFER
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        );
      })}
    </Box>
  );
}
