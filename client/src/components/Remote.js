import React, { Component } from "react";
import Buttons from "./Buttons";
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
      term: "physicsgifs",
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
      <Buttons buttonClick={this.buttonClick} sub={this.state.subs.random} />
    );
  }

  Science() {
    return (
      <Buttons buttonClick={this.buttonClick} sub={this.state.subs.science} />
    );
  }

  Gaming() {
    return (
      <Buttons buttonClick={this.buttonClick} sub={this.state.subs.gaming} />
    );
  }

  Animals() {
    return (
      <Buttons buttonClick={this.buttonClick} sub={this.state.subs.animals} />
    );
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
        <h1 className="text-center">gifTV</h1>
      <h5 className="text-right">Watching: r/{this.state.term}</h5>
          <br />
          <div className="btn-group btn-group-justified">
          <a
            className="btn btn-default"
            onClick={event =>
              this.setState({
                isHidden: {
                  Random: false,
                  Science: true,
                  Gaming: true,
                  Animals: true
                }
              })
            }
          > Random </a>
          <a
            className="btn btn-default"
            onClick={event =>
              this.setState({
                isHidden: {
                  Random: true,
                  Science: false,
                  Gaming: true,
                  Animals: true
                }
              })
            }
          > Science </a>
          <a
            className="btn btn-default"
            onClick={event =>
              this.setState({
                isHidden: {
                  Random: true,
                  Science: true,
                  Gaming: false,
                  Animals: true
                }
              })
            }
          > Gaming </a>
          <a
            className="btn btn-default"
            onClick={event =>
              this.setState({
                isHidden: {
                  Random: true,
                  Science: true,
                  Gaming: true,
                  Animals: false
                }
              })
            }
          > Animals </a>
        </div>
        <br/>
          {!this.state.isHidden.Random && <this.Random />}
          {!this.state.isHidden.Science && <this.Science />}
          {!this.state.isHidden.Gaming && <this.Gaming />}
          {!this.state.isHidden.Animals && <this.Animals />}
        </div>        
        <div className="panel-footer">
        <h4>Enter a subreddit: </h4>
          <input
            className="form-control"
            value={this.state.term}
            onChange={event => this.onInputChange(event.target.value)}
          />
        </div>
      </div>
    );
  }
}

export default Remote;
