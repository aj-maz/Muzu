import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { upload } from "../lib/web3StorageHelper";
import { useWeb3React } from "@web3-react/core";
import useMuzu from "../lib/useMuzu";
import { gql, useQuery } from "@apollo/client";

const SetupForm: FC = () => {
  const router = useRouter();

  const MuzuContract = useMuzu();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const { library, account } = useWeb3React();

  useEffect(() => {
    if (!library) {
      router.push("/");
    }
  }, [library]);

  const ARTIST = gql`
    query Artist($id: ID!) {
      artist(id: $id) {
        id
        name
        bio
      }
    }
  `;

  const {
    data,
    loading: dataLoading,
    error,
  } = useQuery(ARTIST, {
    variables: { id: account ? account.toLowerCase() : "" },
  });

  useEffect(() => {
    if (data && data.artist) {
      setName(data.artist.name);
      setBio(data.artist.bio);
    }
  }, [data]);

  return (
    <div className="w-full h-full ">
      <h1 className="text-2xl font-bold">Setup the creator account info</h1>
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
            name && !loading ? "green-btn cursor-pointer" : "disabled-btn"
          }`}
          onClick={async () => {
            if (name && !loading) {
              const metadata = await upload({ name, bio });

              const tx = await MuzuContract.setupAccount(metadata);

              setLoading(true);
              await tx.wait();
              setLoading(false);

              // TODO:: Should be send to the artist profile now
              // Should wait for tx to be confirmed and then transfer the user
              // Should also add a loading state
            }
          }}
        >
          {loading ? "Setting Up The Account" : "Setup Account"}
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
