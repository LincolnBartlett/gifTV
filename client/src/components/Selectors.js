import React from "react";

const Selectors = props => {
  return (
      <div className="row">
        <div className="col-xs-6">
        <button onClick={event => props.lastPost()} className="btn btn-block btn-success">
          <span
            className="glyphicon glyphicon glyphicon-step-backward"
            aria-hidden="true"
          />
        </button>
        </div>
        <div className="col-xs-6">
        <button onClick={event => props.nextPost()} className="btn btn-block btn-success">
          <span
            className="glyphicon glyphicon glyphicon-step-forward"
            aria-hidden="true"
          />
        </button>
        </div>
      </div>
  );
};

export default Selectors;
