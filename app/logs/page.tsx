'use client';

import React, { useEffect, useState } from 'react';
import { JsonRpcProvider, Log } from 'ethers';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { getRpcUrl } from '../../utils/constants';

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const provider = new JsonRpcProvider(getRpcUrl());
        const filter = {
          fromBlock: 0,
          toBlock: 'latest',
          topics: [], // Fetch all logs; you can specify topics to filter
        };
        const logs = await provider.getLogs(filter);
        setLogs(logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    }

    fetchLogs();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Logs
      </Typography>
      <List>
        {logs.map((log, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`Address: ${log.address}`}
              secondary={`Block Number: ${log.blockNumber}, Transaction Hash: ${log.transactionHash}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
