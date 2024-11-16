import { frames } from "../frames";
import { Button } from "frames.js/next";
import { apiKit } from '@/lib/safe';
import type { SafeInfoResponse } from '@safe-global/api-kit';
import type { SafeMultisigTransactionResponse, SafeMultisigConfirmationResponse } from '@safe-global/types-kit';

const handleRequest = frames(async (ctx) => {
  const { senderAddress, safeAddress, to, value, data, safeTxHash } = ctx.searchParams;
  const queryParams = new URLSearchParams({
    senderAddress,
    safeAddress,
    to,
    value,
    data,
    safeTxHash,
  }).toString();

  if (!safeAddress || (!safeTxHash && (!to || !value || !data))) {
    throw new Error("Missing required parameters");
  }

  let safeTx: SafeMultisigTransactionResponse | undefined;
  try {
    if (safeTxHash) {
      safeTx = await apiKit.getTransaction(safeTxHash);
    }
  } catch (error) {
    console.error('Error fetching Safe transaction:', error);
  }

  let safeInfo: SafeInfoResponse | undefined;
  try {
    safeInfo = await apiKit.getSafeInfo(safeAddress);
  } catch (error) {
    console.error('Error fetching Safe info:', error);
  }

  return {
    image: (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        height: '100%', 
        padding: '2.5rem', 
        gap: '1.5rem', 
        backgroundColor: '#1A1A1A', 
        color: '#F5F5DC', 
        fontSize: '24px',
        justifyContent: 'center'
      }}>
        <div style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold',
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          Transaction Details
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          backgroundColor: '#2A2A2A', 
          borderRadius: '1.25rem', 
          padding: '1.5rem',
          border: '2px solid #FFD700'
        }}>
          {[
            { label: 'Proposer', value: senderAddress },
            { label: 'Safe', value: safeAddress },
            { label: 'To', value: to },
            { label: 'Value', value: value },
            { label: 'Data', value: data },
          ].map(({ label, value }) => (
            <div key={label} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <span style={{ 
                color: '#FFD700', 
                fontSize: '1.6rem', 
                fontWeight: '600',
                minWidth: '120px'
              }}>
                {label}
              </span>
              <span style={{ 
                fontFamily: 'monospace', 
                fontSize: '1.4rem',
                backgroundColor: '#1A1A1A',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                border: '1px solid #FFD700',
                flex: 1,
                wordBreak: label === 'Data' ? 'break-all' : 'normal',
                textAlign: 'right'
              }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {safeTx && safeInfo && (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            backgroundColor: '#2A2A2A', 
            borderRadius: '1.25rem', 
            padding: '1.5rem',
            border: '2px solid #FFD700'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid #FFD700',
              paddingBottom: '0.75rem'
            }}>
              <span style={{ 
                color: '#FFD700', 
                fontSize: '1.6rem', 
                fontWeight: '600',
                display: 'flex',
                gap: '0.5rem'
              }}>
                Confirmations
                <span style={{ 
                  color: '#4ADE80',
                  backgroundColor: '#1A1A1A',
                  padding: '0 0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #FFD700'
                }}>
                  {safeTx.confirmations?.length || 0}/{safeTx.confirmationsRequired}
                </span>
                of
                <span style={{ 
                  backgroundColor: '#1A1A1A',
                  padding: '0 0.5rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #FFD700'
                }}>
                  {safeInfo.owners.length}
                </span>
                owners
              </span>
            </div>
              
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {safeInfo.owners.map((owner) => {
                const hasConfirmed = safeTx.confirmations?.some(
                  (conf: SafeMultisigConfirmationResponse) => 
                    conf.owner.toLowerCase() === owner.toLowerCase()
                );
                const confirmation = safeTx.confirmations?.find(
                  (conf: SafeMultisigConfirmationResponse) => 
                    conf.owner.toLowerCase() === owner.toLowerCase()
                );

                return (
                  <div key={owner} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#1A1A1A',
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    border: '1px solid #FFD700'
                  }}>
                    <span style={{ 
                      fontFamily: 'monospace',
                      fontSize: '1.4rem',
                      color: hasConfirmed ? '#FFD700' : '#F87171'
                    }}>
                      {owner.slice(0, 6)}...{owner.slice(-4)}
                    </span>
                    <span style={{ 
                      fontSize: '1.4rem',
                      color: hasConfirmed ? '#4ADE80' : '#F87171'
                    }}>
                      {hasConfirmed && confirmation 
                        ? new Date(confirmation.submissionDate).toLocaleDateString()
                        : 'Not signed yet'
                      }
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    ),
    buttons: [
      safeTx?.isExecuted ? (
        <Button key="executed-button" action="post" target={`/propose/${queryParams}`}>
          Already Executed
        </Button>
      ) : (
        <Button key="simulate-button" action="post" target={`/propose/simulate?${queryParams}`}>
          Simulate
        </Button>
      )
    ],
    imageOptions: {
      aspectRatio: "1:1",
    },
  };
});

export const GET = handleRequest;
export const POST = handleRequest;