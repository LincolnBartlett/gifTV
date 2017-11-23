import React from "react";

const Buttons = props => {
  const subButtons = props.sub.map(sub => {
    return (
        <button
            className="btn btn-xs btn-block btn-default"
            key={sub}
            onClick={event => props.buttonClick(sub)}
        >
            /r/{sub}
        </button> 
    );
  });
  return <div>{subButtons}</div>;
};

export default Buttons;
