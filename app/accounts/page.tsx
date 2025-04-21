'use client';

import React, { useEffect, useState } from 'react';
import { formatEther } from 'ethers';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { getRpcUrl } from '../../utils/constants';
import { createValidatedProvider } from '../../utils/fetchData';

// Replace 'any' with a more specific type for window.ethereum
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// Define a type for account data
interface AccountData {
  address: string;
  balance: string;
  transactionCount: number;
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        setIsLoading(true);
        setError(null);

        // Use our validated provider that handles connection errors
        const provider = await createValidatedProvider();

        // Fetch all accounts from the network
        const allAccounts = await provider.listAccounts();

        // Get account data including balance and transaction count
        const accountData = await Promise.all(
          allAccounts.map(async (account) => {
            const resolvedAddress = await account.getAddress();
            const balance = await provider.getBalance(account);
            const transactionCount = await provider.getTransactionCount(
              resolvedAddress
            );
            return {
              address: resolvedAddress,
              balance: formatEther(balance),
              transactionCount,
            };
          })
        );

        // Update state with account data
        setAccounts(accountData);
      } catch (error) {
        console.error('Error fetching accounts:', error);
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

    fetchAccounts();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Accounts Information
      </Typography>

      {error ? (
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
                  The RPC URL is correctly configured (current URL:{' '}
                  {getRpcUrl()})
                </li>
                <li>Your network connection is stable</li>
              </ul>
            </Typography>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Typography>Loading accounts...</Typography>
      ) : accounts.length > 0 ? (
        accounts.map((account, index) => (
          <Card key={index} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1">
                <strong>Account Address:</strong> {account.address}
              </Typography>
              <Typography variant="body1">
                <strong>Balance:</strong> {account.balance} ETH
              </Typography>
              <Typography variant="body1">
                <strong>Transaction Count:</strong> {account.transactionCount}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>
          No accounts found on the connected Ethereum node.
        </Typography>
      )}
    </Box>
  );
}
