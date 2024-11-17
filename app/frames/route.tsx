import { Button } from "frames.js/next";
import { frames } from "./frames";

const handleRequest = frames(async (ctx) => {
  const { 
    senderAddress = '', 
    safeAddress = '', 
    to = '', 
    value = '', 
    data = '', 
    safeTxHash = '',
    webhook = 'false',
    hash = '',
    chainId = '',
    network = '',
    timestamp = '',
    blockscoutUrl = '',
    multibaasUrl = ''
  } = ctx.searchParams;

  // Only append parameters that have values
  const queryParams = new URLSearchParams();
  if (senderAddress) queryParams.append('senderAddress', senderAddress);
  if (safeAddress) queryParams.append('safeAddress', safeAddress);
  if (to) queryParams.append('to', to);
  if (value) queryParams.append('value', value);
  if (data) queryParams.append('data', data);
  if (safeTxHash) queryParams.append('safeTxHash', safeTxHash);
  if (webhook !== 'false') queryParams.append('webhook', webhook);
  if (hash) queryParams.append('hash', hash);
  if (chainId) queryParams.append('chainId', chainId);
  if (network) queryParams.append('network', network);
  if (timestamp) queryParams.append('timestamp', timestamp);
  if (blockscoutUrl) queryParams.append('blockscoutUrl', blockscoutUrl);
  if (multibaasUrl) queryParams.append('multibaasUrl', multibaasUrl);

  // webhook flow
  if (webhook === 'true' && hash) {
    const formattedTime = timestamp 
      ? new Date(Number(timestamp) * 1000).toLocaleString()
      : new Date().toLocaleString();

    const networkDisplay = chainId 
      ? `${network} (${chainId})`
      : network;

    const buttons = [];
    
    if (blockscoutUrl) {
      const formattedBlockscoutUrl = blockscoutUrl && !blockscoutUrl.startsWith('http') 
        ? `https://${blockscoutUrl}`
        : blockscoutUrl;
        
      buttons.push(
        <Button 
          key="blockscout-button"
          action="link" 
          target={formattedBlockscoutUrl}
        >
          View in BlockScout
        </Button>
      );
    }

    if (multibaasUrl) {
      const formattedMultibaasUrl = multibaasUrl && !multibaasUrl.startsWith('http')
        ? `https://${multibaasUrl}`
        : multibaasUrl;
        
      buttons.push(
        <Button 
          key="multibaas-button"
          action="link" 
          target={formattedMultibaasUrl}
        >
          View in MultiBaas Tx Explorer
        </Button>
      );
    }

    return {
      image: (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%', 
          height: '100%', 
          backgroundColor: '#1A1A1A', 
          color: '#F5F5DC', 
          padding: '2.5rem',
          gap: '2rem',
          justifyContent: 'center'
        }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.2rem'
          }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold',
              color: '#FFD700',
              textAlign: 'center',
              letterSpacing: '0.05em'
            }}>
              New Transaction
            </div>
            
            <div style={{
              display: 'flex',
              backgroundColor: '#2A2A2A',
              padding: '0.6rem 1.5rem',
              borderRadius: '0.8rem',
              border: '2px solid #00FF00'
            }}>
              <span style={{
                color: '#00FF00',
                fontSize: '1.6rem',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                Confirmed
              </span>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.2rem', 
            backgroundColor: '#2A2A2A', 
            borderRadius: '1.2rem', 
            padding: '2rem',
            border: '2px solid #FFD700',
            width: '90%',
            alignSelf: 'center'
          }}>
            {[
              { label: 'Time', value: formattedTime },
              { label: 'Network', value: networkDisplay },
              { label: 'Hash', value: hash, isHash: true }
            ].map(({ label, value, isHash }) => (
              <div key={label} style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: '0.8rem',
                backgroundColor: '#1A1A1A',
                borderRadius: '0.8rem',
                border: '1px solid #444'
              }}>
                <span style={{ 
                  color: '#FFD700', 
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  letterSpacing: '0.05em'
                }}>{label}</span>
                <span style={{ 
                  fontFamily: 'monospace', 
                  fontSize: isHash ? '1.2rem' : '1.4rem',
                  color: '#F5F5DC',
                  wordBreak: isHash ? 'break-all' : 'normal',
                  lineHeight: '1.4'
                }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '1.2rem',
            color: '#888',
            backgroundColor: '#2A2A2A',
            padding: '0.8rem',
            borderRadius: '0.6rem',
            width: '90%',
            alignSelf: 'center'
          }}>
            Click below to view transaction details
          </div>
        </div>
      ),
      buttons,
      imageOptions: {
        aspectRatio: "1:1",
      },
    };
  }

  // safe tx flow
  return {
    image: (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%', 
        height: '100%', 
        backgroundColor: '#1A1A1A', 
        color: '#F5F5DC', 
        padding: '3rem',
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '2rem'
      }}>
        <div style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold',
          color: '#FFD700',
          textAlign: 'center'
        }}>
          Welcome to Safe Transaction Simulator
        </div>
        <div style={{ 
          fontSize: '1.8rem',
          color: '#F5F5DC',
          textAlign: 'center'
        }}>
          Click Next to review your transaction details
        </div>
      </div>
    ),
    buttons: [
      <Button 
        key="next-button"
        action="post" 
        target={`/propose?${queryParams.toString()}`}
      >
        Next
      </Button>
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
