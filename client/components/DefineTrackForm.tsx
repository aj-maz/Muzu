import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { upload } from "../lib/web3StorageHelper";
import { useWeb3React } from "@web3-react/core";
import useMuzu from "../lib/useMuzu";
import { gql, useQuery } from "@apollo/client";
import AudioPlayer from "./AudioPlayer";

const DefineTrackForm: FC = () => {
  const router = useRouter();

  const MuzuContract = useMuzu();

  const [name, setName] = useState("");
  const [coverFile, setCoverFile] = useState<File>();
  const [coverUrl, setCoverUrl] = useState("");

  const [trackFile, setTrackFile] = useState<File>();
  const [trackUrl, setTrackUrl] = useState("");

  const [loading, setLoading] = useState(false);

  console.log(trackUrl);

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
          {true ? (
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
                  console.log(URL.createObjectURL(file));
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
          className={`panel-shadow inline-block p-2 ml-5 text-lg  px-8 ${
            name && !loading ? "green-btn cursor-pointer" : "disabled-btn"
          }`}
          onClick={async () => {
            if (name && !loading) {
            }
          }}
        >
          {loading ? "Setting Up The Account" : "Setup Account"}
        </div>
      </div>
    </div>
  );
};

export default DefineTrackForm;
