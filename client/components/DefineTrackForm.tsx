import { FC, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { upload, uploadFile } from "../lib/web3StorageHelper";
import { useWeb3React } from "@web3-react/core";
import useMuzu from "../lib/useMuzu";
import { gql, useQuery } from "@apollo/client";
import AudioPlayer from "./AudioPlayer";
import encryptFile from "../lib/encryptFile";
import { LitContext } from "../lib/LitProvider";
import { ethers } from "ethers";

const DefineTrackForm: FC = () => {
  const router = useRouter();
  const { client } = useContext(LitContext);

  const { account } = useWeb3React();

  const MuzuContract = useMuzu();

  const [name, setName] = useState("");
  const [mintPrice, setMintPrice] = useState<number | undefined>();
  const [supply, setSupply] = useState<number | undefined>();
  const [royaltyPercent, setRoyaltyPercent] = useState<number | undefined>();
  const [coverFile, setCoverFile] = useState<File>();
  const [coverUrl, setCoverUrl] = useState("");

  const [trackFile, setTrackFile] = useState<File>();
  const [trackUrl, setTrackUrl] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!account) {
      router.push("/");
    }
  }, [account]);

  return (
    <div className="w-full h-full ">
      <h1 className="text-2xl font-bold">Define a track</h1>
      <div className="mt-10">
        <input
          placeholder="Track Name"
          className="text-xl pl-5 w-full p-3 panel-shadow mb-10"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Mint Price In USDC"
          className="text-xl pl-5 w-full p-3 panel-shadow mb-10"
          value={mintPrice}
          onChange={(e) => setMintPrice(Number(e.target.value))}
          type="number"
        />
        <input
          placeholder="Supply"
          className="text-xl pl-5 w-full p-3 panel-shadow mb-10"
          value={supply}
          onChange={(e) => setSupply(Number(e.target.value))}
          type="number"
        />
        <input
          placeholder="Royalty Percent"
          className="text-xl pl-5 w-full p-3 panel-shadow mb-10"
          value={royaltyPercent}
          onChange={(e) => setRoyaltyPercent(Number(e.target.value))}
          type="number"
        />
        <div className="mb-10">
          {coverUrl ? (
            <>
              <div>
                <img src={coverUrl} className="w-64 mb-5 panel-shadow" />
              </div>
            </>
          ) : (
            <></>
          )}

          <div>
            <label
              htmlFor="cover-upload"
              className="panel-shadow text-lg p-2 yellow-btn cursor-pointer "
            >
              {coverUrl ? "Change Cover" : "Upload Cover"}
            </label>
            <input
              className="hidden"
              id="cover-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  setCoverFile(file);
                  setCoverUrl(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </div>
        <div>
          {trackUrl ? (
            <>
              <div className="mb-5">
                <AudioPlayer src={trackUrl} />
              </div>
            </>
          ) : (
            <></>
          )}
          <div>
            <label
              htmlFor="trakc-upload"
              className="panel-shadow text-lg p-2 yellow-btn cursor-pointer"
            >
              {trackFile ? "Change Track File" : "Upload Track File"}
            </label>
            <input
              className="hidden"
              id="trakc-upload"
              type="file"
              accept="mp3,audio/*"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  setTrackFile(file);
                  setTrackUrl(URL.createObjectURL(file));
                  // Let's start uploading these shits
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-center">
        <div
          className={`panel-shadow inline-block p-2 ml-5 text-lg mb-16 px-8 ${
            name &&
            coverFile &&
            trackFile &&
            !loading &&
            Number(royaltyPercent) >= 0 &&
            Number(royaltyPercent) < 100 &&
            Number(mintPrice) >= 0
              ? "green-btn cursor-pointer"
              : "disabled-btn"
          }`}
          onClick={async () => {
            if (
              name &&
              coverFile &&
              trackFile &&
              !loading &&
              Number(royaltyPercent) >= 0 &&
              Number(royaltyPercent) < 100 &&
              Number(mintPrice) >= 0
            ) {
              setLoading(true);

              const cover = await uploadFile(coverFile);
              const track = await encryptFile(client, trackFile);

              const metadata = await upload({ name, cover, track });

              const trackInfo = {
                metadata,
                mintPrice: ethers.utils.parseUnits(String(mintPrice), 18),
                supply,
                royaltyInfo: {
                  receiver: account,
                  royaltyFraction: Number(royaltyPercent) * 100,
                },
              };

              const tx = await MuzuContract.defineTrack(trackInfo);
              await tx.wait();

              setLoading(false);
            }
          }}
        >
          {loading ? "Defining The Track ..." : "Define The Track"}
        </div>
      </div>
    </div>
  );
};

export default DefineTrackForm;
