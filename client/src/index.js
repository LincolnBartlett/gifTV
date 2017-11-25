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
    axios.get(`https://www.reddit.com/r/${this.state.text}.json?limit=50&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({posts});
    });
  }

  changeTerm(text) {
    this.setState({ text });
    axios.get(`https://www.reddit.com/r/${this.state.text}.json?limit=50&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({posts});
    });
  }

  nextPage(subreddit, postname){
    axios.get(`https://www.reddit.com/r/${subreddit}.json?limit=50&after=${postname}&/`).then(res => {
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
        <div className="col-lg-8">
        <Screen
          output={this.state.text}
          list={this.state.posts} 
          nextPage={this.nextPage}/>
          </div>
          <div className="col-lg-4">
        <Remote          
          onSearchTermChange={throttle}/>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
