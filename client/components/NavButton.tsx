import { FC } from "react";

const NavButton: FC<{
  isActive: boolean;
  label: string;
  onClick: Function;
}> = ({ isActive, onClick, label }) => {
  return (
    <div
      onClick={() => onClick()}
      className="p-2 mb-4 flex justify-center items-center"
    >
      <div
        className={`panel-shadow cursor-pointer text-2xl p-2  w-64 text-center ${
          isActive ? "sidebar-active-btn" : "sidebar-btn"
        }`}
      >
        {label}
      </div>
    </div>
  );
};

export default NavButton;
