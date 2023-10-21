export enum CHAINS_IDS {
  ETHEREUM = "ethereum",
  BSC = "bsc",
  POLYGON = "polygon",
  AVALANCHEC = "avalanche",
  SOLANA = "solana",
  TEZOS = "tezos",
  FANTOM = "fantom",
  ARBITRUM = "arbitrum",
  AURORA = "aurora",
  OPTIMISM = "optimism",
  GNOSIS = "gnosis",
  CELO = "celo",
  MOONRIVER = "moonriver",
  MOONBEAM = "moonbeam",
  METIS = "metis",
  BOBA = "boba",
  EVMOS = "evmos",
  ALGORAND = "algorand",
  HARMONY = "harmony",
  XDC = "xinfin",
  ZILLIQA = "zilliqa",
  BLUZELLE = "bluzelle",
  TOMOCHAIN = "tomochain",
  ELROND = "elrond",
  BAND = "bandchain",
  KAVA = "kava",
  KLAYTN = "klaytn",
  HECO = "heco",
  IOTEX = "iotex",
  NEAR = "near",
  POLKADOT = "polkadot",
  BTTC = "bttc",
  FUSE = "fuse",
  APTOS = "aptos",
  CRONOS = "cronos",
  ASTAR = "astar",
  SUI = "sui",
  COSMOSHUB = "cosmoshub",
  OSMOSIS = "osmosis",
  ZKSYNC = "zksync",
  BASE = "base",
}

export const ALCHEMY_KEY = "lERz1xVUelACgw1ngLwf5x-GeXChl1e6";

export interface IChainData {
  id: string;
  name: string;
  chainId: string;
  chainAlias?: string;
  nativeToken?: {
    name?: string;
    symbol?: string;
    address?: string;
    decimals?: string;
  };
  info?: {
    url: string;
    rpc: string;
  };
  symbol: string;
  wrappedNativeToken?: string;
  wrappedNativeTokenAddress?: string;
  lifiFeeSymbol?: string;
  lifiFeeToken?: string;
  lifiFeeDecimals?: string;
  minGaslessAmount?: number;
}

export const CHAIN_LIST: Array<IChainData> = [
  {
    id: CHAINS_IDS.ETHEREUM,
    name: "Ethereum",
    chainId: "1",
    chainAlias: "ETH",
    nativeToken: {
      name: "Ether",
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: "18",
    },
    info: {
      url: "https://ethereum.org",
      rpc: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}`,
    },
    symbol: "ETH",
    wrappedNativeToken: "WETH",
    wrappedNativeTokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    lifiFeeSymbol: "ETH",
    lifiFeeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.BASE,
    name: "Ethereum",
    chainId: "8453",
    chainAlias: "ETH",
    nativeToken: {
      name: "Ether",
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: "18",
    },
    info: {
      url: "https://ethereum.org",
      rpc: "https://goerli.base.org",
    },
    symbol: "ETH",
    wrappedNativeToken: "WETH",
    wrappedNativeTokenAddress: "0x89efcb16d55a8a9257159112d8bd9f28b4d7f9e6",
    lifiFeeSymbol: "ETH",
    lifiFeeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.BSC,
    name: "BNB Smart Chain",
    chainId: "56",
    chainAlias: "BSC",
    nativeToken: {
      name: "BNB Token",
      symbol: "BNB",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: "18",
    },
    info: {
      url: "https://www.binance.org/en/smartChain",
      rpc: "https://bsc-dataseed.binance.org/",
    },
    symbol: "BNB",
    wrappedNativeToken: "WBNB",
    wrappedNativeTokenAddress: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    lifiFeeSymbol: "BNB",
    lifiFeeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    lifiFeeDecimals: "18",
    minGaslessAmount: 10,
  },
  {
    id: CHAINS_IDS.POLYGON,
    name: "Polygon",
    chainId: "137",
    chainAlias: "POLYGON",
    nativeToken: {
      name: "Matic Token",
      symbol: "MATIC",
      address: "0x0000000000000000000000000000000000001010",
      decimals: "18",
    },
    info: {
      url: "https://polygon.technology",
      rpc: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
    symbol: "MATIC",
    wrappedNativeToken: "WMATIC",
    wrappedNativeTokenAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    lifiFeeSymbol: "MATIC",
    lifiFeeToken: "0x0000000000000000000000000000000000001010",
    lifiFeeDecimals: "18",
    minGaslessAmount: 5,
  },
  {
    id: CHAINS_IDS.AVALANCHEC,
    name: "Avalanche C Chain",
    chainId: "43114",
    chainAlias: "AVAX_CCHAIN",
    nativeToken: {
      name: "AVAX Token",
      symbol: "AVAX",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: "18",
    },
    info: {
      url: "https://www.avalabs.org/",
      rpc: "https://api.avax.network/ext/bc/C/rpc",
    },
    symbol: "AVAX",
    wrappedNativeToken: "WAVAX",
    wrappedNativeTokenAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    lifiFeeSymbol: "AVAX",
    lifiFeeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    lifiFeeDecimals: "18",
    minGaslessAmount: 10,
  },
  {
    id: CHAINS_IDS.SOLANA,
    name: "Solana",
    chainId: "245022934",
    symbol: "SOL",
    chainAlias: "SOLANA",
    nativeToken: {
      decimals: "9",
    },
    info: {
      url: "https://solana.com",
      rpc: `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
  },
  {
    id: CHAINS_IDS.APTOS,
    name: "Aptos",
    chainId: "637",
    symbol: "APT",
    nativeToken: {
      decimals: "8",
    },
    info: {
      url: "https://aptoslabs.com/",
      rpc: "https://fullnode.mainnet.aptoslabs.com/v1",
    },
  },
  {
    id: CHAINS_IDS.SUI,
    name: "Sui Devnet",
    chainId: "6371",
    symbol: "SUI",
    nativeToken: {
      decimals: "9",
    },
    info: {
      url: "https://sui.io/",
      rpc: "https://rpc.mainnet.sui.io/",
    },
  },
  {
    id: CHAINS_IDS.TEZOS,
    name: "Tezos",
    chainId: "NetXdQprcVkpaWU",
    symbol: "XTZ",
    nativeToken: {
      decimals: "6",
    },
    info: {
      url: "https://tezos.com",
      rpc: "https://mainnet-node.madfish.solutions",
    },
  },
  {
    id: CHAINS_IDS.FANTOM,
    name: "Fantom",
    chainId: "250",
    chainAlias: "FANTOM",
    nativeToken: {
      name: "Fantom",
      symbol: "FTM",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: "18",
    },
    info: {
      url: "https://fantom.foundation",
      rpc: "https://rpc.ftm.tools",
    },
    symbol: "FTM",
    wrappedNativeToken: "WFTM",
    wrappedNativeTokenAddress: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83",
    lifiFeeSymbol: "FTM",
    lifiFeeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    lifiFeeDecimals: "18",
    minGaslessAmount: 0,
  },
  {
    id: CHAINS_IDS.NEAR,
    name: "NEAR",
    chainId: "near",
    symbol: "NEAR",
    nativeToken: {
      decimals: "24",
    },
    info: {
      url: "https://nearprotocol.com",
      rpc: "https://rpc.mainnet.near.org",
    },
  },
  {
    id: CHAINS_IDS.ARBITRUM,
    name: "Arbitrum",
    chainId: "42161",
    chainAlias: "ARBITRUM",
    nativeToken: {
      name: "Ether",
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: "18",
    },
    info: {
      url: "https://arbitrum.io",
      rpc: "https://arb1.arbitrum.io/rpc",
    },
    symbol: "ETH",
    wrappedNativeToken: "WETH",
    wrappedNativeTokenAddress: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    lifiFeeSymbol: "ETH",
    lifiFeeToken: "0x912ce59144191c1204e64559fe8253a0e49e6548",
    lifiFeeDecimals: "18",
    minGaslessAmount: 10,
  },
  {
    id: CHAINS_IDS.AURORA,
    name: "Aurora",
    chainId: "1313161554",
    chainAlias: "AURORA",
    nativeToken: {
      name: "Ether",
      symbol: "ETH",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: "18",
    },
    info: {
      url: "https://aurora.dev/",
      rpc: "https://mainnet.aurora.dev",
    },
    symbol: "ETH",
    wrappedNativeToken: "WETH",
    wrappedNativeTokenAddress: "0xc9bdeed33cd01541e1eed10f90519d2c06fe3feb",
    lifiFeeSymbol: "ETH",
    lifiFeeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.KLAYTN,
    name: "Klaytn",
    chainId: "8217",
    symbol: "KLAY",
    nativeToken: {
      name: "Klatyn",
      symbol: "KLAY",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: "18",
    },
    info: {
      url: "https://klaytn.foundation",
      rpc: "https://public-node-api.klaytnapi.com/v1/cypress",
    },
    wrappedNativeToken: "WKLAY",
    wrappedNativeTokenAddress: "0x19aac5f612f524b754ca7e7c41cbfa2e981a4432",
  },
  {
    id: CHAINS_IDS.OPTIMISM,
    name: "Optimism",
    chainId: "10",
    chainAlias: "OPTIMISM",
    nativeToken: {
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      symbol: "ETH",
      decimals: "18",
      name: "Ether",
    },
    info: {
      url: "https://optimism.io/",
      rpc: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`,
    },
    symbol: "ETH",
    wrappedNativeToken: "WETH",
    wrappedNativeTokenAddress: "0x4200000000000000000000000000000000000006",
    lifiFeeSymbol: "ETH",
    lifiFeeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    lifiFeeDecimals: "18",
    minGaslessAmount: 10,
  },
  {
    id: CHAINS_IDS.ZKSYNC,
    name: "zkSync",
    chainId: "324",
    chainAlias: "ZKSYNC",
    nativeToken: {
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      symbol: "ETH",
      decimals: "18",
      name: "ETH",
    },
    info: {
      url: "https://zksync.io/",
      rpc: "https://mainnet.era.zksync.io",
    },
    symbol: "ETH",
    wrappedNativeToken: "WETH",
    wrappedNativeTokenAddress: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91",
    lifiFeeSymbol: "ETH",
    lifiFeeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.CRONOS,
    name: "Cronos",
    chainId: "25",
    chainAlias: "CRONOS",
    nativeToken: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "CRO",
      decimals: "18",
      name: "CRO",
    },
    info: {
      url: "https://cronos.org",
      rpc: "https://evm-cronos.crypto.org",
    },
    symbol: "CRO",
    wrappedNativeToken: "WCRO",
    wrappedNativeTokenAddress: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
    lifiFeeSymbol: "CRO",
    lifiFeeToken: "0x0000000000000000000000000000000000000000",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.GNOSIS,
    name: "Gnosis",
    chainId: "100",
    chainAlias: "GNOSIS",
    nativeToken: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "XDAI",
      decimals: "18",
      name: "XDAI",
    },
    info: {
      url: "https://www.xdaichain.com",
      rpc: "https://rpc.gnosischain.com",
    },
    symbol: "xDAI",
    wrappedNativeToken: "WXDAI",
    wrappedNativeTokenAddress: "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    lifiFeeSymbol: "XDAI",
    lifiFeeToken: "0x0000000000000000000000000000000000000000",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.HECO,
    name: "Heco",
    chainId: "128",
    symbol: "HT",
    chainAlias: "HECO",
    nativeToken: {
      decimals: "18",
    },
    info: {
      url: "https://www.hecochain.com/en-us",
      rpc: "https://http-mainnet.hecochain.com/",
    },
  },
  {
    id: CHAINS_IDS.CELO,
    name: "Celo",
    chainId: "42220",
    nativeToken: {
      address: "0x471ece3750da237f93b8e339c536989b8978a438",
      symbol: "CELO",
      decimals: "18",
      name: "Celo native asset",
    },
    info: {
      url: "https://celo.org",
      rpc: "https://forno.celo.org",
    },
    symbol: "CELO",
    wrappedNativeToken: "WCELO",
    wrappedNativeTokenAddress: "0xE452E6Ea2dDeB012e20dB73bf5d3863A3Ac8d77a",
    lifiFeeSymbol: "CELO",
    lifiFeeToken: "0x471ece3750da237f93b8e339c536989b8978a438",
    lifiFeeDecimals: "18",
    minGaslessAmount: 0,
  },
  {
    id: CHAINS_IDS.MOONRIVER,
    name: "Moonriver",
    chainId: "1285",
    chainAlias: "MOONRIVER",
    nativeToken: {
      name: "MoonRiver",
      symbol: "MOVR",
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      decimals: "18",
    },
    info: {
      url: "https://moonbeam.network/networks/moonriver",
      rpc: "https://moonriver.public.blastapi.io",
    },
    symbol: "MOVR",
    wrappedNativeToken: "WMOVR",
    wrappedNativeTokenAddress: "0x98878B06940aE243284CA214f92Bb71a2b032B8A",
    lifiFeeSymbol: "MOVR",
    lifiFeeToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.MOONBEAM,
    name: "Moonbeam",
    chainId: "1284",
    chainAlias: "MOONBEAM",
    nativeToken: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "GLMR",
      decimals: "18",
      name: "GLMR",
    },
    info: {
      url: "https://moonbeam.network",
      rpc: "https://rpc.api.moonbeam.network",
    },
    symbol: "GLMR",
    wrappedNativeToken: "WGLMR",
    wrappedNativeTokenAddress: "0xAcc15dC74880C9944775448304B263D191c6077F",
    lifiFeeSymbol: "GLMR",
    lifiFeeToken: "0x0000000000000000000000000000000000000000",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.METIS,
    name: "Metis",
    chainId: "1088",
    symbol: "METIS",
    nativeToken: {
      decimals: "18",
    },
    info: {
      url: "https://www.metis.io/",
      rpc: "https://andromeda.metis.io/?owner=1088",
    },
  },
  {
    id: CHAINS_IDS.ASTAR,
    name: "Astar",
    chainId: "592",
    symbol: "ASTR",
    nativeToken: {
      address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      symbol: "ASTR",
      decimals: "18",
      name: "ASTR",
    },
    info: {
      url: "https://astar.network/",
      rpc: "https://evm.astar.network",
    },
  },
  {
    id: CHAINS_IDS.IOTEX,
    name: "IoTeX",
    chainId: "4689",
    symbol: "IOTX",
    nativeToken: {
      decimals: "18",
    },
    info: {
      url: "https://iotex.io",
      rpc: "https://babel-api.mainnet.iotex.one",
    },
  },
  {
    id: CHAINS_IDS.BOBA,
    name: "Boba",
    chainId: "288",
    chainAlias: "BOBA",
    nativeToken: {
      name: "Boba",
      symbol: "BOBA",
      address: "0xa18bF3994C0Cc6E3b63ac420308E5383f53120D7",
      decimals: "18",
    },
    info: {
      url: "https://boba.network/",
      rpc: "https://mainnet.boba.network",
    },
    symbol: "ETH",
    wrappedNativeToken: "WETH",
    wrappedNativeTokenAddress: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
    lifiFeeSymbol: "BOBA",
    lifiFeeToken: "0xa18bF3994C0Cc6E3b63ac420308E5383f53120D7",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.FUSE,
    name: "Fuse",
    chainId: "122",
    chainAlias: "FUSE",
    nativeToken: {
      address: "0x0000000000000000000000000000000000000000",
      symbol: "FUSE",
      decimals: "18",
      name: "FUSE",
    },
    info: {
      url: "https://fuse.io",
      rpc: "https://rpc.fuse.io",
    },
    symbol: "FUSE",
    wrappedNativeToken: "WFUSE",
    wrappedNativeTokenAddress: "0x0be9e53fd7edac9f859882afdda116645287c629",
    lifiFeeSymbol: "FUSE",
    lifiFeeToken: "0x0000000000000000000000000000000000000000",
    lifiFeeDecimals: "18",
  },
  {
    id: CHAINS_IDS.EVMOS,
    name: "Evmos",
    chainId: "9001",
    symbol: "EVMOS",
    chainAlias: "EVMOS",
    nativeToken: {
      decimals: "18",
    },
    info: {
      url: "https://evmos.org/",
      rpc: "https://eth.bd.evmos.org:8545",
    },
  },
  {
    id: CHAINS_IDS.BTTC,
    name: "BitTorrent",
    chainId: "199",
    symbol: "BTT",
    nativeToken: {
      decimals: "18",
    },
    info: {
      url: "https://bt.io",
      rpc: "https://rpc.bittorrentchain.io",
    },
  },
  {
    id: CHAINS_IDS.COSMOSHUB,
    name: "Cosmos Hub",
    chainId: "cosmoshub-4",
    symbol: "ATOM",
    chainAlias: "COSMOS",
    nativeToken: {
      decimals: "6",
    },
    info: {
      url: "https://cosmos.network",
      rpc: "https://rpc.cosmos.network",
    },
  },
  {
    id: CHAINS_IDS.ALGORAND,
    name: "Algorand",
    chainId: "283",
    symbol: "ALGO",
    nativeToken: {
      decimals: "6",
    },
    info: {
      url: "https://www.algorand.com/",
      rpc: "https://node.algoexplorerapi.io/v2",
    },
  },
  {
    id: CHAINS_IDS.HARMONY,
    name: "Harmony",
    chainId: "1666600000",
    symbol: "ONE",
    chainAlias: "HARMONY",
    nativeToken: {
      decimals: "18",
    },
    info: {
      url: "https://harmony.one",
      rpc: "https://api.harmony.one",
    },
  },
  {
    id: CHAINS_IDS.XDC,
    name: "XDC Network",
    chainId: "50",
    symbol: "XDC",
    nativeToken: {
      decimals: "18",
    },
    info: {
      url: "https://xinfin.org",
      rpc: "",
    },
  },
  {
    id: CHAINS_IDS.ZILLIQA,
    name: "Zilliqa",
    chainId: "313",
    symbol: "ZIL",
    nativeToken: {
      decimals: "12",
    },
    info: {
      url: "https://zilliqa.com",
      rpc: "https://api.zilliqa.com/",
    },
  },
  {
    id: CHAINS_IDS.BLUZELLE,
    name: "Bluzelle",
    chainId: "net-7",
    symbol: "BLZ",
    nativeToken: {
      decimals: "6",
    },
    info: {
      url: "https://bluzelle.com",
      rpc: "https://bluzelle.github.io/api/",
    },
  },
  {
    id: CHAINS_IDS.TOMOCHAIN,
    name: "TomoChain",
    chainId: "88",
    symbol: "TOMO",
    nativeToken: {
      decimals: "18",
    },
    info: {
      url: "https://tomochain.com",
      rpc: "https://rpc.tomochain.com",
    },
  },
  {
    id: CHAINS_IDS.ELROND,
    name: "Elrond",
    chainId: "508",
    symbol: "eGLD",
    nativeToken: {
      decimals: "18",
    },
  },
  {
    id: CHAINS_IDS.POLKADOT,
    name: "Polkadot",
    chainId: "354",
    symbol: "DOT",
    nativeToken: {
      decimals: "10",
    },
    info: {
      url: "https://polkadot.network/",
      rpc: "wss://rpc.polkadot.io",
    },
  },
  {
    id: CHAINS_IDS.BAND,
    name: "Band",
    chainId: "laozi-mainnet",
    chainAlias: "BANDCHAIN",
    symbol: "BAND",
    nativeToken: {
      decimals: "6",
    },
    info: {
      url: "https://bandprotocol.com/",
      rpc: "https://api-wt2-lb.bandchain.org",
    },
  },
  {
    id: CHAINS_IDS.KAVA,
    name: "Kava",
    chainId: "kava_2222-10",
    symbol: "KAVA",
    nativeToken: {
      decimals: "6",
    },
    info: {
      url: "https://kava.io",
      rpc: "https://kava-mainnet.chainode.tech",
    },
  },
  {
    id: CHAINS_IDS.OSMOSIS,
    name: "Osmosis",
    symbol: "OSMO",
    chainId: "osmosis-1",
    info: {
      url: "https://osmosis.zone/",
      rpc: "https://rpc.osmosis.zone",
    },
  },
];

export enum API_METHOD {
  GET = "get",
  POST = "post",
}

export const BASE_UNIT = 10e8;

export enum PROVIDERS {
  ZEROX = "0x",
  PARASWAP = "paraswap",
  COWSWAP = "cowswap",
  ONEINCH = "1inch",
  OPENOCEAN = "openOcean",
  KYBERSWAP = "kyber",
  DODO = "dodo",
  LIFI = "lifi",
  XY = "xy",
  NETSWAP = "netswap",
  DIFFUSION = "diffusion",
  XSWAP = "xswap",
  JUPITER = "jupiter",
  SOYFINANCE = "soyfinance",
  VVSFINANCE = "vvsfinance",
  ELK = "elk",
  ARTHSWAP = "arthswap",
  LUASWAP = "luaswap",
  MESHSWAP = "meshswap",
  QUACKSWAP = "quackswap",
  KLAYSWAP = "klayswap",
  ROUTER = "router",
  SOCKET = "socket",
  RANGO = "rango",
  DEBRIDGE = "debridge",
  OSMOSISDEX = "osmosisdex",
  ZEROSWAP = "zeroswap",
}

export const UNIFRONT_PROVIDERS = [
  "soyfinance",
  "vvsfinance",
  "netswap",
  "diffusion",
  "xswap",
  "elk",
  "arthswap",
  "luaswap",
  "meshswap",
  "quackswap",
  "klayswap",
  "zeroswap",
];

export const COSMOS_CHAINS = [
  CHAINS_IDS.COSMOSHUB,
  CHAINS_IDS.KAVA,
  CHAINS_IDS.OSMOSIS,
];

export const TOKEN_INFO_DISABLED_PROVIDERS = [
  PROVIDERS.OSMOSISDEX,
  PROVIDERS.JUPITER,
];

export const BRIDGE_SUPPORTED_CHAINS = {
  [PROVIDERS.DEBRIDGE]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.LIFI]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.BSC,
    CHAINS_IDS.GNOSIS,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.MOONRIVER,
    CHAINS_IDS.MOONBEAM,
    CHAINS_IDS.CELO,
    CHAINS_IDS.FUSE,
    CHAINS_IDS.CRONOS,
    CHAINS_IDS.HARMONY,
    CHAINS_IDS.EVMOS,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.RANGO]: [
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.CRONOS,
    CHAINS_IDS.MOONRIVER,
    CHAINS_IDS.MOONBEAM,
    CHAINS_IDS.HARMONY,
    CHAINS_IDS.GNOSIS,
    CHAINS_IDS.FUSE,
    CHAINS_IDS.BOBA,
  ],
  [PROVIDERS.ROUTER]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.HARMONY,
    CHAINS_IDS.AURORA,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.SOCKET]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.GNOSIS,
    CHAINS_IDS.AURORA,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.XY]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.CRONOS,
    CHAINS_IDS.METIS,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.ASTAR,
    CHAINS_IDS.MOONRIVER,
    CHAINS_IDS.KLAYTN,
    CHAINS_IDS.ZKSYNC,
  ],
};

export const SUPPORTED_CHAINS = {
  [PROVIDERS.ZEROX]: [
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.BSC,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.CELO,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.PARASWAP]: [
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.FANTOM,
  ],
  [PROVIDERS.ONEINCH]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.GNOSIS,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.KLAYTN,
    CHAINS_IDS.AURORA,
    CHAINS_IDS.ZKSYNC,
  ],
  [PROVIDERS.KYBERSWAP]: [
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.CRONOS,
    CHAINS_IDS.BTTC,
    CHAINS_IDS.AURORA,
    CHAINS_IDS.OPTIMISM,
  ],
  [PROVIDERS.DODO]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.CRONOS,
    CHAINS_IDS.AURORA,
    CHAINS_IDS.BOBA,
    CHAINS_IDS.MOONRIVER,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.HECO,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.OPENOCEAN]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.GNOSIS,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.LIFI]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.BSC,
    CHAINS_IDS.GNOSIS,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.MOONRIVER,
    CHAINS_IDS.MOONBEAM,
    CHAINS_IDS.CELO,
    CHAINS_IDS.FUSE,
    CHAINS_IDS.CRONOS,
    CHAINS_IDS.HARMONY,
    CHAINS_IDS.EVMOS,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.DEBRIDGE]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.XY]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.CRONOS,
    CHAINS_IDS.METIS,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.ASTAR,
    CHAINS_IDS.MOONRIVER,
    CHAINS_IDS.KLAYTN,
    CHAINS_IDS.ZKSYNC,
  ],
  [PROVIDERS.SOCKET]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.GNOSIS,
    CHAINS_IDS.AURORA,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.ROUTER]: [
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.HARMONY,
    CHAINS_IDS.AURORA,
    CHAINS_IDS.BASE,
  ],
  [PROVIDERS.RANGO]: [
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.ETHEREUM,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.ARBITRUM,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.CRONOS,
    CHAINS_IDS.MOONRIVER,
    CHAINS_IDS.MOONBEAM,
    CHAINS_IDS.HARMONY,
    CHAINS_IDS.GNOSIS,
    CHAINS_IDS.FUSE,
    CHAINS_IDS.BOBA,
  ],
  [PROVIDERS.ZEROSWAP]: [
    CHAINS_IDS.BSC,
    CHAINS_IDS.POLYGON,
    CHAINS_IDS.AVALANCHEC,
    CHAINS_IDS.FANTOM,
    CHAINS_IDS.OPTIMISM,
    CHAINS_IDS.CELO,
    CHAINS_IDS.ARBITRUM,
  ],
  [PROVIDERS.VVSFINANCE]: [CHAINS_IDS.CRONOS],
  [PROVIDERS.SOYFINANCE]: [CHAINS_IDS.BTTC],
  [PROVIDERS.NETSWAP]: [CHAINS_IDS.METIS],
  [PROVIDERS.DIFFUSION]: [CHAINS_IDS.EVMOS],
  [PROVIDERS.XSWAP]: [CHAINS_IDS.XDC],
  [PROVIDERS.JUPITER]: [CHAINS_IDS.SOLANA],
  [PROVIDERS.ELK]: [CHAINS_IDS.IOTEX],
  [PROVIDERS.ARTHSWAP]: [CHAINS_IDS.ASTAR],
  [PROVIDERS.LUASWAP]: [CHAINS_IDS.TOMOCHAIN],
  [PROVIDERS.COWSWAP]: [CHAINS_IDS.ETHEREUM, CHAINS_IDS.GNOSIS],
  [PROVIDERS.MESHSWAP]: [CHAINS_IDS.POLYGON],
  [PROVIDERS.QUACKSWAP]: [CHAINS_IDS.BTTC],
  [PROVIDERS.KLAYSWAP]: [CHAINS_IDS.KLAYTN],
  [PROVIDERS.OSMOSISDEX]: [CHAINS_IDS.OSMOSIS],
};

export const PROVIDERS_LIST = {
  [PROVIDERS.ZEROX]: {
    id: PROVIDERS.ZEROX,
    name: "0x",
    url: "https://api.0x.org/swap/v1/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/zero_swap_logo.svg",
    description:
      "0x is an open protocol that enables the peer-to-peer exchange of assets on the Ethereum blockchain.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.ZEROX],
  },
  [PROVIDERS.PARASWAP]: {
    id: PROVIDERS.PARASWAP,
    name: "ParaSwap",
    url: "https://apiv5.paraswap.io/prices",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/paraswap.png",
    description:
      "ParaSwap is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.PARASWAP],
  },
  [PROVIDERS.COWSWAP]: {
    id: PROVIDERS.COWSWAP,
    name: "CowSwap",
    url: "https://api.cow.fi/mainnet/api/v1/quote",
    logo: "",
    description:
      "CowSwap is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.COWSWAP],
  },

  [PROVIDERS.ONEINCH]: {
    id: PROVIDERS.ONEINCH,
    name: "1inch",
    // url: "https://api.1inch.io/v5.0/1/quote",
    url: "https://api-frontier.1inch.io/v5.0/",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/1inch.png",
    description:
      "1inch is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.ONEINCH],
  },
  [PROVIDERS.OPENOCEAN]: {
    id: PROVIDERS.OPENOCEAN,
    name: "OpenOcean",
    url: "https://ethapi.openocean.finance/v2/1/swap",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/openocean.png",
    description:
      "OpenOcean is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.OPENOCEAN],
  },
  [PROVIDERS.KYBERSWAP]: {
    id: PROVIDERS.KYBERSWAP,
    name: "KyberSwap",
    url: "https://aggregator-api.kyberswap.com/ethereum/route/encode",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/kyberswap.png",
    description:
      "KyberSwap is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.KYBERSWAP],
  },
  [PROVIDERS.DODO]: {
    id: PROVIDERS.DODO,
    name: "DODO",
    url: "https://api.dodoex.io/route-service/developer/getdodoroute",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/dodo_new.svg",
    description:
      "DODO is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.DODO],
  },
  [PROVIDERS.LIFI]: {
    id: PROVIDERS.LIFI,
    name: "LI.FI",
    url: "https://li.quest/v1/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/lifi_new.svg",
    description:
      "Lifi is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.LIFI],
  },
  [PROVIDERS.XY]: {
    id: PROVIDERS.XY,
    name: "XY",
    url: "https://open-api.xy.finance/v1/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/xyfinance.svg",
    description: "XY is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.XY],
  },
  [PROVIDERS.NETSWAP]: {
    id: PROVIDERS.NETSWAP,
    name: "NetSwap",
    url: "https://extension-v2.unifront.io/v2/exchange/ethereum/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/netswap.png",
    description:
      "NetSwap is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.NETSWAP],
  },
  [PROVIDERS.DIFFUSION]: {
    id: PROVIDERS.DIFFUSION,
    name: "Diffusion",
    url: "https://extension-v2.unifront.io/v2/exchange/ethereum/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/diffusionfi.png",
    description:
      "Diffusion is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.DIFFUSION],
  },
  [PROVIDERS.XSWAP]: {
    id: PROVIDERS.XSWAP,
    name: "XSwap",
    url: "https://extension-v2.unifront.io/v2/exchange/ethereum/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/xswap.png",
    description:
      "XSwap is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.XSWAP],
  },
  [PROVIDERS.JUPITER]: {
    id: PROVIDERS.JUPITER,
    name: "Jupiter",
    url: "https://quote-api.jup.ag/v4/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/jupiter_new.svg",
    description:
      "Jupiter is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.JUPITER],
  },
  [PROVIDERS.SOYFINANCE]: {
    id: PROVIDERS.SOYFINANCE,
    name: "SoyFinance",
    url: "https://extension-v2.unifront.io/v2/exchange/ethereum/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/soyfinance.png",
    description:
      "SoyFinance is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.SOYFINANCE],
  },
  [PROVIDERS.VVSFINANCE]: {
    id: PROVIDERS.VVSFINANCE,
    name: "VVSFinance",
    url: "https://extension-v2.unifront.io/v2/exchange/ethereum/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/vvs.png",
    description:
      "VVSFinance is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.VVSFINANCE],
  },
  [PROVIDERS.ELK]: {
    id: PROVIDERS.ELK,
    name: "Elk",
    url: "https://extension-v2.unifront.io/v2/exchange/ethereum/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/elk.png",
    description:
      "Elk is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.ELK],
  },
  [PROVIDERS.ARTHSWAP]: {
    id: PROVIDERS.ARTHSWAP,
    name: "ArthSwap",
    url: "https://extension-v2.unifront.io/v2/exchange/ethereum/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/arthswap.png",
    description:
      "ArthSwap is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.ARTHSWAP],
  },
  [PROVIDERS.LUASWAP]: {
    id: PROVIDERS.LUASWAP,
    name: "LuaSwap",
    url: "https://extension-v2.unifront.io/v2/exchange/ethereum/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/luaswap.png",
    description:
      "LuaSwap is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.LUASWAP],
  },

  [PROVIDERS.MESHSWAP]: {
    id: PROVIDERS.MESHSWAP,
    name: "MeshSwap",
    url: "https://extension-v2.unifront.io/v2/exchange/polygon/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/meshswap.png",
    description:
      "MeshSwap is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.MESHSWAP],
  },
  [PROVIDERS.QUACKSWAP]: {
    id: PROVIDERS.QUACKSWAP,
    name: "QuackSwap",
    url: "https://extension-v2.unifront.io/v2/exchange/bttc/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/quackswap.png",
    description:
      "QuackSwap is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.QUACKSWAP],
  },
  [PROVIDERS.KLAYSWAP]: {
    id: PROVIDERS.KLAYSWAP,
    name: "KlaySwap",
    url: "https://extension-v2.unifront.io/v2/exchange/klaytn/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/klayswap.png",
    description:
      "KlaySwap is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.KLAYSWAP],
  },
  [PROVIDERS.ROUTER]: {
    id: PROVIDERS.ROUTER,
    name: "Router",
    url: "https://api.pathfinder.routerprotocol.com/api/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/router.svg",
    description:
      "Router is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.ROUTER],
  },
  [PROVIDERS.SOCKET]: {
    id: PROVIDERS.SOCKET,
    name: "Socket",
    url: "https://api.socket.tech/v2/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/socket.png",
    description:
      "Socket is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.SOCKET],
  },
  [PROVIDERS.DEBRIDGE]: {
    id: PROVIDERS.DEBRIDGE,
    name: "DeBridge",
    url: "https://deswap.debridge.finance/v1.0/transaction",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/debridge.png",
    description:
      "DeBridge is a decentralized exchange aggregator that allows users to swap tokens on multiple DEXs in a single transaction.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.DEBRIDGE],
  },
  [PROVIDERS.RANGO]: {
    id: PROVIDERS.RANGO,
    name: "Rango",
    url: "https://api.rango.exchange/basic/swap",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/rango.png",
    description:
      "Rango is a decentralized exchange built on Gnosis Protocol v2.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.RANGO],
  },
  [PROVIDERS.OSMOSISDEX]: {
    id: PROVIDERS.OSMOSISDEX,
    name: "Osmosis DEX",
    url: "https://extension-v2.unifront.io/v2/exchange/multi_quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/osmosis.png",
    description: "",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.OSMOSISDEX],
  },
  [PROVIDERS.ZEROSWAP]: {
    id: PROVIDERS.ZEROSWAP,
    name: "ZeroSwap",
    url: "https://extension-v2.unifront.io/v2/exchange/polygon/quote",
    logo: "https://designstring.s3.ap-south-1.amazonaws.com/frontier/extension/exchange-providers/zeroswap.png",
    description:
      "ZeroSwap is a decentralized exchange (DEX) and automated market maker (AMM) protocol built on various blockchain networks, including Ethereum, Binance Smart Chain (BSC), and Polygon.",
    supportedChains: SUPPORTED_CHAINS[PROVIDERS.ZEROSWAP],
  },
};

export const OX_PROVIDER_URLS = {
  [CHAINS_IDS.AVALANCHEC]: "https://avalanche.api.0x.org/swap/v1/quote",
  [CHAINS_IDS.BSC]: "https://bsc.api.0x.org/swap/v1/quote",
  [CHAINS_IDS.FANTOM]: "https://fantom.api.0x.org/swap/v1/quote",
  [CHAINS_IDS.POLYGON]: "https://polygon.api.0x.org/swap/v1/quote",
  [CHAINS_IDS.CELO]: "https://celo.api.0x.org/swap/v1/quote",
  [CHAINS_IDS.OPTIMISM]: "https://optimism.api.0x.org/swap/v1/quote",
  [CHAINS_IDS.ARBITRUM]: "https://arbitrum.api.0x.org/swap/v1/quote",
  [CHAINS_IDS.ETHEREUM]: "https://api.0x.org/swap/v1/quote",
};

export const NATIVE_TOKEN = {
  [CHAINS_IDS.BSC]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.POLYGON]: [
    "0x0000000000000000000000000000000000001010",
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  ],
  [CHAINS_IDS.BASE]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.CELO]: ["0x471ece3750da237f93b8e339c536989b8978a438"],
  [CHAINS_IDS.OPTIMISM]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.AVALANCHEC]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.ETHEREUM]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.SOLANA]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.TEZOS]: ["kteeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.TOMOCHAIN]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.FANTOM]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.ARBITRUM]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.ALGORAND]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.HARMONY]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.ZILLIQA]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.METIS]: ["0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000"],
  [CHAINS_IDS.AURORA]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.ELROND]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.GNOSIS]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.MOONRIVER]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.MOONBEAM]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.KLAYTN]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.BOBA]: ["0x4200000000000000000000000000000000000006"],
  [CHAINS_IDS.HECO]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.BTTC]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.IOTEX]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.EVMOS]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.FUSE]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.XDC]: ["xdceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.BLUZELLE]: [],
  [CHAINS_IDS.BAND]: [],
  [CHAINS_IDS.KAVA]: [],
  [CHAINS_IDS.NEAR]: [],
  [CHAINS_IDS.POLKADOT]: [],
  [CHAINS_IDS.APTOS]: [],
  [CHAINS_IDS.CRONOS]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.ASTAR]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
  [CHAINS_IDS.SUI]: [],
  [CHAINS_IDS.COSMOSHUB]: [],
  [CHAINS_IDS.OSMOSIS]: [],
  [CHAINS_IDS.ZKSYNC]: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
};

export const GASLESS_SUPPORTED_PROVIDERS = [PROVIDERS.ZEROSWAP];

export const TOKEN_INFO_URL =
  "https://extension-v2.unifront.io/v2/token/tokenDetail";

export const NATIVE_TOKEN_INFO_URL =
  "https://extension-v2.unifront.io/v2/token/price";

export const TOKEN_INFO_URL_NEW = "https://v2.unifront.io/v2/token/info";

export const RANGO_API_KEY = import.meta.env.VITE_APP_RANGO_API_KEY;

export const SOCKET_API_KEY = import.meta.env.VITE_APP_SOCKET_API_KEY;

export const ZERO_X_API_KEY = import.meta.env.VITE_APP_ZERO_X_API_KEY;

export const HEADER_APPLICATION_JSON = {
  "Content-Type": "application/json",
};

export const DODO_HEADER_APPLICATION_JSON = {
  "user-agent": "DODO-Blocktheory",
};

export const DODO_API_KEY = "027f8831b6c70528f6";

export const BASE_EXCHANGE_URL =
  "https://extension-v2.unifront.io/v2/exchange/";

export const HTTP_SUCCESS_CODES = [200];

export const UNIFRONT_TOKEN_PRICE_URL =
  "https://extension-v2.unifront.io/v2/token/rate";

export const nativeTokenAddress = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
