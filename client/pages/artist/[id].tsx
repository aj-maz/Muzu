import { useContext, useState } from "react";
import Layout from "../../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import { FaPlay, FaPause } from "react-icons/fa";
import { LitContext } from "../../lib/LitProvider";

import getTrackUrl from "../../lib/getTrackUrl";

import { Artist, Track } from "../../lib/interfaces";

const ArtistProfile = () => {
  const router = useRouter();
  const { client } = useContext(LitContext);
  const [audios, setAudios] = useState(new Map());
  const [currentylPlayin, setCurrentlyPlaying] = useState<string | null>(null);

  const putAudio = (key: string, audio: HTMLAudioElement) => {
    const newAudios = new Map(audios);
    newAudios.set(key, audio);
    setAudios(newAudios);
  };

  const { id } = router.query;

  const { account } = useWeb3React();

  const ARTIST = gql`
    query Artist($id: ID!) {
      artist(id: $id) {
        id
        name
        bio
        tracks {
          id
          name
          cover
          content
          createdAt
          artist {
            name
          }
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(ARTIST, {
    variables: { id: String(id).toLowerCase() },
  });

  const isOwner = () =>
    String(data.artist.id).toLowerCase() === String(account).toLowerCase();

  return (
    <Layout>
      {loading ? (
        <div>
          <p className="text-lg">Loading Artist Data ...</p>
        </div>
      ) : data.artist ? (
        <div>
          <div className="mb-10">
            <div className="mb-3 flex justify-between ">
              <h1 className="text-2xl font-bold">{data.artist.name}</h1>
              {isOwner() ? (
                <div
                  onClick={() => router.push("/setup")}
                  className="cursor-pointer panel-shadow inline-block p-1 text-sm blue-btn px-4"
                >
                  Edit Info
                </div>
              ) : (
                <></>
              )}
            </div>
            <p className="text-lg">{data.artist.bio}</p>
          </div>
          {isOwner() ? (
            <header className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Creator Dashboard</h1>
              <div>
                <div
                  onClick={() => {
                    router.push("/define-track");
                  }}
                  className="cursor-pointer panel-shadow inline-block p-1 text-md yellow-btn px-4"
                >
                  Add Track
                </div>
                <div className="cursor-pointer panel-shadow inline-block ml-4 p-1 text-md sec-btn px-4">
                  Add Album
                </div>
              </div>
            </header>
          ) : (
            <></>
          )}
          <section className="mt-8">
            <h3 className="text-lg font-bold ">Tracks</h3>
            <div className="divider mt-2 "></div>

            <div className="py-4">
              {data.artist.tracks.map((track: Track) => (
                <div
                  key={track.id}
                  className="panel-shadow w-full mb-2 bg-sec p-2 px-4 flex items-center justify-between cursor-pointer"
                  onClick={() => {
                    router.push(`/track/${track.id}`);
                  }}
                >
                  <div className="w-3/6 flex items-center justify-between">
                    <img
                      src={`https://ipfs.io/ipfs/${track.cover}`}
                      className="border-2 border-black w-12 h-12"
                    />
                    <p className="">{track.name}</p>
                    <p className="">{track.artist.name}</p>
                  </div>
                  <div
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (audios.get(track.id)) {
                        const audio = audios.get(track.id);
                        if (currentylPlayin == track.id) {
                          audio.pause();
                          setCurrentlyPlaying(null);
                        } else {
                          if (audios.get(currentylPlayin)) {
                            audios.get(currentylPlayin).pause();
                          }
                          audio.play();
                          setCurrentlyPlaying(track.id);
                        }
                      } else {
                        const trackUrl = await getTrackUrl(client)(
                          track.content,
                          track.name
                        );

                        const audio = new Audio(String(trackUrl));

                        putAudio(track.id, audio);

                        audio.play();

                        setCurrentlyPlaying(track.id);
                      }
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="green-btn  w-10 h-10 border-2 border-black rounded-full flex justify-center items-center cursor-pointer">
                      {currentylPlayin !== track.id ? (
                        <FaPlay className="ml-1" />
                      ) : (
                        <FaPause />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div>
          <p className="text-lg">This artist does not exist on MUZU</p>
        </div>
      )}
    </Layout>
  );
};

export default ArtistProfile;
