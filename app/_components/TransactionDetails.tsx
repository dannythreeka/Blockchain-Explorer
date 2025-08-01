'use client';

import React from 'react';
import { formatEther } from 'ethers';
import { Box, Typography } from '@mui/material';
import { TransactionData } from '@/utils/schema';

type TransactionDetailsProps = {
  transaction: TransactionData;
  showBadge?: boolean;
  isCompact?: boolean;
};

const TransactionDetails = ({
  transaction,
  showBadge = false,
  isCompact = false,
}: TransactionDetailsProps) => {
  const isContractCreation = transaction.to === null;
  const transactionType = isContractCreation
    ? 'CONTRACT CREATION'
    : 'VALUE TRANSFER';
  const badgeColor = isContractCreation ? 'red' : 'green';

  return (
    <Box>
      <Typography variant="body1">
        <strong>{isCompact ? 'TX HASH:' : 'Transaction Hash:'}</strong>{' '}
        {transaction.hash}
      </Typography>
      <Typography variant="body1">
        <strong>{isCompact ? 'FROM:' : 'From:'}</strong> {transaction.from}
      </Typography>
      {transaction.to && (
        <Typography variant="body1">
          <strong>{isCompact ? 'TO:' : 'To:'}</strong> {transaction.to}
        </Typography>
      )}
      {!transaction.to && (
        <Typography variant="body1">
          <strong>{isCompact ? 'TO:' : 'To:'}</strong> Contract Creation
        </Typography>
      )}
      {transaction.createdContractAddress && (
        <Typography variant="body1">
          <strong>CREATED CONTRACT ADDRESS:</strong>{' '}
          {transaction.createdContractAddress}
        </Typography>
      )}
      <Typography variant="body1">
        <strong>Gas Limit:</strong> {transaction.gasLimit}
      </Typography>
      <Typography variant="body1">
        <strong>Value:</strong> {formatEther(transaction.value)} ETH
      </Typography>
      {showBadge && (
        <Box
          sx={{
            backgroundColor: badgeColor,
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: 'bold',
            display: 'inline-block',
            mt: 1,
          }}
        >
          {transactionType}
        </Box>
      )}
    </Box>
  );
};

export default TransactionDetails;
