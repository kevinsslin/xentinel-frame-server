import type { SimulationResponse } from '../types/tenderly';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { apiKit } from '@/lib/safe';
import type { SafeMultisigTransactionResponse } from '@safe-global/types-kit';

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

export async function simulateTransaction(
  safeTxHash: string
): Promise<SimulationResponse> {
  if (!safeTxHash) {
    throw new Error('safeTxHash is required');
  }

  let safeTx: SafeMultisigTransactionResponse | undefined;
  try {
    safeTx = await apiKit.getTransaction(safeTxHash);
    if (!safeTx) {
      throw new Error('Transaction not found');
    }
  } catch (error) {
    console.error('Error fetching Safe transaction:', error);
    throw new Error(`Failed to fetch Safe transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const TENDERLY_ACCESS_KEY = process.env.TENDERLY_ACCESS_KEY;
  const TENDERLY_ACCOUNT_SLUG = process.env.TENDERLY_ACCOUNT_SLUG;
  const TENDERLY_PROJECT_SLUG = process.env.TENDERLY_PROJECT_SLUG;
  const CHAIN_ID = process.env.CHAIN_ID || '84532';  // baseSepolia chain ID

  const missingVars = [];
  if (!TENDERLY_ACCESS_KEY) missingVars.push('TENDERLY_ACCESS_KEY');
  if (!TENDERLY_ACCOUNT_SLUG) missingVars.push('TENDERLY_ACCOUNT_SLUG');
  if (!TENDERLY_PROJECT_SLUG) missingVars.push('TENDERLY_PROJECT_SLUG');
  if (!CHAIN_ID) missingVars.push('CHAIN_ID');

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  try {
    const blockNumber = Number(await publicClient.getBlockNumber());
    console.log('Block number:', blockNumber);
    console.log('SafeTx:', safeTx);

    const requestBody = {
      network_id: CHAIN_ID,
      block_number: blockNumber,
      from: safeTx.safe,
      to: safeTx.to,
      value: Number(safeTx.value),
      input: safeTx.data,
      simulation_type: 'quick' as const,
      save: true,
      save_if_fails: true,
    };

    const response = await fetch(
      `https://api.tenderly.co/api/v1/account/${TENDERLY_ACCOUNT_SLUG}/project/${TENDERLY_PROJECT_SLUG}/simulate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Access-Key': TENDERLY_ACCESS_KEY as string,
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Tenderly API Error:', {
        status: response.status,
        message: errorData?.error?.message || 'Simulation failed',
      });
      throw new Error(errorData?.error?.message || 'Simulation failed');
    }

    const data = await response.json();
    if (!data) {
      throw new Error('Empty response from Tenderly API');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Simulation failed');
  }
} 