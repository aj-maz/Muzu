import { useWeb3React } from "@web3-react/core";
import Muzu from "../abis/Muzu.json";
import { ethers } from "ethers";

const useMuzu = () => {
  const { library, account } = useWeb3React();

  let muzu;

  if (library) {
    const signer = library.getSigner();

    muzu = new ethers.Contract(
      String(process.env.NEXT_PUBLIC_MUZU_ADDRESS),
      Muzu,
      signer
    );
  } else {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_STATIC_RPC
    );
    muzu = new ethers.Contract(
      String(process.env.NEXT_PUBLIC_STATIC_RPC),
      Muzu,
      provider
    );
  }

  return muzu;
};

export default useMuzu;
