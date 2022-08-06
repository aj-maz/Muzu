import type { NextPage } from "next";

import Layout from "../components/Layout";
import DefineTrackForm from "../components/DefineTrackForm";

const DefineTrack: NextPage = () => {
  return (
    <Layout>
      <DefineTrackForm />
    </Layout>
  );
};

export default DefineTrack;
