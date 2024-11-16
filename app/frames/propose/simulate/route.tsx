import { frames } from "../../frames";
import { Button } from "frames.js/next";
import { simulateTransaction } from '../../../utils/tenderly';
import type { SimulationResponse, AssetChange, BalanceChange } from '../../../types/tenderly';

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

  if (!safeTxHash) {
    console.error('Missing safeTxHash');
    throw new Error('Missing safeTxHash parameter');
  }

  let simulationResult: SimulationResponse | null = null;
  let simulationStatus = "Pending";
  let errorMessage = "";
  
  try {
    console.log('Starting simulation with params:', {
      safeTxHash,
      safeAddress,
      to,
      value,
      data,
    });

    simulationResult = await simulateTransaction(safeTxHash);
    simulationStatus = "Success";
  } catch (error) {
    console.error('Simulation error:', error);
    simulationStatus = "Failed";
    errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  }

  const assetChanges = simulationResult?.transaction.transaction_info.asset_changes || [];
  const balanceChanges = simulationResult?.transaction.transaction_info.balance_changes || [];

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
        fontSize: '24px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '1.5rem' 
        }}>
          <div style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            color: '#FFD700'
          }}>
            Transaction Simulation Results
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            fontSize: '2rem',
            fontWeight: '600', 
            color: '#FFD700'
          }}>
            Asset Changes
          </div>
          
          {assetChanges.length === 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              color: '#F5F5DC', 
              fontSize: '1.6rem', 
              padding: '1.5rem',
              backgroundColor: '#2A2A2A', 
              borderRadius: '1.25rem',
              border: '2px solid #FFD700'
            }}>
              No supported token balance changes
            </div>
          )}
          
          {assetChanges.map((change: AssetChange) => {
            const isSafeReceiving = change.to.toLowerCase() === safeAddress?.toLowerCase();
            const transferType = isSafeReceiving ? 'Receiving' : 'Sending';
            const transferColor = isSafeReceiving ? '#4ADE80' : '#F87171';
            
            return (
              <div key={`${change.token_info.contract_address}-${change.amount}`} 
                   style={{ 
                     display: 'flex', 
                     gap: '1rem', 
                     backgroundColor: '#2A2A2A', 
                     borderRadius: '1rem', 
                     padding: '1rem', 
                     alignItems: 'center',
                     border: '2px solid #FFD700'
                   }}>
                <img 
                  src={change.token_info.logo} 
                  alt={change.token_info.symbol} 
                  style={{ 
                    width: 64, 
                    height: 64,
                    borderRadius: '50%',
                    border: '2px solid #FFD700'
                  }} 
                />
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flex: 1, 
                  gap: '0.5rem'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontWeight: '600',
                      fontSize: '1.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {change.token_info.name}
                      <span style={{ 
                        color: transferColor,
                        fontSize: '1.6rem',
                        backgroundColor: '#1A1A1A', 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #FFD700'
                      }}>
                        {transferType}
                      </span>
                    </span>
                    <span style={{ 
                      color: transferColor,
                      fontSize: '1.8rem'
                    }}>
                      ${Number.parseFloat(change.dollar_value).toFixed(4)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#F5F5DC',
                    fontSize: '1.4rem'
                  }}>
                    <span style={{ 
                      display: 'flex',
                      gap: '0.5rem',
                      color: '#FFD700'
                    }}>
                      <span>{isSafeReceiving ? 'From' : 'To'}:</span>
                      <span style={{ 
                        fontFamily: 'monospace',
                        backgroundColor: '#1A1A1A', 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid #FFD700'
                      }}>
                        {(isSafeReceiving ? change.from : change.to).slice(0, 6)}...
                        {(isSafeReceiving ? change.from : change.to).slice(-4)}
                      </span>
                    </span>
                    <span>
                      {change.amount} {change.token_info.symbol}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div style={{ 
            display: 'flex', 
            fontSize: '2rem', 
            fontWeight: '600', 
            color: '#FFD700'
          }}>
            Balance Changes
          </div>
          {balanceChanges.length === 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              color: '#F5F5DC', 
              fontSize: '1.6rem', 
              padding: '1.5rem',
              backgroundColor: '#2A2A2A', 
              borderRadius: '1.25rem',
              border: '2px solid #FFD700'
            }}>
              No dollar value changes caused by supported ERC20 and ERC721 tokens
            </div>
          )}
          {balanceChanges.map((change: BalanceChange) => (
            <div key={`${change.address}-${change.dollar_value}`} 
                 style={{ 
                   display: 'flex', 
                   backgroundColor: '#2A2A2A', 
                   borderRadius: '1.25rem', 
                   padding: '1.5rem',
                   border: '2px solid #FFD700'
                 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', fontSize: '1.6rem' }}>
                <span style={{ 
                  display: 'flex', 
                  fontFamily: 'monospace',
                  backgroundColor: '#1A1A1A', 
                  padding: '0.5rem 1rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #FFD700'
                }}>
                  {change.address.slice(0, 6)}...{change.address.slice(-4)}
                </span>
                <span style={{ 
                  display: 'flex', 
                  color: Number.parseFloat(change.dollar_value) >= 0 ? '#4CAF50' : '#F44336',
                  fontWeight: '600'
                }}>
                  ${Number.parseFloat(change.dollar_value).toFixed(4)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {simulationStatus !== "Success" && (
          <div style={{ 
            display: 'flex', 
            color: '#F44336', 
            justifyContent: 'center', 
            fontSize: '1.8rem', 
            marginTop: '1.5rem',
            backgroundColor: '#2A2A2A', 
            padding: '1.5rem',
            borderRadius: '1.25rem',
            border: '2px solid #FFD700'
          }}>
            {simulationStatus === "Failed" ? `Simulation Failed: ${errorMessage}` : "Simulation Pending"}
          </div>
        )}
      </div>
    ),
    buttons: [
      <Button key="back" action="post" target={`/propose?${queryParams}`}>
        Back
      </Button>
    ],
    imageOptions: {
      aspectRatio: "1:1",
    },
  };
});

export const GET = handleRequest;
export const POST = handleRequest;