import type { NextPage } from "next";

import Layout from "../components/Layout";
import Hero from "../components/Hero";

const Accounting: NextPage = () => {
  return (
    <Layout>
      <div className="mb-20">
        <h1 className="text-2xl font-bold">Accounting</h1>
        <div className="mt-8 panel-shadow bg-sec w-100 flex justify-between items-center">
          <div className="p-4 text-xl">Balances: $400</div>
          <div className="yellow-btn w-64 text-center p-4 text-xl border-l-3 flex justify-center items-center cursor-pointer">
            <p>Withdraw</p>
          </div>
        </div>

        <section>
          <h3 className="text-lg font-bold mt-16">Transaction Details</h3>
          <div className="panel-shadow p-2 mt-4 bg-light-green flex justify-between">
            <p className="ml-3">0xsq1we Has minted something</p>
            <h1 className="mr-3">+ $400</h1>
          </div>
          <div className="panel-shadow p-2 mt-4 bg-light-green flex justify-between">
            <p className="ml-3">0xsq1we Has minted something</p>
            <h1 className="mr-3">+ $400</h1>
          </div>
          <div className="panel-shadow p-2 mt-4 bg-light-green flex justify-between">
            <p className="ml-3">0xsq1we Has minted something</p>
            <h1 className="mr-3">+ $400</h1>
          </div>
          <div className="panel-shadow p-2 mt-4 bg-light-green flex justify-between">
            <p className="ml-3">0xsq1we Has minted something</p>
            <h1 className="mr-3">+ $400</h1>
          </div>
          <div className="panel-shadow p-2 mt-4 bg-light-red flex justify-between">
            <p className="ml-3">You withdraw $500</p>
            <h1 className="mr-3">- $500</h1>
          </div>
          <div className="panel-shadow p-2 mt-4 bg-light-green flex justify-between">
            <p className="ml-3">0xsq1we Has minted something</p>
            <h1 className="mr-3">+ $400</h1>
          </div>
          <div className="panel-shadow p-2 mt-4 bg-light-green flex justify-between">
            <p className="ml-3">0xsq1we Has minted something</p>
            <h1 className="mr-3">+ $400</h1>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Accounting;
