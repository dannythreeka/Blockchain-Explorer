'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { createValidatedProvider } from '../../utils/fetchData';
import { getRpcUrl } from '../../utils/constants';

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

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Events Page
      </Typography>

      {isLoading ? (
        <Typography>Checking connection to Ethereum node...</Typography>
      ) : error ? (
        <ErrorNotification />
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
