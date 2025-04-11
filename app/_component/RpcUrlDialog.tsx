import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

export default function RpcUrlDialog() {
  const [rpcUrl, setRpcUrl] = useState(
    localStorage.getItem('rpcUrl') || 'http://127.0.0.1:8545/'
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveRpcUrl = () => {
    localStorage.setItem('rpcUrl', rpcUrl);
    setIsDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Button onClick={handleOpenDialog} variant="contained" color="primary">
        Set RPC URL
      </Button>
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Set RPC URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="RPC URL"
            type="url"
            fullWidth
            value={rpcUrl}
            onChange={(e) => setRpcUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveRpcUrl} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
