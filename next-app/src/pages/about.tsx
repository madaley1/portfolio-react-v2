// Node imports
import axios from 'axios';

// React Imports
import React, { Component, createRef } from 'react';

// component imports
import EditAboutCard from '@/components/about/EditAboutCard';
import AddAboutSection from '@/components/about/AddAboutSection';
import Loading from '@/components/Loading';

// custom function imports
import loggedInCheck from '@/lib/loggedInCheck';

type content = {
  id: number;
  about_section: string;
  about_text: string;
};

interface AboutState {
  content: content[];
}

//classes
export default class About extends Component<AboutState> {
  loggedIn: boolean;

  state = {
    content: [{}] as content[],
  };
  constructor(props: any) {
    super(props);
    this.getAboutContent()
      .then((data) => {
        if (!data) return;
        this.setState({ content: data.rows });
      })
      .catch((err) => {
        console.error(err);
      });
    this.loggedIn = false;
  }

  getAboutContent(): Promise<any | undefined> {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/about')
        .then((response) => {
          console.log(response.data);
          resolve(response.data);
        })
        .catch((err) => {
          reject(err.response);
        });
    });
  }

  componentDidMount() {
    if (loggedInCheck()) {
      this.loggedIn = true;
    }
  }

  globalAboutEditButton() {
    // this hasn't been fully implemented yet, it will allow for re-ordering of the about sections
    if (!this.loggedIn) return;
    return <button id="global-about-edit">Edit About</button>;
  }

  showCardModal(e: React.MouseEvent<HTMLButtonElement>, modalId?: string) {
    e.preventDefault();
    const { target } = e;
    if (!target || !(target instanceof HTMLButtonElement)) return;
    const parent = target.parentElement;
    if (!parent) return;
    const id = `${target.id}-modal`;
    const modal = parent.querySelector(`#${id}`);
    if (!modal) return;
    modal.classList.add('open');
  }

  render() {
    const content = this.state.content[0].id
      ? this.state.content.map((key: Record<string, any>, index: number) => {
          return (
            <div className="about-section-card" key={index}>
              <h2>{key.about_section}</h2>
              <p>{decodeURI(key.about_text)}</p>
              <EditAboutCard
                index={key.id}
                textObject={key}
                loggedIn={this.loggedIn}
              />
            </div>
          );
        })
      : [<Loading key="0" />];
    return (
      <>
        <div>
          {/* {this.globalAboutEditButton()} */}
          {content}
          <AddAboutSection loggedIn={this.loggedIn} />
        </div>
      </>
    );
  }
}
