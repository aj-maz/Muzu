import { FC, useState } from "react";
import { useRouter } from "next/router";

const SetupForm: FC = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  return (
    <div className="w-full h-full ">
      <h1 className="text-2xl font-bold">Setup the creator account</h1>
      <div className="mt-10">
        <input
          placeholder="Your Artistic Name"
          className="text-xl pl-5 w-full p-3 panel-shadow mb-5"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="What should we know about you"
          className="text-xl pl-5 w-full p-3 panel-shadow bg-white"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <div className="mt-10 flex justify-center">
        <div
          className={`panel-shadow inline-block p-2 ml-5 text-lg  px-8 ${
            name ? "green-btn cursor-pointer" : "disabled-btn"
          }`}
        >
          Setup Account
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
