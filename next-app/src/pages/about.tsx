// React Imports
import React, { Component, createRef } from 'react';

// component imports
import { Formik, Form, Field } from 'formik';
import Modal, { closeModal } from '@/Components/Modal';

// type imports
import type { ButtonComponent } from '@/Components/Modal';

// new interfaces
interface EditAboutCardProps {
  index: number;
  textObject: Record<string, any>;
  loggedIn: boolean;
}

interface EditAboutCardState {
  modalRef: React.RefObject<Modal> | null;
}

// new Types
type editAboutCardProps = {
  index: number;
  textObject: Record<string, any>;
  loggedIn: boolean;
};

//classes
class EditAboutCardButton extends Component<
  EditAboutCardProps,
  EditAboutCardState
> {
  defaultModalButtons: ButtonComponent[];
  state: EditAboutCardState = {
    modalRef: null,
  };
  modalCreateRef: React.RefObject<Modal> | null;
  constructor(props: editAboutCardProps) {
    super(props);
    this.defaultModalButtons = [
      {
        id: `about-card-${props.index}-edit-submit`,
        text: 'Submit',
        type: 'button',
      },
      {
        id: `about-card-${props.index}-edit-cancel`,
        text: 'Cancel',
        type: 'button',
        onClick: closeModal,
      },
    ];
    this.setState({
      modalRef: null,
    });
    this.modalCreateRef = createRef();
  }

  showCardModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(this.state.modalRef);
    if (!this.state.modalRef) return;
    const firstLayer = this.state.modalRef.current;
    if (!firstLayer || !firstLayer.modalRef.current) return;
    const { current } = firstLayer.modalRef;
    current.classList.add('open');
  };

  componentDidMount() {
    this.setState({ modalRef: this.modalCreateRef });
  }
  render() {
    if (!this.props.loggedIn) return;
    return (
      <>
        <button
          onClick={this.showCardModal}
          id={`about-card-${this.props.index}-edit`}
        >
          Edit
        </button>
        <Modal
          id={`about-card-${this.props.index}-edit-modal`}
          title={`Edit About Card ${this.props.index}`}
          buttons={this.defaultModalButtons}
          ref={this.modalCreateRef}
        >
          <Formik
            key={this.props.index}
            initialValues={{
              title: this.props.textObject.about_section,
              text: this.props.textObject.about_text,
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form>
              <label>Title</label>
              <Field
                id={`about-card-${this.props.index}-edit-title`}
                name="title"
              />

              <label>Text</label>
              <Field
                id={`about-card-${this.props.index}-edit-text`}
                name="text"
                as="textarea"
              />
            </Form>
          </Formik>
        </Modal>
      </>
    );
  }
}

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
                <EditAboutCardButton
                  index={index}
                  textObject={key}
                  loggedIn={this.loggedIn}
                />
                {/* {this.editAboutCardButton(index, key)} */}
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
