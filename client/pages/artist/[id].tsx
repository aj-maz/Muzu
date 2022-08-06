import Layout from "../../components/Layout";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";

const ArtistProfile = () => {
  const router = useRouter();

  const { id } = router.query;

  const { account } = useWeb3React();

  const ARTIST = gql`
    query Artist($id: ID!) {
      artist(id: $id) {
        id
        name
        bio
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
