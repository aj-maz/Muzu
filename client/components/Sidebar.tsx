import { FC } from "react";

const Sidebar: FC = () => {
  return (
    <nav className=" border-black w-80 border-black border-r-4 sidebar bg-sec inline-block">
      <div className="pt-8">
        <div className="p-2 flex justify-center items-center">
          <div className="panel-shadow  cursor-pointer text-2xl p-2 sidebar-btn bg-sec w-64 text-center">
            Home
          </div>
        </div>
        <div className="p-2 mt-4 flex justify-center items-center">
          <div className="panel-shadow  cursor-pointer text-2xl p-2 sidebar-btn bg-sec w-64 text-center">
            Explore
          </div>
        </div>
        <div className="p-2 mt-4 flex justify-center items-center">
          <div className="panel-shadow  cursor-pointer text-2xl p-2 sidebar-btn bg-sec w-64 text-center">
            Dashboard
          </div>
        </div>
        <div className="p-2 mt-4 flex justify-center items-center">
          <div className="panel-shadow  cursor-pointer text-2xl p-2 sidebar-btn bg-sec w-64 text-center">
            Accounting
          </div>
        </div>
        <div className="p-2 mt-4 flex justify-center items-center">
          <div className="panel-shadow  cursor-pointer text-2xl p-2 sidebar-btn bg-sec w-64 text-center">
            Profile
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
