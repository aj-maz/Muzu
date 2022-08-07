import { FC, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Token } from "../lib/interfaces";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import AsksV1_1 from "../abis/AsksV1_1.json";
import ModuleManager from "../abis/ModuleManager.json";
import useMuzu from "../lib/useMuzu";
import { Ask } from "../lib/interfaces";

const ListItem: FC<{ target: Token }> = ({ target }) => {
  const { library, account } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<number | undefined>();

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
      <div className="border-t-2 border-black p-4 flex items-center justify-between">
        Loading Track Data
      </div>
    );


  const Muzu = useMuzu();
  return (
    <div className="border-t-2 border-black p-4 flex items-center justify-between">
      <div>Token Id: {target.id}</div>
      <div>
        {data.asks.find((ask: Ask) => ask.token.id == target.id) ? (
          <>
            <div>Ask already exists</div>
          </>
        ) : (
          <>
            <input
              placeholder="Price in USDC"
              className="text-xs panel-shadow-sm pl-5 bg-sec inline-block p-3 w-40 "
              value={price}
              type="number"
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <div
              className={`text-xs panel-shadow-sm pl-5  inline-block p-3 ${
                price && price > 0 && !loading
                  ? "yellow-btn cursor-pointer"
                  : "disabled-btn"
              }`}
              onClick={async () => {
                if (loading) return;
                if (price && price) {
                  try {
                    setLoading(true);

                    const signer = library.getSigner();

                    const ZoraModuleManager = new ethers.Contract(
                      String(
                        process.env.NEXT_PUBLIC_ZORA_MODULE_MANAGER_ADDRESS
                      ),
                      ModuleManager,
                      signer
                    );

                    const isApproved = await ZoraModuleManager.isModuleApproved(
                      account,
                      process.env.NEXT_PUBLIC_ZORA_ASK_ADDRESS
                    );

                    if (!isApproved) {
                      const tx1 = await ZoraModuleManager.setApprovalForModule(
                        process.env.NEXT_PUBLIC_ZORA_ASK_ADDRESS,
                        true
                      );

                      await tx1.wait();
                    }

                    const isApprovedForAll = await Muzu.isApprovedForAll(
                      account,
                      process.env.NEXT_PUBLIC_ZORA_TRANSFER_HELPER_ADDRESS
                    );

                    if (!isApprovedForAll) {
                      const tx3 = await Muzu.setApprovalForAll(
                        process.env.NEXT_PUBLIC_ZORA_TRANSFER_HELPER_ADDRESS,
                        true
                      );

                      await tx3.wait();
                    }

                    const ZoraAsks = new ethers.Contract(
                      String(process.env.NEXT_PUBLIC_ZORA_ASK_ADDRESS),
                      AsksV1_1,
                      signer
                    );

                    const tx2 = await ZoraAsks.createAsk(
                      String(process.env.NEXT_PUBLIC_MUZU_ADDRESS),
                      target.id,
                      ethers.utils.parseUnits(String(price), 18),
                      String(process.env.NEXT_PUBLIC_USDC_ADDRESS),
                      account,
                      0
                    );

                    await tx2.wait();

                    setLoading(false);
                  } catch (err) {
                    console.log(err);
                    setLoading(false);
                  }
                }
              }}
            >
              {loading ? "Listing..." : "List"}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ListNFTS: FC<{ trackId: string; userAddress: string }> = ({
  trackId,
  userAddress,
}) => {
  const USER = gql`
    query User($id: ID!) {
      user(id: $id) {
        id
        tokens {
          id
          track {
            id
            name
          }
        }
      }
    }
  `;

  const { data, loading, error, refetch } = useQuery(USER, {
    variables: { id: String(userAddress).toLowerCase() },
    pollInterval: 10 * 1000,
  });

  if (loading) {
    return (
      <div className="mt-5 panel-shadow bg-sec p-2 text-lg">
        Loading your Tokens...
      </div>
    );
  }

  const targetNFTs = data.user.tokens.filter(
    (token: Token) => String(token.track.id) === String(trackId)
  );

  return (
    <div className="mt-5 panel-shadow bg-sec">
      <div className="p-4">List Your Track For Sale </div>
      {targetNFTs.map((target: Token) => (
        <ListItem key={target.id} target={target} />
      ))}
    </div>
  );
};

export default ListNFTS;
