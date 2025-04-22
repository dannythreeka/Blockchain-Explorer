import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StoryFn } from '@storybook/react';
import Accounts from './page';
import * as utils from '../../utils/fetchData';
import * as constants from '../../utils/constants';
import { formatEther } from 'ethers';

// Create a decorator to mock the functionality used in the Accounts component
const withMocks = (
  StoryComponent: StoryFn<typeof Accounts>,
  { parameters }: any
) => {
  // Store original implementations to restore later
  const originalCreateValidatedProvider = utils.createValidatedProvider;
  const originalGetRpcUrl = constants.getRpcUrl;
  const originalFormatEther = formatEther;

  // Override implementations for mocking
  if (parameters?.mockType === 'loading') {
    // Never-resolving promises to simulate loading state
    utils.createValidatedProvider = jest.fn().mockImplementation(() => ({
      listAccounts: () => new Promise(() => {}),
      getBalance: () => new Promise(() => {}),
      getTransactionCount: () => new Promise(() => {}),
    }));
  } else if (parameters?.mockType === 'error') {
    // Mock implementation that throws an error
    utils.createValidatedProvider = jest.fn().mockImplementation(() => {
      throw new Error('Failed to connect to Ethereum node');
    });
  } else if (parameters?.mockType === 'noAccounts') {
    // Mock implementation that returns empty accounts list
    utils.createValidatedProvider = jest.fn().mockImplementation(() => ({
      listAccounts: () => Promise.resolve([]),
      getBalance: () => Promise.resolve(BigInt(0)),
      getTransactionCount: () => Promise.resolve(0),
    }));
  } else {
    // Default mock implementation with test data
    utils.createValidatedProvider = jest.fn().mockImplementation(() => ({
      listAccounts: () =>
        Promise.resolve([
          {
            getAddress: () =>
              Promise.resolve('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'),
          },
          {
            getAddress: () =>
              Promise.resolve('0x70997970C51812dc3A010C7d01b50e0d17dc79C8'),
          },
          {
            getAddress: () =>
              Promise.resolve('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
          },
        ]),
      getBalance: () => Promise.resolve(BigInt('1000000000000000000')), // 1 ETH
      getTransactionCount: () => Promise.resolve(42),
    }));
  }

  // Mock other utilities
  // @ts-ignore - temporary ignore to avoid modifying the original module
  constants.getRpcUrl = jest
    .fn()
    .mockImplementation(() => 'http://localhost:8545');

  // Clean up after the story renders
  React.useEffect(() => {
    return () => {
      // @ts-ignore - temporary ignore to restore original implementations
      utils.createValidatedProvider = originalCreateValidatedProvider;
      // @ts-ignore
      constants.getRpcUrl = originalGetRpcUrl;
      // Don't need to restore formatEther as we're not modifying the original
    };
  }, [originalCreateValidatedProvider, originalGetRpcUrl]);

  return <StoryComponent />;
};

const meta = {
  title: 'Pages/Accounts',
  component: Accounts,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  // Apply our mock decorator to all stories
  decorators: [withMocks],
} satisfies Meta<typeof Accounts>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story - shows accounts list
export const Default: Story = {};

// Loading state story
export const Loading: Story = {
  parameters: {
    mockType: 'loading',
  },
};

// Error state story
export const Error: Story = {
  parameters: {
    mockType: 'error',
  },
};

// No accounts state story
export const NoAccounts: Story = {
  parameters: {
    mockType: 'noAccounts',
  },
};
