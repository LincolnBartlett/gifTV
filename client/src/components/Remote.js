import React, { Component } from "react";
import Buttons from "./Buttons";
//component for choosing subreddit to watch
class Remote extends Component {
  constructor(props) {
    super(props);
    this.buttonClick = this.buttonClick.bind(this);
    this.Random = this.Random.bind(this);
    this.Science = this.Science.bind(this);
    this.Funny = this.Funny.bind(this);
    this.Animals = this.Animals.bind(this);

    this.state = {
      term: "densegifs",
      subs: {
        funny: [
          "funnygifs",
          "holdmybeer",
          "whatcouldgowrong",
          "reactiongifs",
          "hmmmgifs",
          "gifextra",
          "BetterEveryLoop",
          "gifsthatkeepongiving",
          "densegifs"
        ],
        random: [
          "gif",
          "gifs",
          "gifrecipes",
          "InterestingGifs",
          "perfectloops",
          "Cinemagraphs",
          "StarTrekGifs",
          "fullmoviegifs",
          "SuperAthleteGifs",
          "silentmoviegifs",         
          "GTAgifs", 
          "GamePhysics"
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
        Science: true,
        Funny: true,
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

  Funny() {
    return (
      <Buttons buttonClick={this.buttonClick} sub={this.state.subs.funny} />
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
        <div className="panel-heading text-center">
        <h1>gifTV</h1>
        <a href="https://github.com/LincolnBartlett/gifTV" target="_blank">View on GitHub</a>
        <h5 className="text-right">Watching: r/{this.state.term}</h5>
          <br />
          <div className="btn-group btn-group-justified">
            <a
                className="btn btn-default"
                onClick={event =>
                  this.setState({
                    isHidden: {
                      Random: true,
                      Science: true,
                      Funny: false,
                      Animals: true
                    }
                  })
                }
              > Funny </a>
            <a
              className="btn btn-default"
              onClick={event =>
                this.setState({
                  isHidden: {
                    Random: true,
                    Science: false,
                    Funny: true,
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
                    Funny: true,
                    Animals: false
                  }
                })
              }
            > Animals </a>
            <a
              className="btn btn-default"
              onClick={event =>
                this.setState({
                  isHidden: {
                    Random: false,
                    Science: true,
                    Funny: true,
                    Animals: true
                  }
                })
              }
            > Random </a>
        </div>
        <br/>
          {!this.state.isHidden.Random && <this.Random />}
          {!this.state.isHidden.Science && <this.Science />}
          {!this.state.isHidden.Funny && <this.Funny />}
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
