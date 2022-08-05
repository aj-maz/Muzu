import type { NextPage } from "next";

import Layout from "../components/Layout";

const Home: NextPage = () => {
  return (
    <div>
      <Layout>
        <div className="p-2 mt-4 flex justify-center items-center">
          <div className="panel-shadow  cursor-pointer text-2xl p-2 sidebar-btn bg-sec w-64 text-center">
            Profile
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
