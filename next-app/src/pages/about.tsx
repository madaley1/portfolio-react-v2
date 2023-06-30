// Node imports
import axios from 'axios';

// React Imports
import React, { Component, createRef } from 'react';

// component imports
import EditAboutCard from '@/components/about/EditAboutCard';
import AddAboutSection from '@/components/about/AddAboutSection';

//classes
export default class About extends Component {
  loggedIn: boolean;

  state = {
    content: [{}],
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
    if (!process.env.NEXT_PUBLIC_ADMIN_KEY) return;
    if (
      sessionStorage.getItem('admin') &&
      sessionStorage.getItem('admin') === process.env.NEXT_PUBLIC_ADMIN_KEY
    ) {
      this.loggedIn = true;
    }
  }

  globalAboutEditButton() {
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
    return (
      <>
        <div>
          {this.globalAboutEditButton()}
          {this.state.content.map((key: Record<string, any>, index: number) => {
            return (
              <div className="about-section-card" key={index}>
                <h2>{key.about_section}</h2>
                <p>{key.about_text}</p>
                <EditAboutCard
                  index={key.id}
                  textObject={key}
                  loggedIn={this.loggedIn}
                />
              </div>
            );
          })}
          <AddAboutSection loggedIn={this.loggedIn} />
        </div>
      </>
    );
  }
}
