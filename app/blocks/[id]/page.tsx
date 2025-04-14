'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JsonRpcProvider, Block } from 'ethers';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import Link from 'next/link';

export default function BlockDetail() {
  const { id } = useParams(); // Use useParams to get the block hash from the URL

  const [block, setBlock] = useState<Block | null>(null); // Explicitly type the block state

  useEffect(() => {
    if (!id || typeof id !== 'string') {
      console.error('Invalid block ID');
      return;
    }

    const blockHash = id;
    async function fetchBlock() {
      try {
        const provider = new JsonRpcProvider('http://127.0.0.1:8545/');
        const block = await provider.getBlock(blockHash);
        if (block) setBlock(block);
      } catch (error) {
        console.error('Error fetching block details:', error);
      }
    }

    fetchBlock();
  }, [id]);

  if (!block) {
    return (
      <Box p={4}>
        <Typography variant="h5">Loading block details...</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Link href="/blocks">
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
          Go Back
        </Button>
      </Link>
      <Typography variant="h4" gutterBottom>
        Block Details
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="body1">
            <strong>Block Number:</strong> {block.number}
          </Typography>
          <Typography variant="body1">
            <strong>Block Hash:</strong> {block.hash}
          </Typography>
          <Typography variant="body1">
            <strong>Parent Hash:</strong> {block.parentHash}
          </Typography>
          <Typography variant="body1">
            <strong>Timestamp:</strong>{' '}
            {new Date(block.timestamp * 1000).toLocaleString()}
          </Typography>
          <Typography variant="body1">
            <strong>Gas Used:</strong> {block.gasUsed.toString()}
          </Typography>
          <Typography variant="body1">
            <strong>Gas Limit:</strong> {block.gasLimit.toString()}
          </Typography>
          <Typography variant="body1">
            <strong>Transactions:</strong> {block.transactions.length}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
