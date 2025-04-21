'use client';

import { Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={4}
    >
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          Welcome to Blockchain Explorer
        </Typography>
        <Typography variant="body1" paragraph>
          Blockchain Explorer is a developer-friendly tool designed to simplify
          the process of developing and debugging smart contracts. Inspired by
          tools like Ganache, this project provides a user-friendly interface to
          visualize and interact with the blockchain network.
        </Typography>
        <Typography variant="body1" paragraph>
          Use the navigation links above to explore recent blocks, transactions,
          events, and logs. You can also set your preferred RPC URL in the
          Settings page.
        </Typography>
        <Typography variant="body1">
          Start exploring and analyzing on-chain data to develop and debug your
          smart contracts with ease.
        </Typography>
      </Box>
    </Box>
  );
}
