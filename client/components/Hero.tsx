import { FC } from "react";
import { injected } from "../lib/connectors";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from "next/router";

const Hero: FC = () => {
  const router = useRouter();

  const { activate } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div>
        <h1 className="text-5xl leading-normal">
          <span className="name ">MUZU</span> is a place to convert your musics
          to content locked NFTs that can be only heard by owners who bought
          them.
        </h1>
        <div className="mt-16 flex justify-center">
          <div className="cursor-pointer panel-shadow inline-block p-2 text-lg yellow-btn px-8">
            I'm a Collector
          </div>
          <div
            onClick={async () => {
              await connect();
              // TODO should check if the account setted up or not!
              router.push("/setup");
            }}
            className="cursor-pointer panel-shadow inline-block p-2 ml-5 text-lg green-btn px-8"
          >
            &nbsp;I'm a Creator&nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
