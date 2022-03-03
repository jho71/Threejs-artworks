

const Button = ({setInhale, setExhale, setHold, inVal, outVal, holdVal, name}) => {
  const handleClick = (inVal, outVal, holdVal) => { 
    setInhale(inVal)
    setExhale(outVal)
    setHold(holdVal)
  }

    return (
        <button onClick = {handleClick(inVal, outVal, holdVal)}>
          <span className = "breathButton"> 
            {name}
          </span>
        </button>

    );
  };
  
  export default Button;
  