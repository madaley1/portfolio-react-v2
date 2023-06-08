// React Imports
import React, { Component, createRef } from 'react';

//Crypto Hashing Import
import * as crypto from 'crypto';

export default class Login extends Component {
  submitRef: React.RefObject<HTMLButtonElement>;
  state = {};

  constructor(props: any) {
    super(props);
    this.submitRef = createRef();
  }

  render() {
    return (
      <div id="login">
        <h1>The Login</h1>
        <form action="/api/login" method="get">
          <label>Username</label>
          <input type="text" />

          <label>Password</label>
          <input type="password" />

          <button type="submit" ref={this.submitRef}>
            Login
          </button>
        </form>
      </div>
    );
  }
}
