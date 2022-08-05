import { ReactNode, FC } from "react";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <header className="border-b-4 border-black ">
        <div className="w-80 border-black border-r-4 flex items-center justify-center bg-sec">
          <h1 className="logo ">MUZU</h1>
        </div>
      </header>
      <div className="flex">
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
        <main className="content inline-block p-12">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
