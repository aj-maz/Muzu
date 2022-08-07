import { FC, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Token } from "../lib/interfaces";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import AsksV1_1 from "../abis/AsksV1_1.json";
import ERC20 from "../abis/ERC20.json";
import useMuzu from "../lib/useMuzu";
import { Ask } from "../lib/interfaces";

const AskItem: FC<{ ask: Ask }> = ({ ask }) => {
  const { library, account } = useWeb3React();
  const [loading, setLoading] = useState(false);

  const Muzu = useMuzu();

  return (
    <div className="p-4 ">
      <div>
        A listing available for{" "}
        {ethers.utils.formatUnits(String(ask.price), 18)} $USDC for token
        number: {ask.token.id}
      </div>
      <div
        className={`text-xs panel-shadow-sm  inline-block p-2 mt-2 ${
          account && !loading ? "yellow-btn cursor-pointer" : "disabled-btn"
        }`}
        onClick={async () => {
          if (loading) return;
          setLoading(true);
          try {
            const signer = library.getSigner();

            const ZoraAsks = new ethers.Contract(
              String(process.env.NEXT_PUBLIC_ZORA_ASK_ADDRESS),
              AsksV1_1,
              signer
            );

            const usdc = new ethers.Contract(
              String(process.env.NEXT_PUBLIC_USDC_ADDRESS),
              ERC20,
              signer
            );

            const allowance = await usdc.allowance(
              account,
              process.env.NEXT_PUBLIC_ZORA_ASK_ADDRESS
            );

            const askPrice = ethers.BigNumber.from(ask.price);

            //const tx2 = await usdc.approve(
            //  process.env.NEXT_PUBLIC_ZORA_ASK_ADDRESS,
            //  askPrice.mul(100000)
            //);
//
            //await tx2.wait();

           // console.log(ask.price)
//
           // const tx1 = await ZoraAsks.fillAsk(
           //   String(process.env.NEXT_PUBLIC_MUZU_ADDRESS),
           //   ask.token.id,
           //   String(process.env.NEXT_PUBLIC_USDC_ADDRESS),
           //   askPrice,
           //   account
           // );
//
           // await tx1.wait();
            setLoading(false);
          } catch (err) {
            console.log(err);
            setLoading(false);
          }
        }}
      >
        Fill The Ask
      </div>
    </div>
  );
};

const FillAsk: FC<{ trackId: string; userAddress: string }> = ({
  trackId,
  userAddress,
}) => {
  const ASKS = gql`
    {
      asks(where: { finalized: false }, first: 1000) {
        id
        test
        test2
        token {
          id
        }
        track {
          id
        }
        price
        asker {
          id
        }
        finalized
      }
    }
  `;

  const {
    data,
    loading: asksLoading,
    error,
    refetch,
  } = useQuery(ASKS, {
    pollInterval: 10 * 1000,
  });

  if (asksLoading)
    return (
      <div className="mt-5 panel-shadow bg-sec">
        <div className="p-4">Loading the track listings</div>
      </div>
    );

  const filteredAsks = data.asks.filter((ask: Ask) => ask.token.id == trackId);

  if (filteredAsks.length < 1)
    return (
      <div className="mt-5 panel-shadow bg-sec">
        <div className="p-4">
          No listing is currently available for this track
        </div>
      </div>
    );

  return (
    <div className="mt-5 panel-shadow bg-sec">
      {filteredAsks.map((ask: Ask) => (
        <AskItem key={ask.id} ask={ask} />
      ))}
    </div>
  );
};

export default FillAsk;
