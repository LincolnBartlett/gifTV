import "./bootstrap/dist/css/theme.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import _ from "lodash";
import registerServiceWorker from "./registerServiceWorker";
import Screen from "./components/Screen";
import Remote from "./components/Remote";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "silentmoviegifs",
      posts: []
    };
  }

  changeTerm(text) {
    this.setState({ text });
    axios.get(`https://www.reddit.com/r/${this.state.text}.json`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({ posts });
    });
  }

  componentDidMount() {
    axios.get(`https://www.reddit.com/r/${this.state.text}.json`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({ posts });
    });
  }

  render() {
    const throttle = _.debounce(term => {
      this.changeTerm(term);
    }, 500);
    return (
      <div className="container">
        <br />
        <Screen output={this.state.text} list={this.state.posts} />
        <Remote onSearchTermChange={throttle} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
