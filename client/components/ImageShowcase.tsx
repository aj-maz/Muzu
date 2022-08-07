import { FC } from "react";
import { useRouter } from "next/router";

const ImageShowcase: FC<{ image: string; title: string; goTo: string }> = ({
  image,
  title,
  goTo,
}) => {
  const router = useRouter();

  return (
    <div className="inline-block">
      <div
        onClick={() => router.push(goTo)}
        className="panel-shadow inline-block w-64 bg-sec p-4 cursor-pointer flex flex-col items-center justify-center mr-4"
      >
        <img src={image} className="border-2 border-black w-48" />
        <p className="mt-2 font-bold text-center">{title}</p>
      </div>
    </div>
  );
};

export default ImageShowcase;
