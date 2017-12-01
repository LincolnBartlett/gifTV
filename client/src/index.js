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
    this.changeTerm = this.changeTerm.bind(this);
    this.state = {
      posts: []
    };
  }

  componentDidMount() {
    this.changeTerm('densegifs');
  }

  changeTerm(subreddit, postname = ""){
    axios.get(`https://www.reddit.com/r/${subreddit}.json?limit=50&after=${postname}&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({ posts });
    });
  }

  render() {
    const throttle = _.debounce(text => {
      this.changeTerm(text);
    }, 500);
    return (
      <div className="container">
        <div className="row">
          <br />
          <div className="col-lg-8">
            <Screen
              list={this.state.posts} 
             changeTerm={this.changeTerm}/>
          </div>
          <div className="col-lg-4">
            <Remote          
              changeTerm={throttle}/>
          </div>
        </div>  
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();