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
      buttons.push(
        <Button 
          key="blockscout-button"
          action="link" 
          target={blockscoutUrl}
        >
          View in BlockScout
        </Button>
      );
    }

    if (multibaasUrl) {
      buttons.push(
        <Button 
          key="multibaas-button"
          action="link" 
          target={multibaasUrl}
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
          padding: '2rem',
          gap: '1.5rem',
          justifyContent: 'center'
        }}>
          {/* Header Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              backgroundColor: '#FFD700',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem'
            }}>
              ⚡
            </div>
            <div style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              color: '#FFD700',
              textAlign: 'center',
            }}>
              New Transaction Detected
            </div>
          </div>

          {/* Status Badge */}
          <div style={{
            backgroundColor: '#2A2A2A',
            padding: '0.5rem 1rem',
            borderRadius: '1rem',
            alignSelf: 'center',
            border: '1px solid #FFD700',
            marginBottom: '1rem'
          }}>
            <span style={{
              color: '#00FF00',
              fontSize: '1.4rem',
            }}>
              ● Transaction Confirmed
            </span>
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
              { label: 'Time', value: formattedTime, icon: '🕒' },
              { label: 'Network', value: networkDisplay, icon: '🌐' },
              { label: 'Hash', value: hash, icon: '#' },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{
                    fontSize: '1.4rem',
                    marginRight: '0.5rem'
                  }}>
                    {icon}
                  </span>
                  <span style={{ 
                    color: '#FFD700', 
                    fontSize: '1.6rem', 
                    fontWeight: '600',
                    minWidth: '100px'
                  }}>
                    {label}
                  </span>
                </div>
                <span style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '1.4rem',
                  backgroundColor: '#1A1A1A',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  border: '1px solid #FFD700',
                  flex: 1,
                  wordBreak: label === 'Hash' ? 'break-all' : 'normal',
                  textAlign: 'right'
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div style={{
            fontSize: '1.2rem',
            color: '#888',
            textAlign: 'center',
            marginTop: '0.5rem'
          }}>
            Click below to view detailed transaction information
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
