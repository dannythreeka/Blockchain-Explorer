'use client';

import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';
import { getRpcUrl } from '@/utils/constants';

interface ErrorNotificationProps {
  error: string | null;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ error }) => {
  if (!error) return null;

  return (
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
};

export default ErrorNotification;
