import React, {useRef, useEffect} from "react";

const Slider = ({ name, curValue, setValue }) => {
    //use refs to set value of sliders
    const sliderRef = useRef(null)

    useEffect(()=>{
      sliderRef.current.value = curValue * 10
    },[curValue])

  return (
    <div className="sliderObject">
      <div className="label">
        <span>{name}</span>
        <span>{curValue}</span>
      </div>

      <input
        ref = {sliderRef}
        type="range"
        min="10"
        max="100"
        defaultValue={curValue * 10}
        name={name}
        className="slider"
        //onChange = {(e) =>{setValue(e.target.value)}}
        onChange={(e) => {
          setValue(Math.ceil(parseFloat((e.target.value / 10))));
        }}
      />
    </div>
  );
};

export default Slider;

