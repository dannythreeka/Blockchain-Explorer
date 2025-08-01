'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { createValidatedProvider } from '../../utils/fetchData';
import { getRpcUrl } from '../../utils/constants';
import ErrorNotification from '@/app/_components/ErrorNotification';

export default function EventsPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function checkConnection() {
      try {
        setIsLoading(true);
        setError(null);

        // Test the connection to the Ethereum node
        await createValidatedProvider();

        // If we reached here, the connection is valid
      } catch (error) {
        console.error('Error connecting to Ethereum node:', error);
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

    checkConnection();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Events Page
      </Typography>

      {isLoading ? (
        <Typography>Checking connection to Ethereum node...</Typography>
      ) : error ? (
        <ErrorNotification error={error} />
      ) : (
        <Typography variant="body1" color="textSecondary">
          This page will display contract events when implemented.
          <br />
          <br />
          Connection to Ethereum node is working properly at {getRpcUrl()}
        </Typography>
      )}
    </Box>
  );
}
