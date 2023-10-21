import { API_METHOD } from "../constants";

export interface IInputParams {
  amount: string | number;
  callback?: Function | undefined;
  chainId: number | string;
  fromAddress?: string;
  fromChain?: string;
  fromDecimals: number;
  fromId?: string;
  fromToken: string;
  gasPrice?: number;
  rpc?: string;
  slippage?: number;
  toAddress?: string;
  toChain?: string;
  toDecimals: number;
  toToken: string;
  id: string;
}

export interface IAxiosParams {
  body?: any;
  method: API_METHOD;
  payload?: any;
  requestHeader?: object;
  url: string;
}
export interface IFormattedResponse {
  approvalAddress?: string;
  bridgeFee?:
    | {
        amount: string | number;
        amountUsd: string | number;
        symbol: string;
        token_decimals?: number | string;
        contract_address?: string;
      }
    | string;
  estimatedGasFees: string;
  executionDuration?: string;
  fromAmount?: string;
  fromAmountUsd: number | string;
  fromToken: string;
  fromTokenDecimals?: string;
  gasUsd: number | string;
  provider: string;
  priceImpact?: string;
  routing?:
    | {
        name: string;
        logo: string;
      }
    | string;
  toAmount: string;
  toAmountMin?: string;
  toAmountUsd: number | string;
  toToken: string;
  toTokenDecimals?: string;
  toolName?: string;
  toolLogoUrl?: string;
  freeTradeCount?: string;
  isGasless?: boolean;
}

export interface IOxResponse {
  allowanceTarget: string;
  buyAmount: string;
  buyTokenAddress: string;
  buyTokenToEthRate: string;
  data: string;
  decodedUniqueId: string;
  estimatedGas: string;
  estimatedPriceImpact: string;
  gas: string;
  gasPrice: string;
  guaranteedPrice: string;
  minimumProtocolFee: string;
  price: string;
  protocolFee: string;
  sellAmount: string;
  sellTokenAddress: string;
  sellTokenToEthRate: string;
  sources?: SourcesEntity[] | null;
  to: string;
  value: string;
  orders?: OrdersEntity[] | null;
}
export interface SourcesEntity {
  name: string;
  proportion: string;
}
export interface OrdersEntity {
  fill: Fill;
  fillData: FillData;
  makerAmount: string;
  makerToken: string;
  source: string;
  takerAmount: string;
  takerToken: string;
  type: number;
}
export interface FillData {
  gasUsed: number;
  router: string;
  tokenAddressPath?: string[] | null;
  uniswapPath: string;
}
export interface Fill {
  adjustedOutput: string;
  gas: number;
  input: string;
  output: string;
}

export interface IUsdData {
  logo_url: string;
  token_address: string;
  token_decimals: string;
  token_last_activity: Date;
  token_listed_count: string;
  token_logo_url: string;
  token_name: string;
  token_price: string;
  token_symbol: string;
  token_trade_volume: string;
  token_website: string;
}

export interface IUsdResponse {
  data: IUsdData;
  method: string;
  message: string;
  status_code: number;
}

export interface AggregatedQuotesResponseType {
  code: number;
  data: IFormattedResponse[];
  message: string;
  status: boolean;
  id: string;
}
