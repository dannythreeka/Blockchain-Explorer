'use client';

import { useEffect, useState } from 'react';
import { getRpcUrl } from '../../utils/constants';
import { Chip, Tooltip, Typography, useTheme } from '@mui/material';
import PowerIcon from '@mui/icons-material/Power';

export function RpcUrlDisplay() {
  const [rpcUrl, setRpcUrl] = useState<string>('');
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  useEffect(() => {
    // Get the RPC URL when component mounts
    setRpcUrl(getRpcUrl());

    // Update when localStorage changes (if user changes RPC URL elsewhere)
    const handleStorageChange = () => {
      setRpcUrl(getRpcUrl());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Tooltip title={`Current RPC URL: ${rpcUrl}`} arrow placement="bottom">
      <Chip
        label={
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              color: '#fff',
            }}
          >
            RPC: {rpcUrl}
          </Typography>
        }
        size="small"
        sx={{
          borderRadius: '16px',
          backgroundColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.08)',
          '&:hover': {
            backgroundColor: isDarkMode
              ? 'rgba(255, 255, 255, 0.15)'
              : 'rgba(0, 0, 0, 0.12)',
          },
        }}
      />
    </Tooltip>
  );
}
