import type { NextPage } from "next";
import { useContext, useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { FaPlay, FaPause } from "react-icons/fa";
import { LitContext } from "../../lib/LitProvider";
import useMuzu from "../../lib/useMuzu";
import moment from "moment";
import { ethers } from "ethers";
import { injected } from "../../lib/connectors";
import ERC20 from "../../abis/ERC20.json";

import Hero from "../../components/Hero";

const Home: NextPage = () => {
  const router = useRouter();
  const [doesOwn, setDoesOwn] = useState(false);
  const { client } = useContext(LitContext);
  const { id } = router.query;
  const [mintLoading, setMintLoading] = useState(false);

  const MuzuContract = useMuzu();

  const { account, activate, active, library } = useWeb3React();

  useEffect(() => {
    const main = async () => {
      if (account) {
        setDoesOwn(await MuzuContract.doesOwnTrack(id, account));
      }
      setInterval(async () => {
        if (account) {
          setDoesOwn(await MuzuContract.doesOwnTrack(id, account));
        }
      }, 5 * 1000);
    };
    main();
  }, [account]);

  const connect = async () => {
    try {
      return await activate(injected);
    } catch (err) {
      console.log(err);
    }
  };

  const Track = gql`
    query Track($id: ID!) {
      track(id: $id) {
        id
        name
        cover
        content
        createdAt
        royaltyFee
        artist {
          id
          name
        }
        supply
        minted
        mintPrice
      }
    }
  `;

  const { data, loading, error, refetch } = useQuery(Track, {
    variables: { id: String(id).toLowerCase() },
    pollInterval: 10 * 1000,
  });

  const minting = () => {
    console.log(data);
    return (
      <div className="panel-shadow p-2 px-4 bg-sec">
        <p>Total Supply of this track is: {data.track.supply}</p>
        <p>
          <span className="font-bold">
            {data.track.supply - data.track.minted}
          </span>{" "}
          of this track is available for mint
        </p>
        <p>
          Mint Price is: $USDC &nbsp;
          {ethers.utils.formatUnits(
            ethers.BigNumber.from(data.track.mintPrice),
            18
          )}
        </p>
        <div className="flex justify-center">
          <div
            className={`panel-shadow-sm inline-block p-1 text-sm mt-3 mb-1 ${
              data.track.supply - data.track.minted > 0 && !mintLoading
                ? "cursor-pointer green-btn"
                : "disabled-btn"
            }  `}
            onClick={async () => {
              if (mintLoading) return;
              if (!active) {
                await connect();
              } else {
                const signer = library.getSigner();
                const usdc = new ethers.Contract(
                  String(process.env.NEXT_PUBLIC_USDC_ADDRESS),
                  ERC20,
                  signer
                );

                console.log(account, process.env.NEXT_PUBLIC_MUZU_ADDRESS);

                setMintLoading(true);

                const allowance = await usdc.allowance(
                  account,
                  process.env.NEXT_PUBLIC_MUZU_ADDRESS
                );

                const mintPrice = ethers.BigNumber.from(data.track.mintPrice);

                if (mintPrice.gt(allowance)) {
                  const tx1 = await usdc.approve(
                    process.env.NEXT_PUBLIC_MUZU_ADDRESS,
                    mintPrice
                  );

                  await tx1.wait();
                }

                const tx2 = await MuzuContract.mintTrack(id);
                await tx2.wait();

                setMintLoading(false);

                refetch();
              }
            }}
          >
            {!active
              ? "Activate wallet to mint"
              : mintLoading
              ? "Minting Track"
              : "Mint Track"}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      {loading ? (
        <div>
          <p className="text-lg">Loading Track Data ...</p>
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="panel-shadow p-4 bg-sec text-center">
            <img src={`https://ipfs.io/ipfs/${data.track.cover}`} />
            <h2 className="text-2xl mt-2 mb-2">{data.track.name}</h2>
            <h3 className="text-xl">{data.track.artist.name}</h3>
            <p className="mt-1">Royalty: {data.track.royaltyFee / 100}%</p>
            <p className="mt-1">
              Created At:{" "}
              {moment(data.track.createdAt * 1000).format("YYYY-MM-DD HH:mm")}
            </p>
          </div>
          <div className="">
            {false ? (
              <></>
            ) : (
              <>
                <div className="text-sm mb-4">
                  For listening to this song you need to own an instance of it.
                  You can either mint an instance or buy an offer.
                </div>
                {minting()}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <div>
            <p className="text-lg">No track found!</p>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Home;
