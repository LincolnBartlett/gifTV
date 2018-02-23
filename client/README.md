# gifTV  [Try it out!](https://gifTV.herokuapp.com/)
### a Single Page GIF experience for reddit
---

# Client
The client was developed using [Create-React-App](https://github.com/facebookincubator/create-react-app). 

### How it works

## index.js

index.js contains the top level component for the application called App. It’s where GET requests are made to reddit for a subreddit’s JSON information with [axios](https://github.com/axios/axios). We do so with the function changeTerm()

```javascript
  changeTerm(subreddit, postname = ""){
    axios.get(`https://www.reddit.com/r/${subreddit}.json?limit=50&after=${postname}&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({ posts });
    });
  }
```
changeTerm() takes two arguments. The first is the name of the subreddit and the second is the name of an indivdual reddit post. The second argument allows us to gather post data from reddit after a specific post. This will come in handy once a user has cycled through the array of posts. If there is no second argument when the function is called the argument defaults to an empty string.



## src/Screen.js


The Screen component is responsible for rendering the actual post from reddit. The posts are passed to Screen from App as properties and stored in the Screen's state to be displayed one at at time. Before any rendering is done, the properties sent to the Screen component are filtered through a switch statement that will modify a post's url to conform to one of the three render methods: Video, Image or iFrame (if needed). This is done because of the wide variety of sources that reddit posts can come from. 

To do this we call componentWillReceiveProps() so that it will be called in the component's life cycle before rendering to the screen. We make any necessary changes and put the amended array in Screen's state.

```javascript
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
```
Once this is done the component renders our JSX to the screen. To do so it finds the appropriate post by selecting it within the posts array according to the value of state.count. It then determines the source of the post by checking the post's domain property and returns the proper render method.

```javascript
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
```

The three render methods (Video, Image, iFrame) are built within functions bound to the component.

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
  ```
These functions are passed to the Selectors component as properties. The Selectors component is a functional based component that contains buttons to call each function and is pulled in as a module.

```javascript
const Selectors = props => {
  return (
      <div className="col-xs-4 text-right">
        <button onClick={event => props.lastPost()} className="btn btn-default">
          <span
            className="glyphicon glyphicon glyphicon-step-backward"
            aria-hidden="true"
          />
        </button>
        <button onClick={event => props.nextPost()} className="btn btn-success">
        Next
          <span
            className="glyphicon glyphicon glyphicon-step-forward"
            aria-hidden="true"
          />
        </button>
      </div>
  );
};
```


## src/Remote.js

The Remote component handles choosing a subreddit to browse. There are two ways to choose a subreddit. Either select one from the list or type one into the the input field. The subreddits on the list are stored in the component's state as an object,

```javascript
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
```
Remote renders each group of subreddits by returning the Buttons component with the proper list of subreddits attached to properties.

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
  ```

  The Buttons component is a functional based component pulled in as a module that maps each value passed to it's properties to a button and renders each button in a list.
  
  ```javascript
  const Buttons = props => {
  const subButtons = props.sub.map(sub => {
    return (
        <button
            className="btn btn-xs btn-block btn-default"
            key={sub}
            onClick={event => props.buttonClick(sub)}
        >
            /r/{sub}
        </button> 
    );
  });
  return <div>{subButtons}</div>;
};
```
  
In the final render method each group of subreddits is assigned to a button which toggles it's respective isHidden property value located on the component's state. If a group of button's value is set to false, the group will be rendered to the screen.

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

If a user types in a custom subreddit in the input field the text is sent to the function onInputChange() as an argument where is then passed through as an argument to the property changeTerm() which is given to Remote from the App component.

```javascript
  onInputChange(term) {
    this.setState({ term });
    this.props.changeTerm(term);
  }
```

Similarly if a user clicks one of the subreddit buttons listed the function buttonClick() is called which passes the button's text onto onInputChange() as an argument.

```javascript
  buttonClick(term) {
    this.onInputChange(term);
  }
```





