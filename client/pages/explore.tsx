import type { NextPage } from "next";
import { gql, useQuery } from "@apollo/client";
import Layout from "../components/Layout";
import Hero from "../components/Hero";
import { Artist, Track } from "../lib/interfaces";
import ImageShowcase from "../components/ImageShowcase";

const ARTISTS = gql`
  {
    artists(first: 1000) {
      id
      balance
      name
      bio
      cover
    }
  }
`;

const TRACKS = gql`
  {
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
`;

const Explore: NextPage = () => {
  const { data, loading, error } = useQuery(ARTISTS);
  const { data: trackData, loading: trackLoading } = useQuery(TRACKS);

  if (loading || trackLoading)
    return (
      <Layout>
        <section className="mt">
          <h3 className="text-lg font-bold ">Loading Artists and Tracks</h3>
        </section>
      </Layout>
    );

  return (
    <Layout>
      <section className="mt">
        <h3 className="text-lg font-bold ">Artists</h3>
        <div className="divider mt-2 mb-4 "></div>
        {data.artists.map((artist: Artist) => (
          <ImageShowcase
            key={artist.id}
            image={`https://ipfs.io/ipfs/${artist.cover}`}
            title={artist.name}
            goTo={`/artist/${artist.id}`}
          />
        ))}
      </section>
      <section className="mt-10">
        <h3 className="text-lg font-bold ">Tracks</h3>
        <div className="divider mt-2 mb-4 "></div>
        {[...trackData.tracks].map((track: Track) => (
          <ImageShowcase
            key={track.id}
            image={`https://ipfs.io/ipfs/${track.cover}`}
            title={track.name}
            goTo={`/track/${track.id}`}
          />
        ))}
      </section>
    </Layout>
  );
};

export default Explore;
