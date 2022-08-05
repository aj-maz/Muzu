import { FC } from "react";

const Hero: FC = () => {
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
          <div className="cursor-pointer panel-shadow inline-block p-2 ml-5 text-lg green-btn px-8">
          &nbsp;I'm a Creator&nbsp;
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
