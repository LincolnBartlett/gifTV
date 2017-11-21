import React, { Component } from "react";
import ReactMarkdown from "react-markdown";

//component for showing gifs
class Screen extends Component {
  constructor(props) {
    super(props);
    this.nextPost = this.nextPost.bind(this);
    this.lastPost = this.lastPost.bind(this);
    this.state = {
      posts: [{ selftext: "" }],
      count: 0
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
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
              post.url = `https://www.youtube.com/embed/${post.url.slice(
                post.url.length - 11
              )}`;
              break;

            case "m.youtube.com":
              post.url = `https://www.youtube.com/embed/${post.url.slice(
                post.url.length - 11
              )}`;
              break;

            case "youtu.be":
              post.url = `https://www.youtube.com/embed/${post.url.slice(
                post.url.length - 11
              )}`;
              break;

            case "v.redd.it":
              if (!post.media) {
                post.media = {
                  reddit_video: { fallback_url: post.url + "/DASH_4_8_M" }
                };
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

  //buttons to switch between gifs
  nextPost() {
    let add = this.state.count;
    if (add < this.state.posts.length) {
      add++;
      this.setState({ count: add });
    }
    if (add === this.state.posts.length) {
      add = 0;
      this.setState({ count: add });
    }
  }

  lastPost() {
    let sub = this.state.count;
    if (sub > 0) {
      sub--;
      this.setState({ count: sub });
      return;
    }
    if (sub === 0) {
      sub = this.state.posts.length - 1;
      this.setState({ count: sub });
    }
  }

  render() {
    if (this.state.posts.length > 1) {
      console.log([this.state.posts[this.state.count].domain, this.state.posts[this.state.count]]);
    }

    //switch between content provider and return proper JSX
    switch (this.state.posts[this.state.count].domain) {
      case "i.imgur.com":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <video
                      
                      autoPlay
                      loop
                      className="embed-responsive-item"
                      src={this.state.posts[this.state.count].url}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "i.redd.it":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <img
                    className="img-responsive"
                    src={this.state.posts[this.state.count].url}
                    alt="gifTV"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "i.giphy.com":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <img
                    className="img-responsive"
                    src={this.state.posts[this.state.count].url}
                    alt="gifTV"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "v.redd.it":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <video
                      type="video/webm"
                      autoPlay
                      loop
                      className="embed-responsive-item"
                      src={
                        this.state.posts[this.state.count].media.reddit_video
                          .fallback_url
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "m.youtube.com":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <iframe
                      className="embed-responsive-item"
                      src={this.state.posts[this.state.count].url}
                      scrolling="no"
                      title="gifTV"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "youtube.com":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <iframe
                      className="embed-responsive-item"
                      src={this.state.posts[this.state.count].url}
                      scrolling="no"
                      title="gifTV"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );
      case "youtu.be":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <iframe
                      className="embed-responsive-item"
                      src={this.state.posts[this.state.count].url}
                      scrolling="no"
                      title="gifTV"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "gfycat.com":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <iframe
                      className="embed-responsive-item"
                      src={this.state.posts[this.state.count].url}
                      scrolling="no"
                      title="gifTV"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "giant.gfycat.com":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <video
                      className="embed-responsive-item"
                      src={this.state.posts[this.state.count].url}
                      autoPlay
                      loop
                      title="gifTV"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "giphy.com":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <iframe
                      className="embed-responsive-item"
                      src={this.state.posts[this.state.count].url}
                      scrolling="no"
                      title="gifTV"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );
      case "gph.is":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <img
                      className="img-responsive"
                      src={this.state.posts[this.state.count].url}
                      alt="gifTV"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "media.giphy.com":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <div className="embed-responsive embed-responsive-4by3">
                    <img
                      className="img-responsive"
                      src={this.state.posts[this.state.count].url}
                      alt="gifTV"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case "self":
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>

                  <ReactMarkdown
                    source={this.state.posts[this.state.count].selftext}
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <div className="col-lg-8 ">
              <div className="panel panel-default">
                <div className="panel-body">
                  <h2>{this.state.posts[this.state.count].title}</h2>
                  <p className="text-right">
                    Submitted by /u/{this.state.posts[this.state.count].author}
                  </p>
                  <h2> Sorry, Source not currently supported. </h2>
                  <img
                    className="img-responsive"
                    src={this.state.posts[this.state.count].thumbnail}
                    alt="gifTV"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-4 panel panel-default">
              <div className="panel-body text-center">
                <h1>gifTV</h1>
                <p>r/{this.state.posts[this.state.count].subreddit}</p>
                <button onClick={this.lastPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-backward"
                    aria-hidden="true"
                  />
                </button>
                <button onClick={this.nextPost} className="btn btn-lg btn-info">
                  <span
                    className="glyphicon glyphicon glyphicon-step-forward"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        );
    }
  }
}

export default Screen;
