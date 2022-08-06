import { FC } from "react";
import NavButton from "./NavButton";
import { useRouter } from "next/router";

const Sidebar: FC = () => {
  const router = useRouter();

  return (
    <nav className=" border-black w-80 border-black border-r-4 sidebar bg-sec inline-block">
      <div className="pt-8">
        <NavButton
          isActive={router.pathname === "/"}
          label="Home"
          onClick={() => {
            router.push("/");
          }}
        />
        <NavButton
          isActive={router.pathname === "/explore"}
          label="Explore"
          onClick={() => {
            router.push("/explore");
          }}
        />
        <NavButton
          isActive={router.pathname === "/dashboard"}
          label="Dashboard"
          onClick={() => {
            router.push("/dashboard");
          }}
        />
        <NavButton
          isActive={router.pathname === "/accounting"}
          label="Accounting"
          onClick={() => {
            router.push("/accounting");
          }}
        />
        <NavButton
          isActive={router.pathname === "/profile"}
          label="Profile"
          onClick={() => {
            router.push("/profile");
          }}
        />
      </div>
    </nav>
  );
};

export default Sidebar;
