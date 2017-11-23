import "./style/bootstrap/css/theme.css";
import "./style/custom.css";
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
    this.nextPage = this.nextPage.bind(this);
    this.state = {
      text: "physicsgifs",
      posts: []
    };
  }

  componentDidMount() {
    axios.get(`https://www.reddit.com/r/${this.state.text}.json?limit=100&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({posts});
    });
  }

  changeTerm(text) {
    this.setState({ text });
    axios.get(`https://www.reddit.com/r/${this.state.text}.json?limit=100&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({posts});
    });
  }

  nextPage(subreddit, postname){
    axios.get(`https://www.reddit.com/r/${subreddit}.json?limit=100&after=${postname}&/`).then(res => {
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
        <div className="row">
        <br />
        <Screen 
          output={this.state.text}
          list={this.state.posts} 
          nextPage={this.nextPage}/>
        <Remote 
          onSearchTermChange={throttle}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
