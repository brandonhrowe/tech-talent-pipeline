import React, { Component } from "react";
import Header from "./components/Header";
import Routes from "./Routes";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {}
    };
  }

  render() {
    const { user } = this.state;
    return (
      <div>
        <Header user={user} />
        <Routes user={user} />
      </div>
    );
  }
}

export default App;
