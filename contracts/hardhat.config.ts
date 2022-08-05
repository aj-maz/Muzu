import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

const MUMBAI_PRIVATE_KEY =
  "4455cd9e24d853d9696639318ea3b57d299590bc7e328be1a0d4375610041434";

const POLYGON_SCAN_API = "93IV7F2QHMYGKUZ8R4ZR9SEUTNB58HF479";

const MUMBAI_RPC =
  "https://polygon-mumbai.g.alchemy.com/v2/PKDcpW-zo09u7KieHzUl5H0qujGgr5nv";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: MUMBAI_RPC,
      accounts: [MUMBAI_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: POLYGON_SCAN_API,
  },
};

export default config;
