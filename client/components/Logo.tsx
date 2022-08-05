import { ReactNode, FC } from "react";

const Logo: FC = () => {
  return (
    <header className="border-b-4 border-black ">
      <div className="w-80 border-black border-r-4 flex items-center justify-center bg-sec">
        <h1 className="logo ">MUZU</h1>
      </div>
    </header>
  );
};

export default Logo;
