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
    this.getComments = this.getComments.bind(this);
    this.ShowComments = this.ShowComments.bind(this);
    this.state = {
      posts: [{ selftext: "" }],
      count: 0,
      comments: [],
      isHidden: {
        comments: true
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isHidden: { comments: true } });
    // console.log(nextProps.output, nextProps.list);
    if (nextProps !== this.props) {
      //if the URL needs to be changed it's done here
      if (nextProps) {
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
      }
      this.setState({
        posts: nextProps.list,
        count: 0
      });
    }
  }

  //buttons to switch between gifs by changing this.state.count
  nextPost() {
    let add = this.state.count;
    if (add < this.state.posts.length) {
      add++;
      this.setState({ count: add, isHidden: { comments: true } });
    }
    if (add === this.state.posts.length) {
      add = 0;
      const postName = this.state.posts[this.state.posts.length - 1].name;
      const subreddit = this.props.output;
      this.props.nextPage(subreddit, postName);
      this.setState({ count: add, isHidden: { comments: true } });
    }
  }

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

  Video() {
    return (
      <div className="embed-responsive embed-responsive-4by3">
        <video
          className="embed-responsive-item"
          src={this.state.posts[this.state.count].url}
          autoPlay
          loop
          title="gifTV"
        />
      </div>
    );
  }

  Image() {
    return (
      <img
        className="fit-image"
        src={this.state.posts[this.state.count].url}
        alt="gifTV"
      />
    );
  }

  Iframe() {
    return (
      <div className="embed-responsive embed-responsive-4by3">
        <iframe
          className="embed-responsive-item"
          src={this.state.posts[this.state.count].url}
          scrolling="no"
          title="gifTV"
        />
      </div>
    );
  }

  getComments() {
    axios
      .get(
        `https://www.reddit.com/r/${this.props.output}/comments/${
          this.state.posts[this.state.count].id
        }/.json`
      )
      .then(res => {
        const comments = res.data[1].data.children.map(obj => obj.data);
        this.setState({ comments });
      })
      .then(() => {
        this.setState({ isHidden: { comments: false } });
        this.ShowComments();
      });
  }

  ShowComments() {
    const posts = this.state.comments.map(post => {
      let child = <div />;
      let child2 = <div />;
      if (post.replies) {
        child = post.replies.data.children.map(childPost => {
          if (childPost.data.replies) {
            child2 = childPost.data.replies.data.children.map(child2Post => {
              return (
                <div className="panel panel-default">
                  <div key={child2Post.data.id} className="panel-body">
                    <p>
                      {child2Post.data.score} u/{child2Post.data.author}:
                    </p>
                    <hr />                 
                    <ReactMarkdown source={child2Post.data.body} />
                  </div>
                </div>
              );
            });
          }
          return (
            <div className="panel panel-default">
              <div key={childPost.data.id} className="panel-body">
                <p>
                  {childPost.data.score} u/{childPost.data.author}:
                </p>
                <hr />
                <ReactMarkdown source={childPost.data.body} />
                <br />
                <div>{child2}</div>
              </div>
            </div>
          );
        });
      }

      return (
        <div className="panel panel-default">
          <div key={post.id}  className="panel-body">
            <p>
              {post.score} u/{post.author}:
            </p>
            <hr />
            <ReactMarkdown source={post.body} />
            <br />
            <div>{child}</div>
          </div>
        </div>
      );
    });

    return <div>{posts}</div>;
  }

  render() {
    // if (this.state.posts[this.state.count].domain !== undefined) {
    //   console.log(this.state.count, this.state.posts[this.state.count].domain);
    // }

    //switch between content provider and return proper JSX
    switch (this.state.posts[this.state.count].domain) {
      //Video Embed
      case "i.imgur.com":
      case "giant.gfycat.com":
      case "v.redd.it":
        return (
          <div>
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>{this.state.posts[this.state.count].title}</h3>
                <p className="text-right">
                  Submitted by /u/{this.state.posts[this.state.count].author}
                  <br />
                  to r/{this.state.posts[this.state.count].subreddit}
                </p>
              </div>
              <this.Video />
              <div className="panel-footer">
                <Selectors lastPost={this.lastPost} nextPost={this.nextPost} />
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-body">
                {this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event => this.getComments()}
                  >
                    Show Comments
                  </button>
                )}
                {!this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event =>
                      this.setState({ isHidden: { comments: true } })
                    }
                  >
                    Hide Comments
                  </button>
                )}
              </div>
            </div>
            {!this.state.isHidden.comments && <this.ShowComments />}
          </div>
        );

      //Image Embed
      case "i.redd.it":
      case "i.giphy.com":
      case "gph.is":
      case "media.giphy.com":
        return (
          <div>
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>{this.state.posts[this.state.count].title}</h3>
                <p className="text-right">
                  Submitted by /u/{this.state.posts[this.state.count].author}
                  <br />
                  to r/{this.state.posts[this.state.count].subreddit}
                </p>
              </div>
              <this.Image />
              <div className="panel-footer">
                <Selectors lastPost={this.lastPost} nextPost={this.nextPost} />
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-body">
                {this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event => this.getComments()}
                  >
                    Show Comments
                  </button>
                )}
                {!this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event =>
                      this.setState({ isHidden: { comments: true } })
                    }
                  >
                    Hide Comments
                  </button>
                )}
              </div>
            </div>
            {!this.state.isHidden.comments && <this.ShowComments />}
          </div>
        );

      //iFrame Embed
      case "youtube.com":
      case "m.youtube.com":
      case "youtu.be":
      case "gfycat.com":
      case "giphy.com":
        return (
          <div>
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>{this.state.posts[this.state.count].title}</h3>
                <p className="text-right">
                  Submitted by /u/{this.state.posts[this.state.count].author}
                  <br />
                  to r/{this.state.posts[this.state.count].subreddit}
                </p>
              </div>
              <this.Iframe />
              <div className="panel-footer">
                <Selectors lastPost={this.lastPost} nextPost={this.nextPost} />
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-body">
                {this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event => this.getComments()}
                  >
                    Show Comments
                  </button>
                )}
                {!this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event =>
                      this.setState({ isHidden: { comments: true } })
                    }
                  >
                    Hide Comments
                  </button>
                )}
              </div>
            </div>
            {!this.state.isHidden.comments && <this.ShowComments />}
          </div>
        );

      case "self":
        return (
          <div>
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>{this.state.posts[this.state.count].title}</h3>
                <p className="text-right">
                  Submitted by /u/{this.state.posts[this.state.count].author}
                  <br />
                  to r/{this.state.posts[this.state.count].subreddit}
                </p>
              </div>
              <ReactMarkdown
                source={this.state.posts[this.state.count].selftext}
              />
              <div className="panel-footer">
                <Selectors lastPost={this.lastPost} nextPost={this.nextPost} />
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-body">
                {this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event => this.getComments()}
                  >
                    Show Comments
                  </button>
                )}
                {!this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event =>
                      this.setState({ isHidden: { comments: true } })
                    }
                  >
                    Hide Comments
                  </button>
                )}
              </div>
            </div>
            {!this.state.isHidden.comments && <this.ShowComments />}
          </div>
        );

      default:
        return (
          <div>
            <div className="panel panel-default">
              <div className="panel-body">
                <h3>{this.state.posts[this.state.count].title}</h3>
                <p className="text-right">
                  Submitted by /u/{this.state.posts[this.state.count].author}
                  <br />
                  to r/{this.state.posts[this.state.count].subreddit}
                </p>
              </div>
              Sorry source not supported
              <div className="embed-responsive embed-responsive-4by3">
                <img
                  className="fit-image"
                  src={this.state.posts[this.state.count].thumbnail}
                  alt="gifTV"
                />
              </div>
              <div className="panel-footer">
                <Selectors lastPost={this.lastPost} nextPost={this.nextPost} />
              </div>
            </div>
            <div className="panel panel-default">
              <div className="panel-body">
                {this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event => this.getComments()}
                  >
                    Show Comments
                  </button>
                )}
                {!this.state.isHidden.comments && (
                  <button
                    className="btn btn-lg btn-block btn-primary"
                    onClick={event =>
                      this.setState({ isHidden: { comments: true } })
                    }
                  >
                    Hide Comments
                  </button>
                )}
              </div>
            </div>
            {!this.state.isHidden.comments && <this.ShowComments />}
          </div>
        );
    }
  }
}

export default Screen;
