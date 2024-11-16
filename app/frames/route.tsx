import { Button } from "frames.js/next";
import { frames } from "./frames";

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
        target={`/propose?${queryParams}`}
      >
        Next
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
