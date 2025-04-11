'use client';

import React, { useEffect, useState } from 'react';
import { JsonRpcProvider, formatEther } from 'ethers';
import { Box, Typography, Card, CardContent } from '@mui/material';

// Define the Eip1193Provider type to resolve the type error
interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

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
  // Update the state to use the AccountData type
  const [accounts, setAccounts] = useState<AccountData[]>([]);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        // Connect to the Hardhat network
        const provider = new JsonRpcProvider('http://127.0.0.1:8545/');

        // Fetch all accounts from the Hardhat network
        const allAccounts = await provider.listAccounts();

        // Ensure getSigner() is awaited
        const accountData = await Promise.all(
          allAccounts.map(async (account) => {
            const resolvedAddress = await account.getAddress();
            const balance = await provider.getBalance(account);
            const transactionCount = await provider.getTransactionCount(
              resolvedAddress
            );
            return {
              address: resolvedAddress, // Use the resolved address string
              balance: formatEther(balance),
              transactionCount,
            };
          })
        );

        // Update state with all accounts
        setAccounts(accountData);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    }

    fetchAccounts();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Accounts Information
      </Typography>
      {accounts.length > 0 ? (
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
        <Typography>Loading accounts...</Typography>
      )}
    </Box>
  );
}
