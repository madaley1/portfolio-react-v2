// React Imports
import React, { Component, createRef } from 'react';

export default class About extends Component {
  loggedIn: boolean;

  state = {
    content: [{}],
  };
  constructor(props: any) {
    super(props);
    this.loggedIn = false;
    if (!process.env.NEXT_PUBLIC_ADMIN_KEY) return;
    this.getAboutContent().then((data) => {
      if (!data) return;
      this.setState({ content: JSON.parse(data).rows });
    });
  }

  getAboutContent(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/about', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText,
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      };
      xhr.send();
    });
  }

  componentDidMount() {
    if (
      sessionStorage.getItem('admin') &&
      sessionStorage.getItem('admin') === process.env.NEXT_PUBLIC_ADMIN_KEY
    ) {
      this.loggedIn = true;
    }
  }

  render() {
    return (
      <div>
        {this.state.content.map((key: Record<string, any>, index: number) => {
          return (
            <div className="about-section-card" key={index}>
              <h2>{key.about_section}</h2>
              <p>{key.about_text}</p>
            </div>
          );
        })}
      </div>
    );
  }
}
