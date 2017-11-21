import React, { Component } from "react";
//component for choosing subreddit to watch
class Remote extends Component {
  constructor(props) {
    super(props);
    this.buttonClick = this.buttonClick.bind(this);

    this.state = { term: "silentmoviegifs" };
  }

  onInputChange(term) {
    this.setState({ term });
    this.props.onSearchTermChange(term);
  }

  buttonClick(term) {
    this.onInputChange(term);
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
          <div className="btn-group">
            <p>Random :</p>
            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("gif")}
            >
              /r/GIF
            </button>
            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("gifs")}
            >
              /r/Gifs
            </button>

            <button
              className="btn btn-sm btn-default "
              onClick={event => this.buttonClick("gifv")}
            >
              /r/gifv
            </button>

            <button
              className="btn btn-sm btn-default "
              onClick={event => this.buttonClick("gfycats")}
            >
              /r/gfycats
            </button>

            <button
              className="btn btn-sm btn-default "
              onClick={event => this.buttonClick("InterestingGifs")}
            >
              /r/InterestingGifs
            </button>

            <button
              className="btn btn-sm btn-default "
              onClick={event => this.buttonClick("perfectloops")}
            >
              /r/perfectloops
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("BetterEveryLoop")}
            >
              /r/BetterEveryLoop
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("Cinemagraphs")}
            >
              /r/Cinemagraphs
            </button>
            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("gifsthatkeepongiving")}
            >
              /r/gifsthatkeepongiving
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("gifextra")}
            >
              /r/gifextra
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("reactiongifs")}
            >
              /r/reactiongifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("StarTrekGifs")}
            >
              /r/StarTrekGifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("hero0fwar")}
            >
              /r/hero0fwar
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("HighlightGIFS")}
            >
              /r/HighlightGIFS
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("EditingAndLayout")}
            >
              /r/EditingAndLayout
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("fullmoviegifs")}
            >
              /r/FullMovieGifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("gifrecipes")}
            >
              /r/GifRecipes
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("SuperAthleteGifs")}
            >
              /r/SuperAthleteGifs
            </button>
            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("silentmoviegifs")}
            >
              /r/silentmoviegifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("hmmmgifs")}
            >
              /r/hmmmgifs
            </button>

          </div>
          <div className="btn-group">
            <p>Science :</p>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("physicsgifs")}
            >
              /r/physicsgifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("aviationgifs")}
            >
              /r/AviationGifs
            </button>
            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("spacegifs")}
            >
              /r/spacegifs
            </button>
            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("NatureGifs")}
            >
              /r/NatureGifs
            </button>
            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("mechanical_gifs")}
            >
              /r/mechanical_gifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("chemicalreactiongifs")}
            >
              /r/chemicalreactiongifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("educationalgifs")}
            >
              /r/educationalgifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("MarineBiologyGifs")}
            >
              /r/MarineBiologyGifs
            </button>
          </div>
          <div className="btn-group">
            <p>Gaming :</p>
            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("gaminggifs")}
            >
              /r/gaminggifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("GTAgifs")}
            >
              /r/GTAgifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("GamePhysics")}
            >
              /r/GamePhysics
            </button>

          </div>
          <div className="btn-group">
            <p>Animals :</p>
            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("zoomies")}
            >
              /r/zoomies
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("tippytaps")}
            >
              /r/TippyTaps
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("kittengifs")}
            >
              /r/kittengifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("aww_gifs")}
            >
              /r/aww_gifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("AnimalTextGifs")}
            >
              /r/AnimalTextGifs
            </button>

            <button
              className="btn btn-sm btn-default"
              onClick={event => this.buttonClick("BigCatGifs")}
            >
              /r/BigCatGifs
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Remote;
