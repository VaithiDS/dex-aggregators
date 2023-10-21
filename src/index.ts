import { AxiosResponse } from "axios";
import { getResponse } from "./api";
import {
  API_METHOD,
  CHAINS_IDS,
  DODO_API_KEY,
  DODO_HEADER_APPLICATION_JSON,
  GASLESS_SUPPORTED_PROVIDERS,
  HTTP_SUCCESS_CODES,
  PROVIDERS,
  PROVIDERS_LIST,
  RANGO_API_KEY,
  SOCKET_API_KEY,
  SUPPORTED_CHAINS,
  TOKEN_INFO_DISABLED_PROVIDERS,
  UNIFRONT_PROVIDERS,
  ZERO_X_API_KEY,
} from "./constants";
import {
  AggregatedQuotesResponseType,
  IFormattedResponse,
  IInputParams,
} from "./types";
import {
  getNativeToken,
  getUsdValues,
  getSlippage,
  getProviderUrl,
  getChainDetail,
  getOceanGasApi,
  getTokenInfoApi,
  getGasPriceInUSD,
  getRouterGas,
  getRangoParams,
  filterValidProvider,
  sortByGasFeesAndToAmount,
  hexToNumber,
  getAccecptedNativeTokens,
  changeSocketNativeTokenAddress,
  changeXYNativeTokenAddress,
  getAmountValue,
  getGaslessTradeCount,
  getNativeTokenPrice,
  getGasUsdFromEstLimit,
  getUniFrontTokenPrice,
} from "./utils/";

class DexAggregators {
  fromChain: string | undefined;
  toChain: string | undefined;
  fromToken: string;
  toToken: string;
  amount: string | number;
  fromDecimals: number;
  toDecimals: number;
  slippage: number;
  fromAddress: string | undefined;
  toAddress: string | undefined;
  response: Array<unknown>;
  chainId: number | string;
  gasPrice: number;
  fromUsd: number | string;
  toUsd: number | string;
  rpc: string | undefined;
  fromId: string | undefined;
  callback: Function | undefined;
  id: string;
  constructor(params: IInputParams) {
    this.fromChain = params.fromChain;
    this.toChain = params.toChain;
    this.fromAddress = params.fromAddress;
    this.toAddress = params.toAddress;
    this.fromToken = params.fromToken;
    this.toToken = params.toToken;
    this.amount = BigInt(parseInt(String(params.amount))).toString();
    this.fromDecimals = params.fromDecimals;
    this.toDecimals = params.toDecimals;
    this.slippage = params.slippage ?? 0.1;
    this.chainId = params.chainId;
    this.rpc = params.rpc;
    this.response = [];
    this.gasPrice = params.gasPrice ?? 0;
    this.fromUsd = "";
    this.toUsd = "";
    this.callback = params.callback;
    this.id = params.id;
  }

  isBridge = () => {
    return this.fromChain && this.toChain && this.fromChain !== this.toChain;
  };

  private async get0xQuote(): Promise<IFormattedResponse> {
    const nativeTokenAddress = getChainDetail(this.chainId)?.nativeToken
      ?.address;
    const data = {
      payload: {
        buyToken: getNativeToken(PROVIDERS.ZEROX, this.toToken),
        sellToken: getNativeToken(PROVIDERS.ZEROX, this.fromToken),
        sellAmount: this.amount,
        slippagePercentage: getSlippage(PROVIDERS.ZEROX, this.slippage),
        affiliateAddress: "0x75542808465f2dfabf147247d645bddcfe18c623",
        enableSlippageProtection: false,
      },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.ZEROX, this.chainId),
      requestHeader: {
        "0x-api-key": ZERO_X_API_KEY,
      },
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const { data } = response;
        const formatterInput = {
          provider: PROVIDERS.ZEROX,
          fromToken: data.sellTokenAddress,
          toToken: data.buyTokenAddress,
          toAmount: data.buyAmount,
          estimatedGasFees: data.estimatedGas,
          fromAmountUsd: 0,
          toAmountUsd: 0,
          gasUsd: (await getGasPriceInUSD(
            this.chainId,
            nativeTokenAddress as string,
            PROVIDERS.ZEROX,
            data.estimatedGas,
            data.gasPrice
          )) as number | string,
          toolName: PROVIDERS_LIST[PROVIDERS.ZEROX].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.ZEROX].logo,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          false
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.ZEROX) as IFormattedResponse
          );
        });
      }
    } catch (e) {
      return new Promise((resolve, reject) => {
        resolve(this.getFailedResponse(PROVIDERS.ZEROX) as IFormattedResponse);
      });
    }
  }

  private async getparaswapQuote() {
    const data = {
      payload: {
        srcToken: getNativeToken(PROVIDERS.PARASWAP, this.fromToken),
        destToken: getNativeToken(PROVIDERS.PARASWAP, this.toToken),
        amount: this.amount,
        srcDecimals: this.fromDecimals,
        destDecimals: this.toDecimals,
        partner: "frontier",
        side: "SELL",
        network: this.chainId,
      },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.PARASWAP, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const {
          data: { priceRoute },
        } = response;
        const formatterInput = {
          provider: PROVIDERS.PARASWAP,
          fromToken: priceRoute.srcToken,
          toToken: priceRoute.destToken,
          toAmount: priceRoute.destAmount,
          estimatedGasFees: priceRoute.gasCost,
          fromAmountUsd: Number(priceRoute.srcUSD),
          toAmountUsd: Number(priceRoute.destUSD),
          gasUsd: Number(priceRoute.gasCostUSD),
          toolName: PROVIDERS_LIST[PROVIDERS.PARASWAP].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.PARASWAP].logo,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.PARASWAP) as IFormattedResponse
          );
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(
          this.getFailedResponse(PROVIDERS.PARASWAP) as IFormattedResponse
        );
      });
    }
  }

  // public async getCowswapQuote() {
  //   const data = {
  //     payload: {
  //       sellToken: this.fromToken,
  //       buyToken: this.toToken,
  //       receiver: this.toAddress,
  //       partiallyFillable: false,
  //       sellTokenBalance: "erc20",
  //       buyTokenBalance: "erc20",
  //       from: this.fromAddress,
  //       signingScheme: "ethsign",
  //       kind: "sell",
  //       sellAmountBeforeFee: String(this.amount),
  //     },
  //     method: API_METHOD.POST,
  //     url: getProviderUrl(PROVIDERS.COWSWAP, this.chainId),,
  //   };
  //   try {
  //     const response = (await postResponse(data)) as AxiosResponse;
  //     if (HTTP_SUCCESS_CODES.includes(response.status)) {
  //       const {
  //         data: { quote },
  //       } = response;
  //       const formatterInput = {
  //         provider: PROVIDERS.COWSWAP,
  //         fromToken: quote.sellToken,
  //         toToken: quote.buyToken,
  //         toAmount: quote.buyAmount,
  //         estimatedGasFees: "",
  //         fromAmountUsd: "",
  //         toAmountUsd: "",
  //         gasUsd: "",
  //         toolName: PROVIDERS_LIST[PROVIDERS.COWSWAP].name,
  //         toolLogoUrl: PROVIDERS_LIST[PROVIDERS.COWSWAP].logo,
  //       };
  //       const formatterRes = await this.getFormatterResponse(
  //         formatterInput,
  //         false
  //       );
  //       return new Promise((resolve, reject) => {
  //         resolve(formatterRes);
  //       });
  //     } else {
  //       return new Promise((resolve, reject) => {
  //         resolve(
  //           this.getFailedResponse(PROVIDERS.COWSWAP) as IFormattedResponse
  //         );
  //       });
  //     }
  //   } catch {
  //     return new Promise((resolve, reject) => {
  //       resolve(
  //         this.getFailedResponse(PROVIDERS.COWSWAP) as IFormattedResponse
  //       );
  //     });
  //   }
  // }

  private async get1inchQuote() {
    const data = {
      payload: {
        fromTokenAddress: getNativeToken(PROVIDERS.ONEINCH, this.fromToken),
        toTokenAddress: getNativeToken(PROVIDERS.ONEINCH, this.toToken),
        amount: this.amount,
        slippage: getSlippage(PROVIDERS.ONEINCH, this.slippage),
      },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.ONEINCH, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const { data } = response;
        const chainDet = await getChainDetail(this.chainId);
        const natTokenPrice = (await getNativeTokenPrice(
          chainDet?.id as string
        )) as any;
        const gasPrice = this.rpc
          ? ((await getGasUsdFromEstLimit(
              this.rpc as string,
              natTokenPrice.price,
              data.estimatedGas,
              Number(chainDet?.lifiFeeDecimals)
            )) as any)
          : "";
        const formatterInput = {
          provider: PROVIDERS.ONEINCH,
          fromToken: data?.fromToken?.address,
          toToken: data.toToken?.address,
          toAmount: data.toTokenAmount,
          estimatedGasFees: String(data.estimatedGas),
          fromAmountUsd: 0,
          toAmountUsd: 0,
          gasUsd: gasPrice,
          toolName: PROVIDERS_LIST[PROVIDERS.ONEINCH].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.ONEINCH].logo,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          false
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.ONEINCH) as IFormattedResponse
          );
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(
          this.getFailedResponse(PROVIDERS.ONEINCH) as IFormattedResponse
        );
      });
    }
  }

  private async getopenOceanQuote() {
    const gasResponse = await getResponse({
      method: API_METHOD.GET,
      url: getOceanGasApi(this.chainId),
      payload: {},
    });
    const data = {
      payload: {
        outTokenAddress: this.fromToken,
        inTokenAddress: this.toToken,
        amount: this.amount,
        gasPrice:
          (gasResponse as AxiosResponse).data?.fast?.maxFeePerGas ??
          this.gasPrice,
        slippage: getSlippage(PROVIDERS.OPENOCEAN, this.slippage),
        account: this.fromToken,
      },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.OPENOCEAN, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const {
          data: { data },
        } = response;
        const formatterInput = {
          provider: PROVIDERS.OPENOCEAN,
          fromToken: data?.outToken?.address,
          toToken: data?.inToken?.address,
          toAmount: data?.outAmount,
          estimatedGasFees: String(data?.estimatedGas),
          fromAmountUsd: 0,
          toAmountUsd: 0,
          gasUsd: 0,
          toolName: PROVIDERS_LIST[PROVIDERS.OPENOCEAN].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.OPENOCEAN].logo,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          false
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.OPENOCEAN) as IFormattedResponse
          );
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(
          this.getFailedResponse(PROVIDERS.OPENOCEAN) as IFormattedResponse
        );
      });
    }
  }

  private async getkyberQuote() {
    const data = {
      payload: {
        tokenIn: getNativeToken(PROVIDERS.KYBERSWAP, this.fromToken),
        tokenOut: getNativeToken(PROVIDERS.KYBERSWAP, this.toToken),
        amountIn: this.amount,
        to: this.fromAddress,
        saveGas: 0,
        gasInclude: 0,
        slippageTolerance: getSlippage(PROVIDERS.KYBERSWAP, this.slippage),
        clientData: { source: "Frontier" },
      },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.KYBERSWAP, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const { data } = response;
        const formatterInput = {
          provider: PROVIDERS.KYBERSWAP,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toAmount: data.outputAmount,
          estimatedGasFees: String(data.gasPriceGwei),
          fromAmountUsd: data.amountInUsd,
          toAmountUsd: data.amountOutUsd,
          gasUsd: data.gasUsd,
          toolName: PROVIDERS_LIST[PROVIDERS.KYBERSWAP].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.KYBERSWAP].logo,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.KYBERSWAP) as IFormattedResponse
          );
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(
          this.getFailedResponse(PROVIDERS.KYBERSWAP) as IFormattedResponse
        );
      });
    }
  }

  private async getdodoQuote() {
    const chainRPC = getChainDetail(this.chainId)?.info?.rpc;
    const data = {
      payload: {
        fromTokenAddress: this.fromToken,
        fromTokenDecimals: this.fromDecimals,
        toTokenAddress: this.toToken,
        toTokenDecimals: this.toDecimals,
        fromAmount: this.amount,
        slippage: getSlippage(PROVIDERS.DODO, this.slippage),
        userAddr: this.fromAddress,
        chainId: this.chainId,
        rpc: this.rpc ? this.rpc : chainRPC,
        apikey: DODO_API_KEY,
      },
      headers: DODO_HEADER_APPLICATION_JSON,
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.DODO, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const {
          data: { data },
        } = response;
        const gasUSD = 0;
        const formatterInput = {
          provider: PROVIDERS.DODO,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toAmount: String(
            data.resAmount * Math.pow(10, this.toDecimals)
          ) as any,
          estimatedGasFees: "",
          fromAmountUsd: 0,
          toAmountUsd: 0,
          priceImpact: data.priceImpact,
          gasUsd: Number(gasUSD),
          toolName: PROVIDERS_LIST[PROVIDERS.DODO].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.DODO].logo,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          false,
          PROVIDERS.DODO
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(this.getFailedResponse(PROVIDERS.DODO) as IFormattedResponse);
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(this.getFailedResponse(PROVIDERS.DODO) as IFormattedResponse);
      });
    }
  }

  private async getrangoQuote(): Promise<IFormattedResponse> {
    const params = (await getRangoParams(
      Number(this.fromChain),
      this.fromToken,
      Number(this.toChain),
      this.toToken
    )) as any;
    const data = {
      payload: this.isBridge()
        ? {
            apiKey: RANGO_API_KEY,
            from: params.from,
            to: params.to,
            amount: this.amount,
            fromAddress: this.fromAddress,
            toAddress: this.toAddress,
            disableEstimate: true,
            slippage: 1,
          }
        : {
            fromChain: this.chainId,
            toChain: this.chainId,
            fromToken: this.fromToken,
            toToken: this.toAddress,
            fromAddress: this.fromAddress,
            fromAmount: this.amount,
            slippage: getSlippage(PROVIDERS.RANGO, this.slippage),
          },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.RANGO, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const {
          data: { estimate },
          data,
        } = response;
        if (!data) {
          return new Promise((resolve, reject) => {
            resolve(
              this.getFailedResponse(PROVIDERS.RANGO) as IFormattedResponse
            );
          });
        } else if (data.error) {
          return new Promise((resolve, reject) => {
            resolve(
              this.getFailedResponse(PROVIDERS.RANGO) as IFormattedResponse
            );
          });
        }

        const fromAmountUSD = getAmountValue(
          Number(this.amount),
          Number(data.route.from.decimals),
          Number(this.fromUsd)
        );

        const baseInput = {
          toolName: PROVIDERS_LIST[PROVIDERS.RANGO].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.RANGO].logo,
          provider: PROVIDERS.RANGO,
          fromToken: this.fromToken,
          toToken: this.toToken,
        };
        const formatterInput = this.isBridge()
          ? {
              ...baseInput,
              approvalAddress: data.tx.txTo,
              executionDuration: data.route.estimatedTimeInSeconds,

              fromAmount: this.amount as string,
              toAmount: data.route.outputAmount,
              toAmountMin: data.route.outputAmountMin,
              estimatedGasFees: "",
              fromAmountUsd: Number(fromAmountUSD),
              toAmountUsd: data.route.outputAmountUsd,
              gasUsd: data.route.feeUsd,
              fromTokenDecimals: data.route.from.decimals,
              toTokenDecimals: data.route.to.decimals,
              routing: {
                name: data.route.swapper.id,
                logo: data.route.swapper.logo,
              },
            }
          : {
              ...baseInput,
              toAmount: estimate.toAmount,
              estimatedGasFees: "",
              fromAmountUsd: Number(estimate.fromAmountUSD),
              toAmountUsd: Number(estimate.toAmountUSD),
              gasUsd: estimate?.gasCosts?.[0].amountUSD
                ? Number(estimate?.gasCosts?.[0].amountUSD)
                : "",
            };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.RANGO) as IFormattedResponse
          );
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(this.getFailedResponse(PROVIDERS.RANGO) as IFormattedResponse);
      });
    }
  }

  private async getrouterQuote(): Promise<IFormattedResponse> {
    const nativeToken = getChainDetail(Number(this.fromChain));
    const accecptedNativeTokens = (await getAccecptedNativeTokens(
      String(this.fromChain!)
    )) as boolean;
    const toAccecptedNativeTokens = (await getAccecptedNativeTokens(
      String(this.toChain!)
    )) as boolean;
    const destNativeToken = getChainDetail(Number(this.toChain));

    const data = {
      payload: this.isBridge()
        ? {
            fromTokenChainId: this.fromChain,
            toTokenChainId: this.toChain,
            fromTokenAddress: getTokenInfoApi(
              Number(this.fromChain),
              this.fromToken
            ).isNative
              ? nativeToken?.wrappedNativeTokenAddress
              : this.fromToken,
            toTokenAddress: getTokenInfoApi(Number(this.toChain), this.toToken)
              .isNative
              ? destNativeToken?.wrappedNativeTokenAddress
              : this.toToken,
            amount: this.amount,
            userAddress: this.fromAddress,
            slippage: getSlippage(PROVIDERS.ROUTER, this.slippage),
          }
        : {
            fromChain: this.chainId,
            toChain: this.chainId,
            fromToken: this.fromToken,
            toToken: this.toAddress,
            fromAddress: this.fromAddress,
            fromAmount: this.amount,
            slippage: getSlippage(PROVIDERS.ROUTER, this.slippage),
          },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.ROUTER, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const {
          data: { estimate },
          data,
        } = response;
        if (!data) {
          return new Promise((resolve, reject) => {
            resolve(
              this.getFailedResponse(PROVIDERS.ROUTER) as IFormattedResponse
            );
          });
        }
        const gasResponse = (await getRouterGas(
          this.fromChain!,
          this.toChain!
        )) as any;

        const fromAmountUSD = getAmountValue(
          Number(data.source.tokenAmount),
          Number(data.source.asset.decimals),
          Number(this.fromUsd)
        );

        const toAmountUSD = getAmountValue(
          Number(data.destination.tokenAmount),
          Number(data.destination.asset.decimals),
          Number(this.toUsd)
        );

        const gasToken = gasResponse.filter(
          (gas: { token: any }) => gas.token === data.txn.feeToken
        )[0];

        const tokenForGasPrice = nativeToken?.nativeToken?.address;

        const gasPrice = (await getGasPriceInUSD(
          Number(this.fromChain!),
          tokenForGasPrice!,
          "router",
          gasToken.transferFee
        )) as number | string;

        const minRecieved: number =
          data.destination.tokenAmount -
          (this.slippage / 100) * data.destination.tokenAmount;

        const baseInput = {
          provider: PROVIDERS.ROUTER,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toolName: PROVIDERS_LIST[PROVIDERS.ROUTER].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.ROUTER].logo,
        };

        const formatterInput = this.isBridge()
          ? {
              ...baseInput,
              approvalAddress: "0x6e14f48576265272B6CAA3A7cC500a26050Be64E",
              executionDuration: 200 as any,

              fromAmount: data.source.tokenAmount,
              toAmount: data.destination.tokenAmount,
              toAmountMin: minRecieved as unknown as string,
              estimatedGasFees: "",
              fromAmountUsd: Number(fromAmountUSD),
              toAmountUsd: Number(toAmountUSD),
              gasUsd: Number(gasPrice),
              fromTokenDecimals: data.source.asset.decimals,
              toTokenDecimals: data.destination.asset.decimals,
              bridgeFee: {
                amount: gasToken.transferFee,
                amountUsd: Number(gasPrice),
                symbol: String(nativeToken?.wrappedNativeToken),
                contract_address: data.txn.feeToken,
                token_decimals: nativeToken?.nativeToken?.decimals,
              },
              routing: {
                name: PROVIDERS_LIST[PROVIDERS.ROUTER].name,
                logo: PROVIDERS_LIST[PROVIDERS.ROUTER].logo,
              },
            }
          : {
              ...baseInput,
              toAmount: estimate.toAmount,
              estimatedGasFees: "",
              fromAmountUsd: Number(estimate.fromAmountUSD),
              toAmountUsd: Number(estimate.toAmountUSD),
              gasUsd: estimate?.gasCosts?.[0].amountUSD
                ? Number(estimate?.gasCosts?.[0].amountUSD)
                : "",
            };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.ROUTER) as IFormattedResponse
          );
        });
      }
    } catch (e) {
      return new Promise((resolve, reject) => {
        resolve(this.getFailedResponse(PROVIDERS.ROUTER) as IFormattedResponse);
      });
    }
  }
  private async getsocketQuote(): Promise<IFormattedResponse> {
    const fromToken = changeSocketNativeTokenAddress(
      Number(this.fromChain),
      this.fromToken
    );
    const toToken = changeSocketNativeTokenAddress(
      Number(this.toChain),
      this.toToken
    );
    const data = {
      payload: {
        fromChainId: this.fromChain,
        toChainId: this.toChain,
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        userAddress: this.fromAddress,
        recipient: this.toAddress,
        fromAmount: this.amount,
        sort: "output",
        uniqueRoutesPerBridge: true,
        singleTxOnly: true,
        defaultBridgeSlippage: this.slippage,
        defaultSwapSlippage: this.slippage,
      },
      method: API_METHOD.GET,
      requestHeader: {
        "api-key": SOCKET_API_KEY,
      },
      url: getProviderUrl(PROVIDERS.SOCKET, this.chainId),
    };

    const getValue = (a: number, b: number) => {
      return a - b;
    };

    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const { data } = response;
        const { routes } = data.result;

        routes.sort((a: any, b: any) => {
          const aValue = getValue(b.outputValueInUsd, b.totalGasFeesInUsd);
          const bValue = getValue(a.outputValueInUsd, a.totalGasFeesInUsd);
          return aValue - bValue;
        });
        const routeDetail = routes[0];
        const userTxData = routeDetail.userTxs[0];
        const hasApprovalData = !!userTxData.approvalData;
        const bridgeStep: any = userTxData.steps.filter(
          (step: { type: string }) => step.type === "bridge"
        )[0];
        const bridgeFeeAmount =
          bridgeStep?.protocolFees?.amount < 0
            ? 0
            : bridgeStep?.protocolFees?.amount;
        const minAmount =
          routeDetail.toAmount - (routeDetail.toAmount * this.slippage) / 100;

        if (!data) {
          return new Promise((resolve, reject) => {
            resolve(
              this.getFailedResponse(PROVIDERS.SOCKET) as IFormattedResponse
            );
          });
        }
        const baseInput = {
          provider: PROVIDERS.SOCKET,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toolName: PROVIDERS_LIST[PROVIDERS.SOCKET].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.SOCKET].logo,
        };

        const formatterInput = {
          ...baseInput,
          approvalAddress: hasApprovalData
            ? userTxData.approvalData.allowanceTarget
            : this.toToken,
          toAmountMin: userTxData.minAmountOut
            ? userTxData.minAmountOut
            : minAmount,
          fromTokenDecimals: data.result.fromAsset.decimals,
          toTokenDecimals: data.result.toAsset.decimals,
          executionDuration: routeDetail.serviceTime
            ? routeDetail.serviceTime
            : routeDetail.maxServiceTime,

          fromAmount: routeDetail.fromAmount,
          toAmount: routeDetail.toAmount,
          estimatedGasFees: "",
          fromAmountUsd: routeDetail.inputValueInUsd,
          toAmountUsd: routeDetail.outputValueInUsd,
          gasUsd: bridgeStep?.protocolFees?.feesInUsd
            ? bridgeStep.protocolFees.feesInUsd
            : 0,
          bridgeFee: {
            amount: bridgeFeeAmount ? bridgeFeeAmount : "",
            amountUsd: bridgeStep?.protocolFees?.feesInUsd
              ? bridgeStep.protocolFees.feesInUsd
              : 0,
            symbol: bridgeStep?.protocolFees.asset.symbol
              ? bridgeStep.protocolFees.asset.symbol
              : "",
            contract_address: bridgeStep?.protocolFees.asset.address
              ? bridgeStep.protocolFees.asset.address
              : "",
            token_decimals: bridgeStep?.protocolFees.asset.decimals
              ? bridgeStep.protocolFees.asset.decimals
              : "",
          },
          routing: {
            name: PROVIDERS_LIST[PROVIDERS.SOCKET].name,
            logo: PROVIDERS_LIST[PROVIDERS.SOCKET].logo,
          },
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.SOCKET) as IFormattedResponse
          );
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(this.getFailedResponse(PROVIDERS.SOCKET) as IFormattedResponse);
      });
    }
  }

  private async getdebridgeQuote(): Promise<IFormattedResponse> {
    const nativeToken = getChainDetail(Number(this.fromChain));
    const data = {
      payload: {
        srcChainId: this.fromChain,
        dstChainId: this.toChain,
        srcChainTokenIn: getTokenInfoApi(Number(this.fromChain), this.fromToken)
          .isNative
          ? "0x0000000000000000000000000000000000000000"
          : this.fromToken,
        dstChainTokenOut: getTokenInfoApi(Number(this.toChain), this.toToken)
          .isNative
          ? "0x0000000000000000000000000000000000000000"
          : this.toToken,
        srcChainTokenInAmount: this.amount,
        dstChainTokenOutRecipient: this.toAddress,
        dstChainFallbackAddress: this.toAddress,
        slippage: this.slippage,
        executionFeeAmount: "auto",
      },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.DEBRIDGE, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const { data } = response;
        if (!data) {
          return new Promise((resolve, reject) => {
            resolve(
              this.getFailedResponse(PROVIDERS.DEBRIDGE) as IFormattedResponse
            );
          });
        }
        const fromAmountUSD = getAmountValue(
          Number(data.estimation.srcChainTokenIn.amount),
          Number(data.estimation.srcChainTokenIn.decimals),
          Number(this.fromUsd)
        );
        const toAmountUSD = getAmountValue(
          Number(data.estimation.dstChainTokenOut.amount),
          Number(data.estimation.dstChainTokenOut.decimals),
          Number(this.toUsd)
        );
        const baseInput = {
          provider: PROVIDERS.DEBRIDGE,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toolName: PROVIDERS_LIST[PROVIDERS.DEBRIDGE].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.DEBRIDGE].logo,
        };
        const formatterInput = {
          ...baseInput,
          approvalAddress: data.tx.to,
          toAmountMin: data.estimation.dstChainTokenOut.minAmount,
          fromTokenDecimals: data.estimation.srcChainTokenIn.decimals,
          toTokenDecimals: data.estimation.dstChainTokenOut.decimals,
          executionDuration: data.estimation.ETA,
          fromAmount: data.estimation.srcChainTokenIn.amount,
          toAmount: data.estimation.dstChainTokenOut.amount,
          estimatedGasFees: "",
          fromAmountUsd: Number(fromAmountUSD),
          toAmountUsd: Number(toAmountUSD),
          gasUsd:
            Number(data.estimation.executionFee.recommendedAmount) /
            Math.pow(10, Number(data.estimation.executionFee.token.decimals)),
          bridgeFee: data.estimation
            ? {
                amount: data.estimation.executionFee.recommendedAmount,
                token_decimals: data.estimation.executionFee.token.decimals,
                amountUsd:
                  Number(data.estimation.executionFee.recommendedAmount) /
                  Math.pow(
                    10,
                    Number(data.estimation.executionFee.token.decimals)
                  ),
                symbol: data.estimation.executionFee.token.symbol,
                contract_address: data.estimation.executionFee.token.address,
              }
            : "",
          routing: {
            name: PROVIDERS_LIST[PROVIDERS.DEBRIDGE].name,
            logo: PROVIDERS_LIST[PROVIDERS.DEBRIDGE].logo,
          },
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.DEBRIDGE) as IFormattedResponse
          );
        });
      }
    } catch (e) {
      console.log(e);
      return new Promise((resolve, reject) => {
        resolve(
          this.getFailedResponse(PROVIDERS.DEBRIDGE) as IFormattedResponse
        );
      });
    }
  }

  private async getlifiQuote(): Promise<IFormattedResponse> {
    const accecptedNativeTokens = (await getAccecptedNativeTokens(
      String(this.fromChain!)
    )) as boolean;
    const data = {
      payload: this.isBridge()
        ? {
            fromChain: this.fromChain,
            toChain: this.toChain,
            fromToken: this.fromToken,
            toToken: this.toToken,
            fromAddress: this.fromAddress,
            fromAmount: this.amount,
            slippage: getSlippage(PROVIDERS.LIFI, this.slippage),
          }
        : {
            fromChain: this.chainId,
            toChain: this.chainId,
            fromToken: this.fromToken,
            toToken: this.toToken,
            fromAddress: this.fromAddress,
            fromAmount: this.amount,
            slippage: getSlippage(PROVIDERS.LIFI, this.slippage),
          },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.LIFI, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const {
          data: { estimate, transactionRequest, action },
          data,
        } = response;
        if (!data) {
          return new Promise((resolve, reject) => {
            resolve(
              this.getFailedResponse(PROVIDERS.LIFI) as IFormattedResponse
            );
          });
        }
        const includedStepsLength = data.includedSteps.length - 1;
        const gasCostLength = estimate?.gasCosts?.length - 1;
        const baseInput = {
          provider: PROVIDERS.LIFI,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toolName: PROVIDERS_LIST[PROVIDERS.LIFI].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.LIFI].logo,
        };
        const nativeToken = getChainDetail(Number(this.fromChain));
        const isNativeToken = getTokenInfoApi(
          this.fromChain!,
          this.fromToken
        ).isNative;

        const tokenPrice = this.isBridge()
          ? isNativeToken
            ? ("" as any)
            : ((await getUniFrontTokenPrice(Number(nativeToken?.chainId), [
                nativeToken?.nativeToken?.address as string,
              ])) as any)
          : "";

        const gas = hexToNumber(transactionRequest.value);
        const gwei = isNativeToken ? Number(this.amount) - gas : gas;
        const gweiFormatted = String(gwei).replace("-", "");
        const tokenUsdPrice = isNativeToken
          ? action.fromToken.priceUSD
          : tokenPrice[0]?.usd;

        const gasAmount =
          Number(gweiFormatted) /
          Math.pow(10, Number(nativeToken?.lifiFeeDecimals));

        const gasAmountUsd = gasAmount * tokenUsdPrice;

        const formatterInput = this.isBridge()
          ? {
              ...baseInput,
              approvalAddress: estimate.approvalAddress,
              executionDuration: estimate.executionDuration,
              fromAmount: estimate.fromAmount,
              toAmount: estimate.toAmount,
              toAmountMin: estimate.toAmountMin,
              estimatedGasFees: "",
              fromAmountUsd: Number(estimate.fromAmountUSD),
              toAmountUsd: Number(estimate.toAmountUSD),
              gasUsd: gasAmountUsd,
              fromTokenDecimals:
                data.includedSteps[includedStepsLength].action.fromToken
                  .decimals,
              toTokenDecimals:
                data.includedSteps[includedStepsLength].action.toToken.decimals,
              bridgeFee: {
                amount: gweiFormatted,
                amountUsd: gasAmountUsd,
                symbol: nativeToken?.lifiFeeSymbol!,
                contract_address: nativeToken?.lifiFeeToken,
                token_decimals: nativeToken?.lifiFeeDecimals,
              },
              routing: {
                name: data.toolDetails.name,
                logo: data.toolDetails.logoURI,
              },
            }
          : {
              ...baseInput,
              toAmount: estimate.toAmount,
              estimatedGasFees: "",
              fromAmountUsd: Number(estimate.fromAmountUSD),
              toAmountUsd: Number(estimate.toAmountUSD),
              gasUsd: estimate?.gasCosts?.[0].amountUSD
                ? Number(estimate?.gasCosts?.[0].amountUSD)
                : "",
            };

        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );

        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(this.getFailedResponse(PROVIDERS.LIFI) as IFormattedResponse);
        });
      }
    } catch (e) {
      console.log(e);
      return new Promise((resolve, reject) => {
        resolve(this.getFailedResponse(PROVIDERS.LIFI) as IFormattedResponse);
      });
    }
  }

  private async getxyQuote(): Promise<IFormattedResponse> {
    const chainDetail = getChainDetail(this.chainId);
    const fromToken = changeXYNativeTokenAddress(
      Number(this.fromChain),
      this.fromToken
    );
    const toToken = changeXYNativeTokenAddress(
      Number(this.toChain),
      this.toToken
    );
    const data = {
      payload: this.isBridge()
        ? {
            srcChainId: this.fromChain,
            destChainId: this.toChain,
            fromTokenAddress: fromToken,
            toTokenAddress: toToken,
            amount: this.amount,
            slippage: this.slippage,
          }
        : {
            srcChainId: this.chainId,
            destChainId: this.chainId,
            fromTokenAddress: this.fromToken,
            toTokenAddress: this.toToken,
            amount: this.amount,
          },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.XY, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;

      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const { data } = response;
        if (!data.isSuccess) {
          return new Promise((resolve, reject) => {
            resolve(this.getFailedResponse(PROVIDERS.XY) as IFormattedResponse);
          });
        }
        let gasFee: number | string = "";
        if (data.xyFee.symbol === "ETH") {
          const gasUsd = (await getGasPriceInUSD(
            1,
            "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            PROVIDERS.XY,
            data.xyFee.amount
          )) as any;
          gasFee = gasUsd;
        } else if (data.xyFee.symbol === "USDC" || "USDT") {
          gasFee = data.xyFee.amount;
        } else {
          gasFee = "";
        }

        const fromDecimal = data.quote.sourceChainSwaps
          ? data.quote.sourceChainSwaps.fromToken.decimals
          : data.quote.crossChainSwap.fromToken.decimals;

        const toDecimal = data.quote.destChainSwaps
          ? data.quote.destChainSwaps.toToken.decimals
          : data.quote.crossChainSwap.toToken.decimals;

        const baseInput = {
          provider: PROVIDERS.XY,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toolName: PROVIDERS_LIST[PROVIDERS.XY].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.XY].logo,
        };
        const formatterInput = this.isBridge()
          ? {
              ...baseInput,
              approvalAddress: data.contractAddress,
              executionDuration: data.estimatedTransferTime
                ? data.estimatedTransferTime
                : "",
              fromAmount: data.fromTokenAmount,
              toAmount: data.toTokenAmount,
              toAmountMin: String(
                data.minimumReceived * Math.pow(10, toDecimal)
              ),
              estimatedGasFees: data.estimatedGas,
              fromAmountUsd: Number(data.fromTokenValue),
              toAmountUsd: Number(data.toTokenValue),
              gasUsd: gasFee,
              fromTokenDecimals: fromDecimal,
              toTokenDecimals: toDecimal,
              //token decimals are not provided in the quote.
              // bridgeFee: {
              //   amount: data.xyFee.amount,
              //   amountUsd: gasFee,
              //   symbol: data.xyFee.symbol,
              // },
              bridgeFee: "",
              routing: {
                name: PROVIDERS_LIST[PROVIDERS.XY].name,
                logo: PROVIDERS_LIST[PROVIDERS.XY].logo,
              },
            }
          : {
              ...baseInput,
              toAmount: data.toTokenAmount,
              estimatedGasFees: "",
              fromAmountUsd: Number(data.fromTokenValue),
              toAmountUsd: Number(data.toTokenValue),
              gasUsd: gasFee,
            };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );

        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(this.getFailedResponse(PROVIDERS.XY) as IFormattedResponse);
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(this.getFailedResponse(PROVIDERS.XY) as IFormattedResponse);
      });
    }
  }

  private async getNetSwapQuote(): Promise<IFormattedResponse> {
    const data = {
      payload: {
        srcChainId: this.chainId,
        destChainId: this.chainId,
        fromTokenAddress: this.fromToken,
        toTokenAddress: this.toToken,
        amount: this.amount,
      },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.NETSWAP, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const { data } = response;
        if (!data.isSuccess) {
          return new Promise((resolve, reject) => {
            resolve(
              this.getFailedResponse(PROVIDERS.NETSWAP) as IFormattedResponse
            );
          });
        }
        const formatterInput = {
          provider: PROVIDERS.NETSWAP,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toAmount: data.toTokenAmount,
          estimatedGasFees: "",
          fromAmountUsd: Number(data.fromTokenValue),
          toAmountUsd: Number(data.toTokenValue),
          gasUsd: 0,
          toolName: PROVIDERS_LIST[PROVIDERS.NETSWAP].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.NETSWAP].logo,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.NETSWAP) as IFormattedResponse
          );
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(
          this.getFailedResponse(PROVIDERS.NETSWAP) as IFormattedResponse
        );
      });
    }
  }

  private async getjupiterQuote(): Promise<IFormattedResponse> {
    const data = {
      payload: {
        inputMint: this.fromToken,
        outputMint: this.toToken,
        amount: parseInt(String(this.amount)),
        slippageBps: getSlippage(PROVIDERS.JUPITER, this.slippage),
      },
      method: API_METHOD.GET,
      url: getProviderUrl(PROVIDERS.JUPITER, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const {
          data: { data },
        } = response;
        const formatterInput = {
          provider: PROVIDERS.JUPITER,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toAmount: data?.[0]?.outAmount ?? "0",
          estimatedGasFees: "0",
          fromAmountUsd: 0,
          toAmountUsd: 0,
          gasUsd: 0,
          toolName: PROVIDERS_LIST[PROVIDERS.JUPITER].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.JUPITER].logo,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          false
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.JUPITER) as IFormattedResponse
          );
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(
          this.getFailedResponse(PROVIDERS.JUPITER) as IFormattedResponse
        );
      });
    }
  }

  private async getSwapQuote(
    exchangeType: PROVIDERS
  ): Promise<IFormattedResponse> {
    const data = {
      payload: {
        exchange_type: exchangeType,
        taker_address: this.fromAddress,
        sell_token: this.fromToken,
        buy_token: this.toToken,
        sell_amount: Number(this.amount) / Math.pow(10, this.fromDecimals),
        slippage: this.slippage,
      },
      method: API_METHOD.GET,
      url: getProviderUrl(exchangeType, this.chainId),
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const {
          data: res,
          data: { data },
        } = response;

        const freeTradeCount = GASLESS_SUPPORTED_PROVIDERS.includes(
          exchangeType
        )
          ? await getGaslessTradeCount(
              exchangeType,
              this.chainId,
              this.fromToken,
              Number(data.from_token_price),
              this.fromAddress as string
            )
          : "";

        const isGasless =
          freeTradeCount && Number(freeTradeCount) > 0 ? true : false;

        const formatterInput = {
          approvalAddress: data.approve_address,
          provider: exchangeType,
          fromToken: this.fromToken,
          toToken: this.toToken,
          toAmount: String(
            Number(data.res_amount) * Math.pow(10, this.toDecimals)
          ),
          estimatedGasFees: "",
          fromAmountUsd: data.from_token_price,
          toAmountUsd: data.to_token_price,
          gasUsd: 0,
          toolName: PROVIDERS_LIST[exchangeType].name,
          toolLogoUrl: PROVIDERS_LIST[exchangeType].logo,
          freeTradeCount: freeTradeCount,
          isGasless: isGasless,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );
        return new Promise((resolve, reject) => {
          resolve(
            GASLESS_SUPPORTED_PROVIDERS.includes(exchangeType) && !isGasless
              ? (this.getFailedResponse(exchangeType) as IFormattedResponse)
              : formatterRes
          );
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(this.getFailedResponse(exchangeType) as IFormattedResponse);
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(this.getFailedResponse(exchangeType) as IFormattedResponse);
      });
    }
  }

  private async getosmosisdexQuote(): Promise<IFormattedResponse> {
    const chainDetail = getChainDetail(this.chainId);
    if (!chainDetail) {
      return new Promise((resolve, reject) => {
        resolve(
          this.getFailedResponse(PROVIDERS.OSMOSISDEX) as IFormattedResponse
        );
      });
    }
    const sellAmount = Number(this.amount) / Math.pow(10, this.fromDecimals);
    const body = {
      chain: chainDetail?.id ?? "",
      exchange_type: PROVIDERS.OSMOSISDEX,
      taker_address: this.fromAddress,
      fee: 0,
      swap_params: [
        {
          sell_amount: String(sellAmount),
          sell_token: this.fromToken,
          slippage: String(this.slippage),
          buy_token: this.toToken,
        },
      ],
    };
    const data = {
      body: body,
      method: API_METHOD.POST,
      url: getProviderUrl(PROVIDERS.OSMOSISDEX, this.chainId),
      payload: {},
      requestHeader: {},
    };
    try {
      const response = (await getResponse(data)) as AxiosResponse;
      if (HTTP_SUCCESS_CODES.includes(response.status)) {
        const {
          data: {
            data,
            data: { tokens_to_receive, multi_chain_response },
          },
        } = response;
        const multiChainResponse =
          multi_chain_response[multi_chain_response.length - 1];
        const tokenToReceive = tokens_to_receive[tokens_to_receive.length - 1];
        const baseInput = {
          provider: PROVIDERS.OSMOSISDEX,
          fromAmount: String(this.amount),
          fromToken: this.fromToken,
          toToken: this.toToken,
          toolName: PROVIDERS_LIST[PROVIDERS.OSMOSISDEX].name,
          toolLogoUrl: PROVIDERS_LIST[PROVIDERS.OSMOSISDEX].logo,
        };
        const toamount = tokenToReceive.value * Math.pow(10, this.toDecimals);
        const formatterInput = {
          ...baseInput,
          toAmount: String(toamount),
          estimatedGasFees: "",
          fromAmountUsd: multiChainResponse.from_token_price,
          toAmountUsd: multiChainResponse.to_token_price,
          gasUsd: "",
          toAmountMin: multiChainResponse.minimum_received,
          approvalAddress: multiChainResponse.approve_address,
          priceImpact: multiChainResponse.price_impact,
        };
        const formatterRes = await this.getFormatterResponse(
          formatterInput,
          true
        );
        return new Promise((resolve, reject) => {
          resolve(formatterRes);
        });
      } else {
        return new Promise((resolve, reject) => {
          resolve(
            this.getFailedResponse(PROVIDERS.OSMOSISDEX) as IFormattedResponse
          );
        });
      }
    } catch {
      return new Promise((resolve, reject) => {
        resolve(
          this.getFailedResponse(PROVIDERS.OSMOSISDEX) as IFormattedResponse
        );
      });
    }
  }

  public async getAggregateQuotes(
    providers?: string[]
  ): Promise<AggregatedQuotesResponseType> {
    let tokenInfoDisabled = false;

    if (providers) {
      tokenInfoDisabled = TOKEN_INFO_DISABLED_PROVIDERS.some(
        (r: string) => providers.indexOf(r) >= 0
      );
    }
    return new Promise(async (resolve, reject) => {
      if (!tokenInfoDisabled) {
        if (this.isBridge()) {
          const fromTokenPromise = this.getUsdValues(
            [this.fromToken],
            "fromUsd"
          );
          const toTokenPromise = this.getUsdValues([this.toToken], "toUsd");
          Promise.all([fromTokenPromise, toTokenPromise])
            .then(([fromTokenResult, toTokenResult]) => {
              if (fromTokenResult && toTokenResult) {
                if (this.fromUsd === "" || this.toUsd === "") {
                  resolve({
                    data: [],
                    code: 200,
                    message: "Token not supported",
                    status: false,
                    id: this.id,
                  });
                } else {
                  let promiseList: any[] = [];
                  if (providers) {
                    promiseList = this.getProvidersList(
                      this.id,
                      providers,
                      this.callback
                    );
                  } else {
                    promiseList = this.getProvidersList(
                      this.id,
                      Object.values(PROVIDERS) as string[],
                      this.callback
                    );
                  }
                  Promise.all(promiseList)
                    .then((values: IFormattedResponse[]) => {
                      const providerQuotes = filterValidProvider(values);
                      const sortedByGasandToAmount: IFormattedResponse[] =
                        sortByGasFeesAndToAmount(
                          providerQuotes,
                          this.isBridge() ? "bridge" : "swap"
                        );
                      if (sortedByGasandToAmount.length > 0) {
                        resolve({
                          data: sortedByGasandToAmount,
                          code: 200,
                          message: "Successfully fetched routes",
                          status: true,
                          id: this.id,
                        } as AggregatedQuotesResponseType);
                      } else {
                        resolve({
                          data: [],
                          code: 200,
                          message: "No routes found",
                          status: true,
                          id: this.id,
                        } as AggregatedQuotesResponseType);
                      }
                    })
                    .catch((err) => {
                      reject(err);
                    });
                }
              } else {
                resolve({
                  data: [],
                  code: 200,
                  message: "Token not supported",
                  status: false,
                  id: this.id,
                });
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        } else {
          const swapTokenPromise = this.getUsdValues(
            [this.fromToken, this.toToken],
            ""
          );
          Promise.all([swapTokenPromise])
            .then(() => {
              let promiseList: any[] = [];
              if (providers) {
                promiseList = this.getProvidersList(
                  this.id,
                  providers,
                  this.callback
                );
              } else {
                promiseList = this.getProvidersList(
                  this.id,
                  Object.values(PROVIDERS) as string[],
                  this.callback
                );
              }
              Promise.all(promiseList)
                .then((values: IFormattedResponse[]) => {
                  const providerQuotes = filterValidProvider(values);
                  const sortedByGasandToAmount: IFormattedResponse[] =
                    sortByGasFeesAndToAmount(
                      providerQuotes,
                      this.isBridge() ? "bridge" : "swap"
                    );
                  if (sortedByGasandToAmount.length > 0) {
                    resolve({
                      data: sortedByGasandToAmount,
                      code: 200,
                      message: "Successfully fetched routes",
                      status: true,
                      id: this.id,
                    } as AggregatedQuotesResponseType);
                  } else {
                    resolve({
                      data: [],
                      code: 200,
                      message: "No routes found",
                      status: true,
                      id: this.id,
                    } as AggregatedQuotesResponseType);
                  }
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      } else {
        let promiseList: any[] = [];
        if (providers) {
          promiseList = this.getProvidersList(
            this.id,
            providers,
            this.callback
          );
        } else {
          promiseList = this.getProvidersList(
            this.id,
            Object.values(PROVIDERS) as string[],
            this.callback
          );
        }
        Promise.all(promiseList)
          .then((values: IFormattedResponse[]) => {
            const providerQuotes = filterValidProvider(values);
            const sortedByGasandToAmount: IFormattedResponse[] =
              sortByGasFeesAndToAmount(
                providerQuotes,
                this.isBridge() ? "bridge" : "swap"
              );
            if (sortedByGasandToAmount.length > 0) {
              resolve({
                data: sortedByGasandToAmount,
                code: 200,
                message: "Successfully fetched routes",
                status: true,
                id: this.id,
              } as AggregatedQuotesResponseType);
            } else {
              resolve({
                data: [],
                code: 200,
                message: "No routes found",
                status: true,
                id: this.id,
              } as AggregatedQuotesResponseType);
            }
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  private async getFormatterResponse(
    data: IFormattedResponse,
    inUsd: boolean,
    provider?: PROVIDERS
  ): Promise<IFormattedResponse> {
    let fromAmountUsd = data.fromAmountUsd;
    let toAmountUsd = data.toAmountUsd;
    if (!inUsd) {
      fromAmountUsd = getUsdValues({
        amount: Number(this.amount),
        decimals: this.fromDecimals,
        tokenPrice: Number(this.fromUsd),
      });
      if (provider === PROVIDERS.DODO) {
        toAmountUsd =
          (Number(data.toAmount) * Number(this.toUsd)) /
          Math.pow(10, this.toDecimals);
      } else {
        toAmountUsd = getUsdValues({
          amount: Number(data.toAmount),
          decimals: this.toDecimals,
          tokenPrice: Number(this.toUsd),
        });
      }
    }
    const baseRes = {
      provider: data.provider,
      fromToken: data.fromToken,
      toToken: data.toToken,
      toolName: data.toolName,
      toolLogoUrl: data.toolLogoUrl,
    };
    const formattedRes = this.isBridge()
      ? {
          ...baseRes,
          approvalAddress: data.approvalAddress,
          excutionDuration: data.executionDuration,
          fromAmount: data.fromAmount,
          toAmountMin: data.toAmountMin,
          toAmount: data.toAmount,
          fromTokenDecimals: data.fromTokenDecimals,
          toTokenDecimals: data.toTokenDecimals,
          estimatedGasFees: data.estimatedGasFees,
          fromAmountUsd: Number(fromAmountUsd).toFixed(2),
          toAmountUsd: Number(toAmountUsd).toFixed(2),
          gasUsd: Number(data.gasUsd).toFixed(2),
          bridgeFee: data.bridgeFee ? data.bridgeFee : "",
          routing: data.routing ? data.routing : "",
        }
      : {
          ...baseRes,
          toAmount: data.toAmount,
          estimatedGasFees: data.estimatedGasFees,
          fromAmountUsd: fromAmountUsd,
          toAmountMin: data.toAmountMin,
          toAmountUsd: toAmountUsd,
          gasUsd: data.gasUsd,
          approvalAddress: data.approvalAddress ? data.approvalAddress : "",
          priceImpact: data.priceImpact ? data.priceImpact : "",
          freeTradeCount: data.freeTradeCount ? data.freeTradeCount : "",
          isGasless: data.isGasless ? data.isGasless : false,
        };
    return formattedRes;
  }

  private getFailedResponse(provider: string) {
    return {
      provider: provider,
      fromToken: "",
      toToken: "",
      toAmount: "",
      estimatedGasFees: "",
      fromAmountUsd: 0,
      toAmountUsd: 0,
      gasUsd: 0,
    };
  }

  private getUsdValues(
    contractAddress: string[],
    type: string
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const chnId = this.isBridge()
        ? type === "fromUsd"
          ? Number(this.fromChain)
          : Number(this.toChain)
        : Number(this.chainId);
      getUniFrontTokenPrice(chnId, contractAddress)
        .then((value: any) => {
          if (value.length === 0) {
            resolve(false);
          } else {
            if (this.isBridge()) {
              if (type === "fromUsd") {
                this.fromUsd = value[0]?.usd as number;
              } else {
                this.toUsd = value[0]?.usd as number;
              }
              resolve(true);
            } else {
              resolve(true);
              this.fromUsd = value[1]?.usd as number;
              this.toUsd = value[0]?.usd as number;
            }
          }
        })
        .catch((error) => {
          console.log("Error:", error);
          resolve(false);
        });
    });
  }

  private getProvidersList = (
    id: string,
    providers?: string[],
    callback?: Function
  ) => {
    let promiseList: any[] = [];
    const chainDetail = getChainDetail(this.chainId);
    const isBridgeTx = this.isBridge();
    if (providers) {
      for (const provider of providers) {
        if (
          SUPPORTED_CHAINS[provider as PROVIDERS] &&
          SUPPORTED_CHAINS[provider as PROVIDERS].includes(
            chainDetail?.id as CHAINS_IDS
          )
        ) {
          let quotePromise;
          if (UNIFRONT_PROVIDERS.includes(provider)) {
            quotePromise = this.getSwapQuote(provider as PROVIDERS);
          } else {
            let functionToCall = `get${provider}Quote`;
            if (
              typeof (this as unknown as { [key: string]: () => Promise<any> })[
                functionToCall
              ] === "function"
            ) {
              quotePromise = (
                this as unknown as { [key: string]: () => Promise<any> }
              )[functionToCall]();
            }
          }
          if (quotePromise) {
            promiseList.push(quotePromise);
            quotePromise.then((value: IFormattedResponse) => {
              const providerQuotes = filterValidProvider([value]);
              if (callback && providerQuotes[0])
                callback(id, providerQuotes[0]);
            });
          }
        }
      }
    }
    return promiseList;
  };
}
export default DexAggregators;
