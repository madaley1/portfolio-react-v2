// React Imports
import React, { Component, createRef } from 'react';

// component imports
import { Formik, Form, Field } from 'formik';
import Modal from '@/Components/Modal';

// type components
import type { ButtonComponent } from '@/Components/Modal';

export default class About extends Component {
  loggedIn: boolean;

  state = {
    content: [{}],
  };
  constructor(props: any) {
    super(props);
    this.getAboutContent().then((data) => {
      if (!data) return;
      this.setState({ content: JSON.parse(data).rows });
    });
    this.loggedIn = false;
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

  editAboutCardButton(index: number, textObject: Record<string, any>) {
    if (!this.loggedIn) return;
    const defaultModalButtons: ButtonComponent[] = [
      {
        id: `about-card-${index}-edit-submit`,
        text: 'Submit',
        type: 'button',
      },
      {
        id: `about-card-${index}-edit-cancel`,
        text: 'Cancel',
        type: 'button',
      },
    ];
    return (
      <>
        <button id={`about-card-${index}-edit`}>Edit</button>
        <Modal title={`Edit About Card ${index}`} buttons={defaultModalButtons}>
          <Formik
            key={index}
            initialValues={{
              title: textObject.about_section,
              text: textObject.about_text,
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form>
              <label>Title</label>
              <Field id={`about-card-${index}-edit-title`} name="title" />

              <label>Text</label>
              <Field id={`about-card-${index}-edit-text`} name="text" />
            </Form>
          </Formik>
        </Modal>
      </>
    );
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
                {this.editAboutCardButton(index, key)}
              </div>
            );
          })}
        </div>
        <div id="global-edit-modal"></div>
        <div id="specific-edit-modal"></div>
      </>
    );
  }
}
