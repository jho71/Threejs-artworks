import React, { useEffect, useState } from "react";
import audio from "./static/spacewave.mp3";

const Sound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [song] = useState(new Audio(audio))
  song.volume = 0.1;
  song.loop = true;

  const toggleSound = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    isPlaying ? song.play() : song.pause()
  }, [isPlaying, song]);

  return (
    <div className="audioButton">
      <button
        className="desktopButton"
        onClick={() => {
          toggleSound();
        }}
      >
        <span> {isPlaying ? 'pause music' : 'play music'} </span>
      </button>

      <button className = "mobileButton" onClick={() => {
          toggleSound();
        }}>

        <div className={isPlaying ? `lines` : `lines paused`}>
        <span className="line line1"/>
        <span className="line line2"/>
        <span className="line line3"/>
        </div>


      </button>
    </div>
  );
};

export default Sound;
