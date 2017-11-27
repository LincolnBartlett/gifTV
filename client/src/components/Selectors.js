import React from "react";

const Selectors = props => {
  return (
      <div className="col-xs-4 text-right">
        <button onClick={event => props.lastPost()} className="btn btn-default">
          <span
            className="glyphicon glyphicon glyphicon-step-backward"
            aria-hidden="true"
          />
        </button>
        <button onClick={event => props.nextPost()} className="btn btn-success">
        Next
          <span
            className="glyphicon glyphicon glyphicon-step-forward"
            aria-hidden="true"
          />
        </button>
      </div>
  );
};

export default Selectors;
