// React Imports
import React, { Component, createRef } from 'react';

// Next Imports
import Router from 'next/router';

// component imports
import { Formik, Form, Field } from 'formik';
import Modal, { closeModal } from '@/Components/Modal';

// type imports
import type { ButtonComponent } from '@/types/about/modalForm';
import type { FormikProps } from 'formik';
import type { editModalFormProps } from '@/types/about/modalForm';

// interface imports
import { EditModalFormProps, ModalFormState } from '@/types/about/modalForm';

//classes
export default class EditAboutCard extends Component<
  EditModalFormProps,
  ModalFormState
> {
  defaultModalButtons: ButtonComponent[];
  state: ModalFormState = {
    modalRef: null,
    formRef: null,
  };
  modalCreateRef: React.RefObject<Modal> | null = createRef();
  formCreateRef: React.RefObject<FormikProps<any>> | null = createRef();
  constructor(props: editModalFormProps) {
    super(props);
    this.defaultModalButtons = [
      {
        id: `about-card-${props.index}-edit-submit`,
        text: 'Submit Edit',
        type: 'button',
        onClick: this.submitModalHandler.bind(this),
      },
      {
        id: `about-card-${props.index}-edit-cancel`,
        text: 'Cancel',
        type: 'button',
        onClick: closeModal,
      },
      {
        id: `about-card-${props.index}-edit-delete`,
        text: 'Delete',
        type: 'button',
        onClick: this.deleteModalHandler.bind(this),
      },
    ];
  }

  submitModal(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (!this.state.formRef) return;
    const { current } = this.state.formRef;
    if (!current) return;
    const { title, text } = current.values;
    console.log(text);
    const data = JSON.stringify({
      id: this.props.index,
      title: title,
      text: text,
    });
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = '/api/about';
      xhr.open('PATCH', url);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            about_section: title,
            about_text: text,
          });
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      };
      xhr.send(encodeURIComponent(data));
    });
  }

  submitModalHandler(e: React.MouseEvent<HTMLElement>) {
    if (!this || !this.submitModal) return console.error('Error');

    (this.submitModal as (e: React.MouseEvent<HTMLElement>) => Promise<any>)(e)
      .then((data) => {
        if (!data) return;
        Router.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  deleteCard(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const { index } = this.props;
      const url = `/api/about?id=${index}`;
      xhr.open('DELETE', url);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            id: index,
          });
        } else {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      };
      xhr.send();
    });
  }

  deleteModalHandler(e: React.MouseEvent<HTMLElement>) {
    if (!this || !this.submitModal) return console.error('Error');

    (this.deleteCard as (e: React.MouseEvent<HTMLElement>) => Promise<any>)(e)
      .then((data) => {
        if (!data) return;
        Router.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  showCardModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!this.state.modalRef) return;
    const firstLayer = this.state.modalRef.current;
    if (!firstLayer || !firstLayer.modalRef.current) return;
    const { current } = firstLayer.modalRef;
    current.classList.add('open');
  };

  componentDidMount() {
    this.setState({
      modalRef: this.modalCreateRef,
      formRef: this.formCreateRef,
    });
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
            innerRef={this.formCreateRef}
            key={this.props.index}
            initialValues={{
              title: this.props.textObject.about_section,
              text: decodeURI(this.props.textObject.about_text),
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
