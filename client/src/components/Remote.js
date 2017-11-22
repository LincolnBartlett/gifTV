import React, { Component } from "react";
import Button from "./Button";
//component for choosing subreddit to watch
class Remote extends Component {
  constructor(props) {
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
    this.Random = this.Random.bind(this);
    this.Science = this.Science.bind(this);
    this.Gaming = this.Gaming.bind(this);
    this.Animals = this.Animals.bind(this);

    this.state = {
      term: "silentmoviegifs",
      subs: {
        random: [
          "gif",
          "gifs",
          "gifv",
          "gfycats",
          "InterestingGifs",
          "perfectloops",
          "BetterEveryLoop",
          "Cinemagraphs",
          "gifsthatkeepongiving",
          "gifextra",
          "reactiongifs",
          "StarTrekGifs",
          "hero0fwar",
          "HighlightGIFS",
          "EditingAndLayout",
          "fullmoviegifs",
          "gifrecipes",
          "SuperAthleteGifs",
          "silentmoviegifs",
          "hmmmgifs"
        ],
        science: [
          "physicsgifs",
          "aviationgifs",
          "spacegifs",
          "NatureGifs",
          "mechanical_gifs",
          "chemicalreactiongifs",
          "educationalgifs",
          "MarineBiologyGifs"
        ],
        gaming: ["gaminggifs", "GTAgifs", "GamePhysics"],
        animals: [
          "zoomies",
          "tippytaps",
          "kittengifs",
          "aww_gifs",
          "AnimalTextGifs",
          "BigCatGifs"
        ]
      },
      isHidden: {
        Random: true,
        Science: false,
        Gaming: true,
        Animals: true
      }
    };
  }

  onInputChange(term) {
    this.setState({ term });
    this.props.onSearchTermChange(term);
  }

  buttonClick(term) {
    this.onInputChange(term);
  }

  Random() {
    return (
      <Button buttonClick={this.buttonClick} sub={this.state.subs.random} />
    );
  }

  Science() {
    return (
      <Button buttonClick={this.buttonClick} sub={this.state.subs.science} />
    );
  }

  Gaming() {
    return (
      <Button buttonClick={this.buttonClick} sub={this.state.subs.gaming} />
    );
  }

  Animals() {
    return (
      <Button buttonClick={this.buttonClick} sub={this.state.subs.animals} />
    );
  }

  render() {
    return (
      <div className="col-lg-4 panel panel-default">
        <div className="panel-body">
          <h3>Type a subreddit: </h3>
          <input
            className="form-control"
            value={this.state.term}
            onChange={event => this.onInputChange(event.target.value)}
          />
          <hr />
          <ul className="nav nav-pills nav-justified">
            <li>
              <a
                className="btn btn-sm btn-default"
                onClick={event =>
                  this.setState({
                    isHidden: {
                      Random: false,
                      Science: true,
                      Gaming: true,
                      Animals: true
                    }
                  })}
              >
                Random
              </a>
            </li>
            <li>
              <a
                className="btn btn-sm btn-default"
                onClick={event =>
                  this.setState({
                    isHidden: {
                      Random: true,
                      Science: false,
                      Gaming: true,
                      Animals: true
                    }
                  })}
              >
                Science
              </a>
            </li>
            <li>
              <a
                className="btn btn-sm  btn-default"
                onClick={event =>
                  this.setState({
                    isHidden: {
                      Random: true,
                      Science: true,
                      Gaming: false,
                      Animals: true
                    }
                  })}
              >
                Gaming
              </a>
            </li>
            <li>
              <a
                className="btn btn-sm  btn-default"
                onClick={event =>
                  this.setState({
                    isHidden: {
                      Random: true,
                      Science: true,
                      Gaming: true,
                      Animals: false
                    }
                  })}
              >
                Animals
              </a>
            </li>
          </ul>
          <br />
          {!this.state.isHidden.Random && <this.Random />}
          {!this.state.isHidden.Science && <this.Science />}
          {!this.state.isHidden.Gaming && <this.Gaming />}
          {!this.state.isHidden.Animals && <this.Animals />}
        </div>
      </div>
    );
  }
}

export default Remote;
