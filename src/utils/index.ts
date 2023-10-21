import { AxiosResponse } from "axios";
import { axiosInstance } from "../api";
import {
  API_METHOD,
  BASE_EXCHANGE_URL,
  BASE_UNIT,
  CHAINS_IDS,
  CHAIN_LIST,
  HEADER_APPLICATION_JSON,
  HTTP_SUCCESS_CODES,
  NATIVE_TOKEN,
  NATIVE_TOKEN_INFO_URL,
  OX_PROVIDER_URLS,
  PROVIDERS,
  PROVIDERS_LIST,
  RANGO_API_KEY,
  SUPPORTED_CHAINS,
  TOKEN_INFO_URL,
  TOKEN_INFO_URL_NEW,
  UNIFRONT_TOKEN_PRICE_URL,
  nativeTokenAddress,
} from "../constants";
import { IFormattedResponse } from "../types";

export const getUsdValues = ({
  amount,
  decimals,
  tokenPrice,
}: {
  amount: number;
  decimals: number;
  tokenPrice: number;
}) => {
  const usdValue = (amount / Math.pow(10, decimals)) * tokenPrice;
  return usdValue;
};

export const getNativeToken = (
  providerType: PROVIDERS,
  tokenAddress: string
) => {
  if (
    [
      PROVIDERS.ZEROX,
      PROVIDERS.PARASWAP,
      PROVIDERS.ONEINCH,
      PROVIDERS.KYBERSWAP,
    ].includes(providerType) &&
    tokenAddress === "0x0000000000000000000000000000000000001010"
  ) {
    return "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  } else {
    return tokenAddress;
  }
};

export const getSlippage = (providerType: PROVIDERS, slippage: number) => {
  switch (providerType) {
    case PROVIDERS.ZEROX:
      return slippage / 100;
    case PROVIDERS.KYBERSWAP:
      return slippage * 100;
    case PROVIDERS.OPENOCEAN:
      return slippage * 100;
    case PROVIDERS.PARASWAP:
      return slippage;
    case PROVIDERS.DODO:
      return slippage;
    case PROVIDERS.ONEINCH:
      return slippage;
    case PROVIDERS.LIFI:
      return slippage / 100;
    case PROVIDERS.JUPITER:
      return parseInt(String(slippage * 100));
    case PROVIDERS.ROUTER:
      return slippage;
    default:
      return slippage;
  }
};

export const hexToNumber = (val: string, divider = 1) => {
  return parseInt(val, 16) / divider;
};

export const getProviderUrl = (
  providerType: PROVIDERS,
  chainId: number | string
) => {
  const chainDetail = getChainDetail(chainId);
  switch (providerType) {
    case PROVIDERS.ZEROX:
      let url = PROVIDERS_LIST[PROVIDERS.ZEROX].url;
      const baseChainId = CHAIN_LIST.find(
        (chain) => chain.id === CHAINS_IDS.BASE
      )?.chainId;
      if (chainId == baseChainId) {
        url = url.replace(`api.0x.org`, `base.api.0x.org`);
      }
      return url;
    case PROVIDERS.KYBERSWAP:
      if (chainDetail?.id) {
        return `https://aggregator-api.kyberswap.com/${chainDetail.id}/route/encode`;
      }
      return PROVIDERS_LIST[PROVIDERS.KYBERSWAP].url;
    case PROVIDERS.OPENOCEAN:
      if (chainDetail?.id) {
        return `https://open-api.openocean.finance/v3/${chainDetail.symbol.toLocaleLowerCase()}/quote`;
      }
      return PROVIDERS_LIST[PROVIDERS.OPENOCEAN].url;
    case PROVIDERS.PARASWAP:
      return PROVIDERS_LIST[PROVIDERS.PARASWAP].url;
    case PROVIDERS.DODO:
      return PROVIDERS_LIST[PROVIDERS.DODO].url;
    case PROVIDERS.ONEINCH:
      if (chainDetail?.id) {
        return `https://api-frontier.1inch.io/v5.0/${chainId}/quote`;
      }
      return PROVIDERS_LIST[PROVIDERS.ONEINCH].url;
    case PROVIDERS.LIFI:
      return PROVIDERS_LIST[PROVIDERS.LIFI].url;
    case PROVIDERS.XY:
      return PROVIDERS_LIST[PROVIDERS.XY].url;
    case PROVIDERS.DEBRIDGE:
      return PROVIDERS_LIST[PROVIDERS.DEBRIDGE].url;
    case PROVIDERS.JUPITER:
      return PROVIDERS_LIST[PROVIDERS.JUPITER].url;
    case PROVIDERS.SOCKET:
      return PROVIDERS_LIST[PROVIDERS.SOCKET].url;
    case PROVIDERS.ROUTER:
      return PROVIDERS_LIST[PROVIDERS.ROUTER].url;
    case PROVIDERS.RANGO:
      return PROVIDERS_LIST[PROVIDERS.RANGO].url;
    case PROVIDERS.VVSFINANCE:
    case PROVIDERS.ELK:
    case PROVIDERS.ARTHSWAP:
    case PROVIDERS.LUASWAP:
    case PROVIDERS.NETSWAP:
    case PROVIDERS.DIFFUSION:
    case PROVIDERS.XSWAP:
    case PROVIDERS.MESHSWAP:
    case PROVIDERS.QUACKSWAP:
    case PROVIDERS.KLAYSWAP:
    case PROVIDERS.SOYFINANCE:
    case PROVIDERS.ZEROSWAP:
      if (chainDetail?.id) {
        return `https://extension-v2.unifront.io/v2/exchange/${chainDetail.id}/quote`;
      }
      return PROVIDERS_LIST[PROVIDERS.VVSFINANCE].url;
    case PROVIDERS.OSMOSISDEX:
      return PROVIDERS_LIST[PROVIDERS.OSMOSISDEX].url;
    default:
      return "";
  }
};

export const filterValidProvider = (providerArray: IFormattedResponse[]) => {
  const arr = providerArray.filter((provider) => {
    return (
      provider.fromToken &&
      provider.toToken &&
      provider.toAmount &&
      Number(provider.toAmount) > 0 &&
      !isNaN(Number(provider.toAmount))
    );
  });
  return arr;
};

export const getAccecptedNativeTokens = async (chainId: string) => {
  return new Promise((resolve) => {
    const accecptedNativeTokens = ["10", "42161"];
    const isAccNative = accecptedNativeTokens.includes(chainId);
    resolve(isAccNative);
  });
};

export function sortByGasFeesAndToAmount(arr: any[], type: string) {
  return type === "bridge"
    ? arr.sort((a, b) => {
        if (a.gasUsd === 0 && b.gasUsd !== 0) {
          return 1;
        }
        if (a.gasUsd !== 0 && b.gasUsd === 0) {
          return -1;
        }
        if (a.toAmountUsd !== b.toAmountUsd) {
          const aFinalUsd = a.toAmountUsd - a.gasUsd;
          const bFinalUsd = b.toAmountUsd - b.gasUsd;
          return bFinalUsd - aFinalUsd;
        }
        return a.estimatedGasFees - b.estimatedGasFees;
      })
    : arr.sort((a, b) => {
        if (a.gasUsd === "" && b.gasUsd !== "") {
          return 1;
        }
        if (a.gasUsd !== "" && b.gasUsd === "") {
          return -1;
        }
        if (a.toAmountUsd !== b.toAmountUsd) {
          const aGas = a.isGasless ? 0 : a.gasUsd;
          const bGas = b.isGasless ? 0 : b.gasUsd;
          const aFinalUsd = a.toAmountUsd - aGas;
          const bFinalUsd = b.toAmountUsd - bGas;
          return bFinalUsd - aFinalUsd;
        }
        return a.estimatedGasFees - b.estimatedGasFees;
      });
}

export const getChainDetail = (chainId: number | string) => {
  const chainDetail = CHAIN_LIST.find(
    (_chain) => _chain.chainId === String(chainId)
  );
  return chainDetail;
};

export const getRouterGas = (fromChain: string, toChain: string) => {
  const url = "https://api.stats.routerprotocol.com/api/fee";
  let config = {
    method: API_METHOD.GET,
    url: url,
    headers: HEADER_APPLICATION_JSON,
    params: {
      srcChainId: fromChain,
      destChainId: toChain,
      widgetId: 24,
    },
  };
  return new Promise((resolve) => {
    axiosInstance(config).then((res: any) => {
      if (HTTP_SUCCESS_CODES.includes(res.status)) {
        const { data } = res;
        resolve(data);
      }
    });
  });
};

export const getGasUsdFromEstLimit = (
  url: string,
  tokenPrice: number,
  estLimit: number,
  decimals: number
) => {
  let config = {
    method: API_METHOD.POST,
    url: url,
    headers: HEADER_APPLICATION_JSON,
    data: { jsonrpc: "2.0", method: "eth_gasPrice", params: [], id: 1 },
  };
  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const { data } = res;
          const gas = hexToNumber(data.result);
          const gasPrice = (gas * estLimit) / Math.pow(10, decimals);
          const gasUsd = gasPrice * tokenPrice;
          resolve(gasUsd);
        }
      })
      .catch((e) => {
        resolve(0);
      });
  });
};

export const getRangoParams = async (
  fromChainId: number,
  fromTokenAddress: string,
  toChainId: number,
  toTokenAddress: string
) => {
  const rangoMeta = (await getRangoParamsApi()) as any;
  if (rangoMeta) {
    return new Promise(async (resolve) => {
      const fromParamObjects = rangoMeta.tokens.filter(
        (token: { chainId: string; address: string }) =>
          fromChainId === Number(token.chainId) &&
          fromTokenAddress === token.address
      )[0];
      const toParamObjects = rangoMeta.tokens.filter(
        (token: { chainId: string; address: string }) =>
          toChainId === Number(token.chainId) &&
          toTokenAddress === token.address
      )[0];
      const from = fromParamObjects
        ? fromParamObjects.blockchain + "." + fromParamObjects.symbol
        : await getParamFromUniFront(fromChainId, fromTokenAddress);
      const to = toParamObjects
        ? toParamObjects.blockchain + "." + toParamObjects.symbol
        : await getParamFromUniFront(toChainId, toTokenAddress);
      resolve({
        from: from,
        to: to,
      });
    });
  }
};

export const getCosmosSwapTokenList = (chain: string) => {
  let config = {
    method: API_METHOD.GET,
    url: `${BASE_EXCHANGE_URL}${chain}/tokens`,
    headers: HEADER_APPLICATION_JSON,
    params: {
      exchange_type: PROVIDERS.OSMOSISDEX,
    },
  };
  return new Promise((resolve) => {
    axiosInstance(config).then((res: any) => {
      if (HTTP_SUCCESS_CODES.includes(res.status)) {
        const {
          data: { data },
        } = res;
        resolve(data);
      }
    });
  });
};

export const getParamFromUniFront = async (
  chainId: number,
  tokenAddress: string
) => {
  const tokenInfo = getTokenInfoApi(chainId, tokenAddress);
  const chainDetail = getChainDetail(chainId);
  if (tokenInfo.status) {
    let config = {
      method: API_METHOD.GET,
      url: tokenInfo.url,
      headers: HEADER_APPLICATION_JSON,
      params: tokenInfo.params,
    };
    const callToken = (await callTokenInfoApi(chainId, tokenAddress)) as any;
    return new Promise((resolve) => {
      const chainName = chainDetail?.chainAlias?.toUpperCase();
      const tokenSymbol = callToken.symbol.toUpperCase();
      const param = chainName + "." + tokenSymbol;
      const combinedParam = param.split(" ").join("");
      resolve(combinedParam);
    });
  }
};

export const getAltParamFromUniFront = async (
  chainId: number,
  tokenAddress: string,
  config: any
) => {
  const tokenInfo = getTokenInfoApi(chainId, tokenAddress);
  const chainDetail = getChainDetail(chainId);
  let configAlt = {
    method: API_METHOD.GET,
    url:
      config.url === NATIVE_TOKEN_INFO_URL
        ? TOKEN_INFO_URL
        : NATIVE_TOKEN_INFO_URL,
    headers: HEADER_APPLICATION_JSON,
    params:
      config.url === NATIVE_TOKEN_INFO_URL
        ? {
            chain: chainDetail?.id,
            contractAddress: tokenAddress,
          }
        : { ids: chainDetail?.id, vs_currencies: "usd" },
  };
  return new Promise((resolve) => {
    axiosInstance(configAlt).then((res: any) => {
      if (HTTP_SUCCESS_CODES.includes(res.status)) {
        const {
          data: { data },
        } = res;
        const chainName = chainDetail?.chainAlias?.toUpperCase();
        const tokenSymbol =
          configAlt.url === NATIVE_TOKEN_INFO_URL
            ? chainDetail?.nativeToken?.symbol
            : data.token_symbol.toUpperCase();
        const param = chainName + "." + tokenSymbol;
        const combinedParam = param.split(" ").join("");
        resolve(combinedParam);
      }
    });
  });
};

export const getRangoParamsApi = () => {
  let config = {
    method: API_METHOD.GET,
    url: "https://designstring.s3.ap-south-1.amazonaws.com/dex/rango_meta.json",
    headers: HEADER_APPLICATION_JSON,
    params: { apiKey: RANGO_API_KEY },
  };
  return new Promise((resolve) => {
    axiosInstance(config).then((res: any) => {
      if (HTTP_SUCCESS_CODES.includes(res.status)) {
        const { data } = res;
        resolve(data);
      }
    });
  });
};

export const getAmountValue = (
  amount: number,
  decimals: number,
  usdValue: number
): number => {
  const convertedAmount = amount / Math.pow(10, Number(decimals));
  const amountUSD = convertedAmount * usdValue;
  return amountUSD;
};

export const getRouterUSDAmount = async (
  chainId: number,
  tokenAddress: string,
  amount: number,
  decimals: number
) => {
  const tokenInfo = getTokenInfoApi(chainId, tokenAddress);
  const chainDetail = getChainDetail(chainId);
  if (tokenInfo.status) {
    let config = {
      method: API_METHOD.GET,
      url: tokenInfo.url,
      headers: HEADER_APPLICATION_JSON,
      params: tokenInfo.params,
    };
    const usdprice = (await getUniFrontTokenPrice(chainId, [
      tokenAddress,
    ])) as any;
    return new Promise((resolve) => {
      const tokenPrice = usdprice[0]?.usd;
      const usdValue = Number(tokenPrice);
      const convertedAmount = amount / Math.pow(10, Number(decimals));
      const amountUSD = convertedAmount * usdValue;
      if (amountUSD) {
        resolve(amountUSD);
      } else {
        resolve(0);
      }
    });
  }
};

export const getAltRouterUsdAmount = async (
  config: any,
  chainId: number,
  tokenAddress: string,
  amount: number
) => {
  const chainDetail = getChainDetail(chainId);
  let configAlt = {
    method: API_METHOD.GET,
    url:
      config.url === NATIVE_TOKEN_INFO_URL
        ? TOKEN_INFO_URL
        : NATIVE_TOKEN_INFO_URL,
    headers: HEADER_APPLICATION_JSON,
    params:
      config.url === NATIVE_TOKEN_INFO_URL
        ? {
            chain: chainDetail?.id,
            contractAddress: tokenAddress,
          }
        : { ids: chainDetail?.id, vs_currencies: "usd" },
  };
  return new Promise((resolve) => {
    axiosInstance(configAlt).then((res: any) => {
      if (HTTP_SUCCESS_CODES.includes(res.status)) {
        const {
          data: { data },
        } = res;
        const tokenPrice =
          configAlt.url === NATIVE_TOKEN_INFO_URL
            ? data.price
            : data?.token_price?.substring(1, data?.token_price?.length);
        const tokenDecimals = data.isNative
          ? data.token_decimals
          : chainDetail?.nativeToken?.decimals;
        const usdValue = Number(tokenPrice);
        const convertedAmount = amount / Math.pow(10, Number(tokenDecimals));
        const amountUsd = convertedAmount * usdValue;
        if (amountUsd) {
          resolve(amountUsd);
        } else {
          resolve(0);
        }
      }
    });
  });
};

export const getGasPriceInUSD = async (
  chainId: number | string,
  tokenAddress: string,
  type: string,
  estGas?: number,
  gasPrice?: number
) => {
  const tokenInfo = getTokenInfoApi(chainId, tokenAddress);
  const chainDetail = getChainDetail(chainId);
  let gasUSD;
  if (tokenInfo.status) {
    let config = {
      method: API_METHOD.GET,
      url: tokenInfo.url,
      headers: HEADER_APPLICATION_JSON,
      params: tokenInfo.params,
    };
    const usdprice = (await getUniFrontTokenPrice(chainId, [
      tokenAddress,
    ])) as any;
    return new Promise((resolve) => {
      if (type === PROVIDERS.ZEROX) {
        const usdValue = Number(usdprice[0]?.usd);
        const gasInWei = estGas! * gasPrice!;
        const convertedGas =
          gasInWei / Math.pow(10, Number(chainDetail?.nativeToken?.decimals));
        gasUSD = (convertedGas * usdValue) as number;
        if (gasUSD) {
          resolve(gasUSD);
        } else {
          resolve(0);
        }
      } else if (type === PROVIDERS.ONEINCH) {
        gasUSD = (estGas! * 21000) / Math.pow(10, 9);
        if (gasUSD) {
          resolve(0);
        } else {
          resolve(0);
        }
      } else if (type === PROVIDERS.DODO) {
        const usdValue = Number(usdprice[0]?.usd);
        const gwei = estGas! * gasPrice!;
        gasUSD = (gwei * usdValue) as number;
        if (gasUSD) {
          resolve(gasUSD);
        } else {
          resolve(0);
        }
      } else if (type === PROVIDERS.ROUTER) {
        const usdValue = Number(usdprice[0]?.usd);
        const convertedGas =
          estGas! / Math.pow(10, Number(chainDetail?.nativeToken?.decimals));
        gasUSD = (convertedGas * usdValue) as number;
        if (gasUSD) {
          resolve(gasUSD);
        } else {
          resolve(0);
        }
      } else if (type === PROVIDERS.XY) {
        const usdValue = Number(usdprice[0]?.usd);
        gasUSD = estGas! * usdValue;
        if (gasUSD) {
          resolve(gasUSD);
        } else {
          resolve(0);
        }
      }
    });
  }
  return gasUSD as unknown as number;
};

export const getAltGasPriceInUsd = (
  chainId: number | string,
  tokenAddress: string,
  type: string,
  config: any,
  estGas?: number,
  gasPrice?: number
) => {
  let gasUSD;
  const chainDetail = getChainDetail(chainId);
  let configAlt = {
    method: API_METHOD.GET,
    url:
      config.url === NATIVE_TOKEN_INFO_URL
        ? TOKEN_INFO_URL
        : NATIVE_TOKEN_INFO_URL,
    headers: HEADER_APPLICATION_JSON,
    params:
      config.url === NATIVE_TOKEN_INFO_URL
        ? {
            chain: chainDetail?.id,
            contractAddress: tokenAddress,
          }
        : { ids: chainDetail?.id, vs_currencies: "usd" },
  };
  return new Promise((resolve) => {
    axiosInstance(configAlt)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const {
            data: { data },
          } = res;
          if (type === PROVIDERS.ZEROX) {
            const usdValue = Number(
              data.token_price?.substring(1, data?.token_price?.length)
            );
            const gasInWei = estGas! * gasPrice!;
            const convertedGas =
              gasInWei /
              Math.pow(10, Number(chainDetail?.nativeToken?.decimals));
            gasUSD = (convertedGas * usdValue) as number;
            if (gasUSD) {
              resolve(gasUSD);
            } else {
              resolve(0);
            }
          } else if (type === PROVIDERS.ONEINCH) {
            const usdValue = Number(
              data.token_price?.substring(1, data?.token_price?.length)
            );
            gasUSD = (estGas! * 21000) / Math.pow(10, 9);
            if (gasUSD) {
              resolve(0);
            } else {
              resolve(0);
            }
          } else if (type === PROVIDERS.DODO) {
            const usdValue = Number(
              data.token_price?.substring(1, data?.token_price?.length)
            );
            const gwei = estGas! * gasPrice!;
            gasUSD = (gwei * usdValue) as number;
            if (gasUSD) {
              resolve(gasUSD);
            } else {
              resolve(0);
            }
          } else if (type === PROVIDERS.ROUTER) {
            const usdValue = Number(data.price);
            console;
            const convertedGas =
              estGas! /
              Math.pow(10, Number(chainDetail?.nativeToken?.decimals));
            gasUSD = (convertedGas * usdValue) as number;
            if (gasUSD) {
              resolve(gasUSD);
            } else {
              resolve(0);
            }
          } else if (type === PROVIDERS.XY) {
            const usdValue = Number(data.price);
            gasUSD = estGas! * usdValue;
            if (gasUSD) {
              resolve(gasUSD);
            } else {
              resolve(0);
            }
          }
        }
      })
      .catch((e) => {
        console.log("err", e);
      });
  });
};

export const getOceanGasApi = (chainId: number | string) => {
  return `https://ethapi.openocean.finance/v2/${chainId}/gas-price`;
};

export const getXYGasApi = (chain: string, address: string) => {
  return `https://extension-v2.unifront.io/v2/utils/nonce?chain=${chain}&address=${address}`;
};

export const getXYGasLimitApi = (
  chain: string,
  fromAddress: string,
  to: string,
  value: string,
  type: string,
  fromToken: string,
  slippage: string
) => {
  return `https://extension-v2.unifront.io/v2/exchange/${chain}/swap?exchange_type=${type}&taker_address=${fromAddress}&sell_token=${fromToken}&buy_token=${to}&sell_amount=${value}&slippage=${slippage}`;
};

export const getDODOGasLimitApi = (
  chain: string,
  fromAddress: string,
  to: string,
  value: string
) => {
  return `https://extension-v2.unifront.io/v2/utils/getGasLimit?chain=${chain}&from=${fromAddress}&to=${to}&data=0x&value=${value}&action=swap`;
};

export const getXYGasLimit = (
  chain: string,
  fromAddress: string,
  to: string,
  value: string,
  type: string,
  fromToken: string,
  slippage: string
) => {
  let config = {
    method: API_METHOD.GET,
    url:
      type === "xy"
        ? getXYGasLimitApi(
            chain,
            fromAddress,
            to,
            value,
            type,
            fromToken,
            slippage
          )
        : getDODOGasLimitApi(chain, fromAddress, to, value),
    headers: HEADER_APPLICATION_JSON,
  };
  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const {
            data: { data },
          } = res;
          resolve(data);
        }
      })
      .catch((e) => {
        console.log("err", e);
      });
  });
};

export const getXYGas = (chain: string, fromAddress: string) => {
  let config = {
    method: API_METHOD.GET,
    url: getXYGasApi(chain, fromAddress),
    headers: HEADER_APPLICATION_JSON,
  };
  return new Promise((resolve) => {
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const {
            data: { data },
          } = res;
          resolve(data);
        }
      })
      .catch((e) => {
        console.log("err", e);
      });
  });
};

export const getFrontApiGasUSD = async (
  chainId: number,
  fromAddress: string,
  to: string,
  value: string,
  type: string,
  fromToken: string,
  slippage: string
) => {
  const chainDetail = getChainDetail(chainId);
  const gasResponseGas: any = (await getXYGas(
    chainDetail?.id!,
    fromAddress!
  )) as AxiosResponse;
  const valueConverted = Number(value) / Math.pow(10, 18);
  const gasResponseGasLimit: any = (await getXYGasLimit(
    chainDetail?.id!,
    fromAddress!,
    to,
    valueConverted as unknown as string,
    type,
    fromToken,
    slippage
  )) as AxiosResponse;
  const gasFeeCharge =
    (gasResponseGasLimit.gas_limit * gasResponseGas.gas_price.fastest) /
    BASE_UNIT;
  const netfee = getNetworkFee(gasFeeCharge, gasResponseGas.quote_value);
  return new Promise((resolve) => {
    resolve(netfee);
  });
};

export const getNetworkFee = (value: number, quoteValue: number) => {
  let gasValue = value;
  if (quoteValue) {
    gasValue = value * quoteValue;
  }
  const networkFeeQuote = gasValue.toFixed(4);
  return networkFeeQuote as unknown as number;
};
export const getNativeTokenPrice = (chainId: string) => {
  let config = {
    method: API_METHOD.GET,
    url: NATIVE_TOKEN_INFO_URL,
    headers: HEADER_APPLICATION_JSON,
    params: { ids: chainId, vs_currencies: "usd" },
  };
  return new Promise((resolve) =>
    axiosInstance(config).then((res: any) => {
      if (HTTP_SUCCESS_CODES.includes(res.status)) {
        const {
          data: { data },
        } = res;
        resolve(data);
      }
    })
  );
};

export const getAltUsdPriceApi = (
  isBridge: boolean,
  type: string,
  config: any,
  fromChain: number,
  toChain: number,
  chainId: number,
  contractAddress: string
): number => {
  let usdValue: number = 0;
  const chainDetail = getChainDetail(
    isBridge
      ? type === "fromUsd"
        ? Number(fromChain)
        : Number(toChain)
      : chainId
  );
  let configAlt = {
    method: API_METHOD.GET,
    url:
      config.url === NATIVE_TOKEN_INFO_URL
        ? TOKEN_INFO_URL
        : NATIVE_TOKEN_INFO_URL,
    headers: HEADER_APPLICATION_JSON,
    params:
      config.url === NATIVE_TOKEN_INFO_URL
        ? {
            chain: chainDetail?.id,
            contractAddress: contractAddress,
          }
        : { ids: chainDetail?.id, vs_currencies: "usd" },
  };
  axiosInstance(configAlt).then((resAlt: any) => {
    if (HTTP_SUCCESS_CODES.includes(resAlt.status)) {
      const {
        data: { data },
      } = resAlt;
      usdValue = Number(
        configAlt.url === NATIVE_TOKEN_INFO_URL
          ? data.price
          : data.token_price?.substring(1, data.token_price.length)
      );
    }
  });
  return usdValue;
};

export const changeSocketNativeTokenAddress = (
  chainId: number | string,
  tokenAddress: string
): string => {
  const isNativeToken = getTokenInfoApi(chainId, tokenAddress).isNative;
  const needModifications = [137, 10];
  let address = "";
  if (needModifications.includes(Number(chainId))) {
    address =
      chainId === 137 && isNativeToken
        ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        : chainId === 10 &&
          tokenAddress === "0x4200000000000000000000000000000000000006"
        ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
        : tokenAddress;
  } else {
    address = tokenAddress;
  }
  return address;
};

export const callTokenInfoApi = (
  chainId: number | string,
  tokenAddress: string
): Promise<any> => {
  const chainDetail = getChainDetail(chainId);
  let config = {
    method: API_METHOD.GET,
    url: TOKEN_INFO_URL_NEW,
    headers: HEADER_APPLICATION_JSON,
    params: {
      token: tokenAddress,
      range: 1,
      chain: chainDetail?.id,
    },
  };
  return new Promise((resolve) =>
    axiosInstance(config)
      .then(async (res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const {
            data: { data },
          } = res;
          resolve({
            price: data.token.market_data.current_price.usd,
            symbol: data.token.symbol.toUpperCase(),
          });
        } else {
          const altCall = (await altCallTokenInfoApi(
            chainId,
            tokenAddress
          )) as any;
          resolve(altCall);
        }
      })
      .catch(async (e) => {
        const altCall = (await altCallTokenInfoApi(
          chainId,
          tokenAddress
        )) as any;
        resolve(altCall);
      })
  );
};

export const altCallTokenInfoApi = (
  chainId: number | string,
  tokenAddress: string
) => {
  const chainDetail = getChainDetail(chainId);
  let config = {
    method: API_METHOD.GET,
    url: TOKEN_INFO_URL,
    headers: HEADER_APPLICATION_JSON,
    params: { chain: chainDetail?.id, contractAddress: tokenAddress },
  };
  return new Promise((resolve, reject) =>
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const {
            data: { data },
          } = res;
          resolve({
            price: data.token_price,
            symbol: data.token_symbol.toUpperCase(),
          });
        }
      })
      .catch((e) => {
        resolve({
          price: "",
          Symbol: "",
        });
      })
  );
};

export const changeXYNativeTokenAddress = (
  chainId: number | string,
  tokenAddress: string
): string => {
  const isNativeToken = getTokenInfoApi(chainId, tokenAddress).isNative;
  const needModifications = [137, 42161, 1313161554, 1285, 288];
  let address = "";
  if (needModifications.includes(Number(chainId))) {
    address = isNativeToken
      ? "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
      : tokenAddress;
  } else {
    address = tokenAddress;
  }
  return address;
};

export const getFreeTradeCount = (
  chainId: string,
  exchangeType: string,
  account: string
) => {
  const chainDetail = getChainDetail(chainId);
  let config = {
    method: API_METHOD.GET,
    url: `${BASE_EXCHANGE_URL}${chainDetail?.id}/freeTradeCount`,
    headers: HEADER_APPLICATION_JSON,
    params: { exchange_type: exchangeType, account: account },
  };
  return new Promise((resolve, reject) =>
    axiosInstance(config)
      .then((res: any) => {
        if (HTTP_SUCCESS_CODES.includes(res.status)) {
          const {
            data: { data },
          } = res;
          resolve(data.free_trade_count);
        }
      })
      .catch((e) => {
        resolve(0);
      })
  );
};

export const getIsGassless = (
  chainId: string,
  fromAmountUsd: number,
  exchangeType: PROVIDERS
) => {
  const supportedChains = SUPPORTED_CHAINS[exchangeType];
  let supportedChainIds: number[] = [];
  CHAIN_LIST.forEach((chain) => {
    if (supportedChains.includes(chain.id as CHAINS_IDS)) {
      supportedChainIds.push(Number(chain.chainId));
    }
  });

  const chainDetail = getChainDetail(chainId);

  if (
    supportedChainIds.includes(Number(chainId)) &&
    fromAmountUsd >= Number(chainDetail?.minGaslessAmount)
  ) {
    return true;
  } else {
    return false;
  }
};

export const getGaslessTradeCount = async (
  exchangeType: PROVIDERS,
  chainId: string | number,
  fromToken: string,
  tokenPrice: number,
  fromAddress: string
) => {
  const nativeToken = getChainDetail(chainId)?.lifiFeeToken;
  const isFromNativeToken = nativeToken === fromToken.toLocaleLowerCase();

  const isGaslessEnabled = getIsGassless(
    chainId as string,
    Number(tokenPrice),
    exchangeType
  );

  const callFreeTradeCount = !isFromNativeToken && isGaslessEnabled;

  const freeTradeCount = callFreeTradeCount
    ? ((await getFreeTradeCount(
        chainId as string,
        exchangeType,
        fromAddress
      )) as string)
    : "";

  return freeTradeCount;
};

export const getTokenInfoApi = (
  chainId: number | string,
  tokenAddress: string
) => {
  const chainDetail = getChainDetail(chainId);
  if (chainDetail?.id) {
    if (
      NATIVE_TOKEN[chainDetail?.id as CHAINS_IDS].includes(
        tokenAddress.toLocaleLowerCase() as never
      )
    ) {
      return {
        status: true,
        isNative: true,
        url: NATIVE_TOKEN_INFO_URL,
        params: { ids: chainDetail.id, vs_currencies: "usd" },
      };
    } else {
      return {
        status: true,
        isNative: false,
        url: TOKEN_INFO_URL,
        params: { chain: chainDetail.id, contractAddress: tokenAddress },
      };
    }
  }
  return {
    status: false,
    message: "Chain not supported",
  };
};

export const getUniFrontTokenPrice = async (
  chainId: string | number,
  tokenAddress: string[]
) => {
  const chainDet = getChainDetail(chainId);
  const _chainId = chainDet?.id as CHAINS_IDS;
  let arrayString;
  arrayString = tokenAddress
    .map((token) =>
      token === chainDet?.nativeToken?.address ? nativeTokenAddress : token
    )
    .join(",");
  let config = {
    method: API_METHOD.GET,
    url: UNIFRONT_TOKEN_PRICE_URL,
    headers: HEADER_APPLICATION_JSON,
    params: { chain: _chainId, tokens: arrayString },
  };
  return new Promise((resolve, reject) =>
    axiosInstance(config)
      .then((res: any) => {
        const {
          data: {
            data: { rates },
          },
        } = res;
        const usdValue = rates;
        resolve(rates);
      })
      .catch((e) => {
        resolve(0);
      })
  );
};
