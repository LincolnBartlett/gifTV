import React, { Component } from "react";
import ReactMarkdown from "react-markdown";
import Selectors from "./Selectors";
import axios from "axios";

class Screen extends Component {
  constructor(props) {
    super(props);
    this.nextPost = this.nextPost.bind(this);
    this.lastPost = this.lastPost.bind(this);
    this.Video = this.Video.bind(this);
    this.Image = this.Image.bind(this);
    this.Iframe = this.Iframe.bind(this);
    this.TopPanel = this.TopPanel.bind(this);
    this.BottomPanel = this.BottomPanel.bind(this);

    this.state = {
      posts: [{ selftext: "" }],
      count: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      //if the URL needs to be changed it's done here
        nextProps.list.forEach(post => {
          if (post.domain.includes("self") === true) {
            post.domain = "self";
          }
          switch (post.domain) {
            case "i.imgur.com":
              if (post.url.includes("gifv")) {
                post.url = post.url.slice(0, post.url.length - 4) + "mp4";
                break;
              }
              if (post.url.includes("gif")) {
                post.url = post.url.slice(0, post.url.length - 3) + "mp4";
                break;
              }
              break;

            case "gfycat.com":
              if (post.url.includes("https://gfycat.com/gifs") === true) {
                post.url = post.url.replace(
                  "https://gfycat.com/gifs/detail/",
                  "https://www.gfycat.com/ifr/"
                );
                break;
              }
              if (post.url.includes("https://gfycat.com/") === true) {
                post.url = post.url.replace(
                  "https://gfycat.com/",
                  "https://www.gfycat.com/ifr/"
                );
              }
              break;

            case "youtube.com":
            case "m.youtube.com":
            case "youtu.be":
              post.url = `https://www.youtube.com/embed/${post.url.slice(
                post.url.length - 11
              )}`;
              break;

            case "v.redd.it":
              if (post.media) {
                post.url = post.media.reddit_video.fallback_url;
              } else {
                post.url = post.url + "/DASH_4_8_M";
              }
              break;

            case "gph.is":
              post.url = post.media.oembed.thumbnail_url.replace(
                "-downsized-large",
                ""
              );
              break;

            default:
              break;
          }
        });
     
      this.setState({
        posts: nextProps.list,
        count: 0
      });
    }
  }

  //buttons to switch between gifs by changing this.state.count
  lastPost() {
    let sub = this.state.count;
    if (sub > 0) {
      sub--;
      this.setState({ count: sub, isHidden: { comments: true } });
      return;
    }
    if (sub === 0) {
      sub = this.state.posts.length - 1;
      this.setState({ count: sub, isHidden: { comments: true } });
    }
  }

  nextPost() {
    let add = this.state.count;
    if (add < this.state.posts.length) {
      add++;
      this.setState({ count: add });
    }
    if (add === this.state.posts.length) {
      add = 0;
      const postName = this.state.posts[this.state.posts.length - 1].name;
      const subreddit = this.state.posts[this.state.posts.length - 1].subreddit;
      this.props.changeTerm(subreddit, postName);
      this.setState({ count: add });
    }
  }

  //Component rendering functions
  TopPanel(){
    return (
      <div className="panel-heading">
        <div className="row">
          <div className="col-xs-8 text-left">
            <a
              target="_blank"
              href={
                "https://www.reddit.com/" +
                this.state.posts[this.state.count].permalink
              }
            >
              <h3>{this.state.posts[this.state.count].title}</h3>
            </a>
          </div>
          <Selectors
            lastPost={this.lastPost}
            nextPost={this.nextPost}
          />
        </div>
      </div>
    );
  }

  BottomPanel(){
    return(
      <div className="panel-footer">
      <p className="text-right">
      Submitted by: <a target="_blank" href={"https://www.reddit.com/u/" + this.state.posts[this.state.count].author}>u/{this.state.posts[this.state.count].author}</a>
        <br />
      to: <a target="_blank" href={"https://www.reddit.com/r/" + this.state.posts[this.state.count].subreddit}>r/{this.state.posts[this.state.count].subreddit}</a>
      </p>
    </div>
    );
  }

  Video() {
    return (
      <div className="panel panel-default">
        <this.TopPanel />
        <div className="embed-responsive embed-responsive-4by3">
          <video
            className="embed-responsive-item"
            src={this.state.posts[this.state.count].url}
            autoPlay
            loop
            title="gifTV"
          />
        </div>
        <this.BottomPanel />
    </div>

    );
  }

  Image() {
    return (
      <div className="panel panel-default">
        <this.TopPanel />
        <img
          className="fit-image"
          src={this.state.posts[this.state.count].url}
          alt="gifTV"
        />
        <this.BottomPanel />
      </div>
    );
  }

  Iframe() {
    return (
      <div className="panel panel-default">
        <this.TopPanel />
        <div className="embed-responsive embed-responsive-4by3">
          <iframe
            className="embed-responsive-item"
            src={this.state.posts[this.state.count].url}
            scrolling="no"
            title="gifTV"
          />
        </div>
        <this.BottomPanel />
      </div>
    );
  }


  render() {
    //switch between content provider and return proper JSX
    switch (this.state.posts[this.state.count].domain) {

      //Video Embed
      case "i.imgur.com":
      case "giant.gfycat.com":
      case "v.redd.it":
        return (
          <this.Video />
        );

      //Image Embed
      case "i.redd.it":
      case "i.giphy.com":
      case "gph.is":
      case "media.giphy.com":
        return (
          <this.Image />
        );

      //iFrame Embed
      case "youtube.com":
      case "m.youtube.com":
      case "youtu.be":
      case "gfycat.com":
      case "giphy.com":
        return (
          <this.Iframe />
        );

      case "self":
        return (
          <div className="panel panel-default">
              <this.TopPanel />        
              <div className="panel-body">
                <ReactMarkdown
                  source={this.state.posts[this.state.count].selftext}
                />
              </div>
              <this.BottomPanel />
          </div>
        );

      default:
        return ( 
          <div className="panel panel-default">
            <this.TopPanel />
              <div className="panel-body">
                Sorry source not supported
                <div className="embed-responsive embed-responsive-4by3">
                  <img
                    className="fit-image"
                    src={this.state.posts[this.state.count].thumbnail}
                    alt="gifTV"
                  />
                </div>
              </div>
            <this.BottomPanel />
          </div>
        );
    }
  }
}

export default Screen;
