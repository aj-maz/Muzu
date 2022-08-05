import type { NextPage } from "next";

import Layout from "../components/Layout";
import SetupForm from "../components/SetupForm";

const Home: NextPage = () => {
  return (
    <Layout>
      <SetupForm />
    </Layout>
  );
};

export default Home;
