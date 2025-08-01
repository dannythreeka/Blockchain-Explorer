'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import { fetchBlocks, createValidatedProvider } from '@/utils/fetchData';
import { BlockData, TransactionData } from '@/utils/schema';
import TransactionDetails from '@/app/_components/TransactionDetails';
import ErrorNotification from '@/app/_components/ErrorNotification';

export default function Transactions() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionData | null>(null);
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
        setBlocks(blockData);
      } catch (error) {
        console.error('Error fetching blocks and transactions:', error);
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

  if (error) {
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          Recent Transactions
        </Typography>
        <ErrorNotification error={error} />
      </Box>
    );
  }

  if (selectedTransaction) {
    return (
      <Box p={4}>
        <Button
          variant="contained"
          onClick={() => setSelectedTransaction(null)}
        >
          Back
        </Button>
        <Typography variant="h5" gutterBottom>
          Transaction Hash: {selectedTransaction.hash}
        </Typography>
        <Box mt={2}>
          <TransactionDetails transaction={selectedTransaction} />
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
                selectedTransaction.to === null ? 'red' : 'green',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontWeight: 'bold',
            }}
          >
            {selectedTransaction.to === null
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

      {isLoading ? (
        <Typography>Loading transactions...</Typography>
      ) : sortedBlocks.length > 0 ? (
        sortedBlocks.map((block) => {
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
                    <TransactionDetails transaction={tx} showBadge isCompact />
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
                    <TransactionDetails transaction={tx} showBadge isCompact />
                  </CardContent>
                </Card>
              ))}
            </Box>
          );
        })
      ) : (
        <Typography>
          No transactions found on the connected Ethereum node.
        </Typography>
      )}
    </Box>
  );
}
