import { FC, useState } from "react";
import { useRouter } from "next/router";
import { upload } from "../lib/web3StorageHelper";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import Muzu from "../abis/Muzu.json";

const SetupForm: FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const { library, account } = useWeb3React();

  return (
    <div className="w-full h-full ">
      <h1 className="text-2xl font-bold">Setup the creator account</h1>
      <div className="mt-10">
        <input
          placeholder="Your Artistic Name"
          className="text-xl pl-5 w-full p-3 panel-shadow mb-5"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="What should we know about you"
          className="text-xl pl-5 w-full p-3 panel-shadow bg-white"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div className="mt-10 flex justify-center">
        <div
          className={`panel-shadow inline-block p-2 ml-5 text-lg  px-8 ${
            name ? "green-btn cursor-pointer" : "disabled-btn"
          }`}
          onClick={async () => {
            if (name) {
              const metadata = await upload({ name, bio });
              const signer = library.getSigner();

              const muzu = new ethers.Contract(
                String(process.env.NEXT_PUBLIC_MUZU_ADDRESS),
                Muzu,
                signer
              );

              await muzu.setupAccount(metadata);

              // TODO:: Should be send to the artist profile now
              // Should wait for tx to be confirmed and then transfer the user
              // Should also add a loading state
            }
          }}
        >
          Setup Account
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
