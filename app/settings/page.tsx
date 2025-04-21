'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { DEFAULT_RPC_URL, LOCAL_STORAGE_RPC_KEY } from '../../utils/constants';

export default function SettingsPage() {
  const [rpcUrl, setRpcUrl] = useState(DEFAULT_RPC_URL);

  // Load the saved RPC URL when the component mounts
  useEffect(() => {
    // Use a try-catch block to handle potential localStorage errors
    try {
      const savedUrl = localStorage.getItem(LOCAL_STORAGE_RPC_KEY);
      if (savedUrl) {
        setRpcUrl(savedUrl);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const handleSaveRpcUrl = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_RPC_KEY, rpcUrl);
      alert('RPC URL saved successfully!');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      alert('Failed to save RPC URL. Please try again.');
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Card variant="outlined" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            RPC URL Configuration
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Enter the URL of your Ethereum JSON-RPC endpoint. This is used to
            connect to your blockchain node.
          </Typography>

          <TextField
            label="RPC URL"
            variant="outlined"
            fullWidth
            value={rpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
            margin="normal"
            placeholder={DEFAULT_RPC_URL}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveRpcUrl}
            sx={{ mt: 2 }}
          >
            Save RPC URL
          </Button>
        </CardContent>
      </Card>

      {/* Additional settings sections can be added here */}
      <Card variant="outlined" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Display Settings
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            These settings will be implemented in future updates.
          </Typography>
          {/* Placeholder for future settings */}
        </CardContent>
      </Card>
    </Box>
  );
}
