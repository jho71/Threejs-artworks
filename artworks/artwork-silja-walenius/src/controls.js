import React from 'react'
import Slider from "./slider";

function Controls({
  inhaleLength,
  exhaleLength,
  holdLength,
  setInhale,
  setExhale,
  setHold,
}) 
{
  function handleClick (inVal, outVal, holdVal){ 
     setInhale(inVal)
     setExhale(outVal)
     setHold(holdVal)
  }


  return (
    <div className="sliderContainer">
      <Slider name={"inhale"} curValue={inhaleLength} setValue={setInhale} />
      <Slider name={"exhale"} curValue={exhaleLength} setValue={setExhale} />
      <Slider name={"hold"} curValue={holdLength} setValue={setHold} />

      <div className = 'buttonContainer'>
        <button onClick ={()=>{ handleClick(3, 8, 5)}}>
          <span className = "breathButton"> 
            grounding
          </span>
        </button>

        <button onClick={() => {handleClick(8,4,3)}}>
        <span className = "breathButton"> 
            energizing
          </span>
        </button>

        <button onClick={() => {handleClick(4,4,4)}}>
        <span className = "breathButton"> 
            balancing
          </span>
        </button>
      </div>

    </div>
  );
}

export default Controls;
