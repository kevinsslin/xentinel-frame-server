export interface TokenInfo {
  standard: string;
  type: string;
  contract_address: string;
  symbol: string;
  name: string;
  logo: string;
  decimals: number;
  dollar_value: string;
}

export interface AssetChange {
  token_info: TokenInfo;
  type: 'Transfer' | 'Mint' | 'Burn';
  from: string;
  to: string;
  amount: string;
  raw_amount: string;
  dollar_value: string;
}

export interface BalanceChange {
  address: string;
  dollar_value: string;
  transfers: number[];
}

export interface SimulationResponse {
  transaction: {
    transaction_info: {
      asset_changes: AssetChange[];
      balance_changes: BalanceChange[];
    };
  };
} 