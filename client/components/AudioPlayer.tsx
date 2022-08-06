import { FC, useState, useEffect } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import ProgressBar from "@ramonak/react-progress-bar";
import useAudioPlayer from "../lib/useAudioPlayer";
import Slider from "rc-slider";

const AudioPlayer: FC<{ src: string }> = ({ src }) => {
  const { curTime, duration, playing, setPlaying, setClickedTime } =
    useAudioPlayer(`audio-player-${src}`);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration - minutes * 60);
    if (minutes < 10 && seconds < 10) return `0${minutes}:0${seconds}`;
    if (minutes < 10) return `0${minutes}:${seconds}`;
    if (seconds < 10) return `${minutes}:0${seconds}`;
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="panel-shadow bg-sec p-2 px-5">
      <audio controls id={`audio-player-${src}`} className="hidden">
        <source src={src} />
      </audio>
      <div id="audio-player-container " className="flex items-center justify-between">
        <div
          onClick={() => {
            setPlaying(!playing);
          }}
          className="green-btn  w-10 h-10 border-2 border-black rounded-full flex justify-center items-center cursor-pointer"
        >
          {!playing ? <FaPlay className="ml-1" /> : <FaPause />}
        </div>
        <div className="text-lg">
          {formatDuration(Number(curTime))}/{formatDuration(Number(duration))}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
