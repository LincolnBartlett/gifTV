# gifTV  [Try it out!](https://gifTV.herokuapp.com/)
### a Single Page GIF experience for reddit
---

# Client
The client was developed using Create-React-App. 

### How it works

## index.js

Inside index.js is the top level component for the application called App. It’s where the initial GET request is made to reddit for a subreddit’s JSON information. When the application first loads we call componentDidMount() and make the request with axios. 

```javascript
  componentDidMount() {
    axios.get(`https://www.reddit.com/r/${this.state.text}.json?limit=50&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({posts});
    });
  }
```

The component's state was initilized with:
```javascript
    this.state = {
      text: "BetterEveryLoop",
      posts: []
    };
```
When the component mounts it defaults to /r/BetterEveryLoop and maps the posts into the state.posts array. The array of posts is then sent as a property to the Screen component where the rendering of posts is handled.

```javascript
        <Screen
          output={this.state.text}
          list={this.state.posts} 
          nextPage={this.nextPage}/>
```

If the user changes the subreddit (either by clicking a button on the Remote or changing the term in the input field) changeTerm() is called.
changeTerm() is functionally identical to componentDidMount, however it takes the new term as an argument and passes it into the axios request.
```javascript
  changeTerm(text) {
    axios.get(`https://www.reddit.com/r/${text}.json?limit=50&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({posts});
    });
  }
```

If a user has reached the end of the posts contained in the state.posts array the Screen component will call nextPage() pass it two arguments, subreddit (the title of the subreddit) and postname (the title of the last post in the array) which then will gather JSON information about the next 50 posts in the subreddit after the last post.
```javascript
  nextPage(subreddit, postname){
    axios.get(`https://www.reddit.com/r/${subreddit}.json?limit=50&after=${postname}&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({ posts });
    });
  }
```

## src/Screen.js


The Screen component is responsible for rendering the actual post from reddit. The posts are stored in the component's state and displayed one at at time. Before any rendering is done, the properties sent to the Screen component are filtered through a switch statement that will modify a post's url to conform to one of the three render methods; Video, Image or iFrame if needed. This is done because of the wide variety of sources that reddit posts can come from. 

To do this we call componentWillReceiveProps() because it will be called in the component's life cycle before rendering to the screen and make any necessary changes.

```javascript
 componentWillReceiveProps(nextProps) {
    this.setState({ isHidden: { comments: true } });
    if (nextProps !== this.props) {
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
```

In the final render method of the component a switch statement determines the source of the post by checking the post.domain property. From here it is rendered either as a Video, Image or iFrame.

```javascript
  render() {
    // if (this.state.posts[this.state.count].domain !== undefined) {
    //   console.log(this.state.count, this.state.posts[this.state.count]);
    // }

    //switch between content provider and return proper JSX
    switch (this.state.posts[this.state.count].domain) {

      //Video Embed
      case "i.imgur.com":
      case "giant.gfycat.com":
      case "v.redd.it":
        return (
          <div>
            <this.Video />
            <this.CommentButton />
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
            <this.Image />
            <this.CommentButton />
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
            <this.Iframe />
            <this.CommentButton />
            {!this.state.isHidden.comments && <this.ShowComments />}
          </div>
        );

      case "self":
        return (
          <div>
            <div className="panel panel-default">
                <this.TopPanel />        
                <div className="panel-body">
                  <ReactMarkdown
                    source={this.state.posts[this.state.count].selftext}
                  />
                </div>
                <this.BottomPanel />
              
            </div>
            <this.CommentButton />
            {!this.state.isHidden.comments && <this.ShowComments />}
          </div>
        );

      default:
        return (
          <div>
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
            <this.CommentButton />
            {!this.state.isHidden.comments && <this.ShowComments />}
          </div>
        );
    }
  }
}
```

The three different render methods are defined as functions within the component

```javascript
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
  ```

  Cycling through posts is done by changing the value of state.count which is done with the fucntions nextPost() and lastPost().
  ```javascript
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
  ```
These functions are passed to the Selectors component, which are simply buttons that call each function.


## src/Remote.js

The Remote component handles choosing a subreddit to browse. There are two ways to choose a subreddit. Either select one from the list or type one into the the input field. The subreddits on the list are stored in the component's state as an object,

```javascript
    this.state = {
      term: "BetterEveryLoop",
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
```
The component renders each group of subreddits by rendering the Buttons component within a function

```javascript
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
  ```

  The Buttons component maps each value to its own button and renders them as a list. In the final render method each group of subreddits is assigned to a button which toggles it's respective isHidden property value located on the component's state. The isHidden property will then show or not show the group of buttons depneding on it's boolean value.

  ```javascript
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
```





