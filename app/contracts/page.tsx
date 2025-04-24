'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createValidatedProvider } from '../../utils/fetchData';
import { getRpcUrl } from '../../utils/constants';
import { Contract, ethers } from 'ethers';

interface ContractFunction {
  name: string;
  type: 'read' | 'write';
  inputs: Array<{ name: string; type: string }>;
  outputs?: Array<{ name: string; type: string }>;
  stateMutability?: string;
}

export default function ContractsPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [contractAbi, setContractAbi] = useState<string>('');
  const [contractInstance, setContractInstance] = useState<Contract | null>(
    null
  );
  const [contractFunctions, setContractFunctions] = useState<
    ContractFunction[]
  >([]);
  const [functionInputs, setFunctionInputs] = useState<
    Record<string, string[]>
  >({});
  const [functionResults, setFunctionResults] = useState<Record<string, any>>(
    {}
  );
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isContractLoading, setIsContractLoading] = useState<boolean>(false);
  const [functionCallLoading, setFunctionCallLoading] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function checkConnection() {
      try {
        setIsLoading(true);
        setError(null);

        // Test the connection to the Ethereum node
        const validatedProvider = await createValidatedProvider();
        setProvider(validatedProvider);

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

  // Load contract from address and ABI
  const loadContract = async () => {
    if (!provider || !contractAddress || !contractAbi) {
      setError('Please provide both contract address and ABI');
      return;
    }

    try {
      setIsContractLoading(true);
      setError(null);
      setContractInstance(null);
      setContractFunctions([]);

      // Parse the ABI
      let parsedAbi;
      try {
        parsedAbi = JSON.parse(contractAbi);
      } catch (e) {
        throw new Error('Invalid ABI format. Please provide a valid JSON ABI.');
      }

      // Create a new contract instance
      const contract = new ethers.Contract(
        contractAddress,
        parsedAbi,
        provider
      );
      setContractInstance(contract);

      // Extract functions from ABI
      const functions: ContractFunction[] = parsedAbi
        .filter((item: any) => item.type === 'function')
        .map((item: any) => ({
          name: item.name,
          type:
            item.stateMutability === 'view' || item.stateMutability === 'pure'
              ? 'read'
              : 'write',
          inputs: item.inputs || [],
          outputs: item.outputs || [],
          stateMutability: item.stateMutability,
        }));

      setContractFunctions(functions);

      // Initialize function inputs
      const initialInputs: Record<string, string[]> = {};
      functions.forEach((func) => {
        initialInputs[func.name] = Array(func.inputs.length).fill('');
      });
      setFunctionInputs(initialInputs);
    } catch (error) {
      console.error('Error loading contract:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to load contract. Please check the address and ABI.');
      }
    } finally {
      setIsContractLoading(false);
    }
  };

  // Handle function calls
  const callFunction = async (funcName: string, type: 'read' | 'write') => {
    if (!contractInstance) return;

    try {
      setFunctionCallLoading((prev) => ({ ...prev, [funcName]: true }));
      const inputs = functionInputs[funcName] || [];

      let result;
      if (type === 'read') {
        // For read functions, we call directly
        result = await contractInstance[funcName](...inputs);

        // Format BigNumber results for display
        if (ethers.BigNumber.isBigNumber(result)) {
          result = result.toString();
        } else if (Array.isArray(result)) {
          result = result.map((item) =>
            ethers.BigNumber.isBigNumber(item) ? item.toString() : item
          );
        }

        setFunctionResults((prev) => ({
          ...prev,
          [funcName]: result,
        }));
      } else {
        // For write functions, we send a transaction
        const tx = await contractInstance[funcName](...inputs);
        setFunctionResults((prev) => ({
          ...prev,
          [funcName]: `Transaction sent: ${tx.hash}`,
        }));

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        setFunctionResults((prev) => ({
          ...prev,
          [funcName]: `Transaction confirmed in block ${receipt.blockNumber}`,
        }));
      }
    } catch (error) {
      console.error(`Error calling ${funcName}:`, error);
      setFunctionResults((prev) => ({
        ...prev,
        [funcName]: `Error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      }));
    } finally {
      setFunctionCallLoading((prev) => ({ ...prev, [funcName]: false }));
    }
  };

  // Update input values
  const handleInputChange = (
    funcName: string,
    index: number,
    value: string
  ) => {
    setFunctionInputs((prev) => {
      const newInputs = { ...prev };
      if (!newInputs[funcName]) {
        newInputs[funcName] = [];
      }
      newInputs[funcName][index] = value;
      return newInputs;
    });
  };

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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

  // Filter functions based on active tab
  const filteredFunctions = contractFunctions.filter(
    (func) =>
      activeTab === 0 ||
      (activeTab === 1 && func.type === 'read') ||
      (activeTab === 2 && func.type === 'write')
  );

  return (
    <Box p={4}>
      <Alert
        severity="info"
        variant="filled"
        sx={{
          mb: 3,
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 'bold' }}>Under Construction</AlertTitle>
        <Typography variant="body1">
          This contracts page is currently in active development. Some features
          may be incomplete or not fully functional. We're working to improve
          the experience and add more capabilities soon!
        </Typography>
      </Alert>

      <Typography variant="h4" gutterBottom>
        Smart Contract Explorer
      </Typography>

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error && !contractAddress ? (
        <ErrorNotification />
      ) : (
        <>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Load Contract
              </Typography>
              <TextField
                label="Contract Address"
                fullWidth
                margin="normal"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
              />
              <TextField
                label="Contract ABI"
                fullWidth
                margin="normal"
                value={contractAbi}
                onChange={(e) => setContractAbi(e.target.value)}
                multiline
                rows={4}
                placeholder="[{...}]"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={loadContract}
                disabled={isContractLoading || !contractAddress || !contractAbi}
                sx={{ mt: 2 }}
              >
                {isContractLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  'Load Contract'
                )}
              </Button>

              {error && contractAddress && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </CardContent>
          </Card>

          {contractInstance && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Contract at {contractAddress}
                </Typography>

                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{ mb: 2 }}
                >
                  <Tab label="All Functions" />
                  <Tab label="Read Functions" />
                  <Tab label="Write Functions" />
                </Tabs>

                {filteredFunctions.length === 0 ? (
                  <Typography>No functions found in this contract.</Typography>
                ) : (
                  filteredFunctions.map((func, index) => (
                    <Accordion key={index} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>
                          {func.name}
                          <Typography
                            component="span"
                            color={
                              func.type === 'read' ? 'primary' : 'secondary'
                            }
                            sx={{ ml: 1 }}
                          >
                            ({func.type})
                          </Typography>
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ mb: 2 }}>
                          {func.inputs.length > 0 ? (
                            func.inputs.map((input, idx) => (
                              <TextField
                                key={idx}
                                label={`${input.name} (${input.type})`}
                                fullWidth
                                margin="dense"
                                value={functionInputs[func.name]?.[idx] || ''}
                                onChange={(e) =>
                                  handleInputChange(
                                    func.name,
                                    idx,
                                    e.target.value
                                  )
                                }
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No inputs required
                            </Typography>
                          )}
                        </Box>

                        <Button
                          variant="contained"
                          color={func.type === 'read' ? 'primary' : 'secondary'}
                          onClick={() => callFunction(func.name, func.type)}
                          disabled={functionCallLoading[func.name]}
                        >
                          {functionCallLoading[func.name] ? (
                            <CircularProgress size={24} />
                          ) : func.type === 'read' ? (
                            'Call'
                          ) : (
                            'Send Transaction'
                          )}
                        </Button>

                        {functionResults[func.name] !== undefined && (
                          <Paper
                            elevation={1}
                            sx={{ mt: 2, p: 2, bgcolor: 'background.default' }}
                          >
                            <Typography variant="subtitle2">Result:</Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                fontFamily: 'monospace',
                              }}
                            >
                              {JSON.stringify(
                                functionResults[func.name],
                                null,
                                2
                              )}
                            </Typography>
                          </Paper>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
