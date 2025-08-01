export type TransactionData = {
  hash: string;
  from: string;
  to: string | null;
  createdContractAddress: string | null;
  gasLimit: string;
  value: string;
  data?: string;
};

export type BlockData = {
  number: number;
  timestamp: string;
  hash: string;
  gasUsed: string;
  transactions: TransactionData[]; // Update transactions to be an array of TransactionData
};

export type SelectedBlock = {
  number: number;
  gasUsed: string;
  gasLimit: string;
  timestamp: number;
  hash: string;
  transactions: Array<TransactionData>;
};
