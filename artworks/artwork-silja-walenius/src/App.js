import "./App.css";
import React, {useState} from 'react';
import Art from "./artwork/artwork";
import Controls from "./controls"
import Sound from "./sound"


function App() {

  const [inhale, setInhale] = useState(4);
  const [exhale, setExhale] = useState(4);
  const [hold, setHold] = useState(4);

  return (
    <main>
      <div id="scene-container" className="App">
        <Art inhaleLength = {inhale}  exhaleLength = {exhale} holdLength = {hold}/>
      </div>
      <Controls 
        inhaleLength = {inhale} 
        exhaleLength = {exhale} 
        holdLength = {hold}
        setInhale = {setInhale}
        setExhale = {setExhale}
        setHold = {setHold}
        />
        <Sound/>
      <div id='phaseText' className='text'>inhale</div>

      <div id = 'loadingScreen' className ='loadingScreen'>
        <div id = 'loadCircle' className = 'loadingCircle'/>
      </div>
    </main>
  );
}

export default App;
