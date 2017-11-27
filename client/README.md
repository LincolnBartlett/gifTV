# gifTV
### a Single Page GIF experience for reddit
[Try it out!](https://gifTV.herokuapp.com/)
---

#Client
The client was developed using Create-React-App. 

### How it works

## index.js

index.js is the top level component for the application. It’s where the initial GET request is made to reddit for a subreddit’s JSON. I limited the request to 50 posts because I felt that it was better for load times. When the application first loads we make the request with axios and map the posts to an array within the component's state. 

```javascript
  componentDidMount() {
    axios.get(`https://www.reddit.com/r/${this.state.text}.json?limit=50&/`).then(res => {
      const posts = res.data.data.children.map(obj => obj.data);
      this.setState({posts});
    });
  }
```

The array of posts is then sent as a property to the Screen component where the rendering of posts is handled.

## src/Screen.js

