import { ReactNode, FC } from "react";
import Logo from "./Logo";
import Sidebar from "./Sidebar";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div>
      <Logo />
      <div className="flex">
        <Sidebar />
        <main className="content inline-block p-12">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
