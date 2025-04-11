'use client';

import RpcUrlDialog from './_component/RpcUrlDialog';

export default function Home() {
  return (
    <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <RpcUrlDialog />
      <section className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to Blockchain Explorer</h2>
        <p className="text-lg leading-7">
          This website allows you to explore blockchain data, including accounts, blocks, and transactions.
          Use the navigation links above to access different sections of the blockchain.
          You can also set your preferred RPC URL using the "Set RPC URL" button at the top.
          Start exploring and analyzing on-chain data to develop and debug your smart contracts with ease.
        </p>
      </section>
    </div>
  );
}
