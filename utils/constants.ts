/**
 * Application-wide constants
 */

// Network related constants
export const DEFAULT_RPC_URL = 'http://127.0.0.1:8545/';
export const LOCAL_STORAGE_RPC_KEY = 'rpcUrl';

// UI related constants
export const APP_NAME = 'Blockchain Explorer';
export const APP_DESCRIPTION =
  'On-Chain Insights for Smart Contract Development';

// Pagination settings
export const DEFAULT_ITEMS_PER_PAGE = 10;
export const MAX_BLOCKS_TO_FETCH = 10;

// Timeouts and intervals (in milliseconds)
export const REFRESH_INTERVAL = 10000; // 10 seconds
export const REQUEST_TIMEOUT = 5000; // 5 seconds

/**
 * Function to get the RPC URL from localStorage or use default
 */
export function getRpcUrl(): string {
  if (typeof window === 'undefined') {
    return DEFAULT_RPC_URL;
  }

  try {
    return localStorage.getItem(LOCAL_STORAGE_RPC_KEY) || DEFAULT_RPC_URL;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return DEFAULT_RPC_URL;
  }
}
