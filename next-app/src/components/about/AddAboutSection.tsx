//React Imports
import React, { Component, createRef } from 'react';

// Next Imports
import Router from 'next/router';

// component imports
import { Formik, Form, Field } from 'formik';
import Modal, { closeModal } from '@/Components/Modal';
import type { FormikProps } from 'formik';

// interface imports
import { AddModalFormProps, ModalFormState } from '@/types/about/modalForm';

// type imports
import type { ButtonComponent } from '@/types/about/modalForm';
import type { addModalFormProps } from '@/types/about/modalForm';

export default class AddAboutSection extends Component<
  AddModalFormProps,
  ModalFormState
> {
  state: ModalFormState = {
    modalRef: null,
    formRef: null,
  };
  defaultModalButtons: ButtonComponent[];
  modalCreateRef: React.RefObject<Modal> | null = createRef();
  formCreateRef: React.RefObject<FormikProps<any>> | null = createRef();
  constructor(props: addModalFormProps) {
    super(props);
    this.defaultModalButtons = [
      {
        id: 'about-card-add-submit',
        text: 'Add Section',
        type: 'button',
        onClick: this.addNewSectionHandler.bind(this),
      },
      {
        id: 'about-card-add-cancel',
        text: 'Cancel',
        type: 'button',
        onClick: closeModal,
      },
    ];
  }

  addNewSection(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (!this.state.formRef) return;
    const { current } = this.state.formRef;
    if (!current) return;
    const { title, text } = current.values;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = `/api/about?title=${title}&text=${text}`;
      const data = JSON.stringify({
        title,
        text,
      });
      xhr.open('POST', url);
      xhr.onload = function () {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              about_section: title,
              about_text: text,
            });
          }
        } catch {
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

  addNewSectionHandler(e: React.MouseEvent<HTMLElement>) {
    if (!this || !this.addNewSection) return console.error('Error');

    (this.addNewSection as (e: React.MouseEvent<HTMLElement>) => Promise<any>)(
      e
    )
      .then((data) => {
        if (!data) return;
        Router.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  showAddModal = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        <button onClick={this.showAddModal} id={'about-card-add-edit'}>
          Add New Section
        </button>
        <Modal
          id={'about-card-add-edit-modal'}
          title={'Edit About Card add'}
          buttons={this.defaultModalButtons}
          ref={this.modalCreateRef}
        >
          <Formik
            innerRef={this.formCreateRef}
            initialValues={{
              title: '',
              text: '',
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form>
              <label>Title</label>
              <Field id={'about-card-add-title'} name="title" />

              <label>Text</label>
              <Field
                id={'about-card-add-edit-text'}
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
