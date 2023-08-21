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

import styles from '@/Styles/sass/components/Modal.module.scss';

interface ProjectModalFormState extends ModalFormState {
  fields: number;
  slideJSX: JSX.Element[];
}

export default class AddprojectSection extends Component<
  AddModalFormProps,
  ProjectModalFormState
> {
  state: ProjectModalFormState = {
    modalRef: null,
    formRef: null,
    fields: 0,
    slideJSX: [],
  };
  defaultModalButtons: ButtonComponent[];
  modalCreateRef: React.RefObject<Modal> | null = createRef();
  formCreateRef: React.RefObject<FormikProps<any>> | null = createRef();
  constructor(props: addModalFormProps) {
    super(props);
    this.defaultModalButtons = [
      {
        id: 'project-card-add-submit',
        text: 'Add Section',
        type: 'button',
        onClick: this.addNewSectionHandler.bind(this),
      },
      {
        id: 'project-card-add-cancel',
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
    console.log(current.values);
    const { title, text, status, slides } = current.values;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = '/api/projects';
      const data = JSON.stringify({
        title,
        text,
        status,
        slides,
      });
      xhr.open('POST', url);
      xhr.onload = function () {
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve({
              project_section: title,
              project_text: text,
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
    current.classList.add(`${styles.open}`);
  };

  componentDidMount() {
    this.setState({
      modalRef: this.modalCreateRef,
      formRef: this.formCreateRef,
    });
  }

  addSlideToProject() {
    const { fields } = this.state;
    const slide = (
      <fieldset key={fields} id="project-card-add-slides">
        <label>Slide {fields + 1}</label>
        <Field
          id={`project-card-add-slide-path-${fields}`}
          name={`slides[${fields}].path`}
          as="input"
        />
        <Field
          id={`project-card-add-slide-description-${fields}`}
          name={`slides[${fields}].description`}
          as="textarea"
        />
      </fieldset>
    );
    this.setState({ fields: fields + 1 });
    this.setState({ slideJSX: [...this.state.slideJSX, slide] });
    console.log(this.state.slideJSX);
    return slide;
  }

  render() {
    if (!this.props.loggedIn) return;
    return (
      <>
        <button onClick={this.showAddModal} id={'project-card-add-edit'}>
          Add New Project
        </button>
        <Modal
          id={'project-card-add-edit-modal'}
          title={'Edit project Card add'}
          buttons={this.defaultModalButtons}
          ref={this.modalCreateRef}
        >
          <Formik
            innerRef={this.formCreateRef}
            initialValues={{
              title: '',
              text: '',
              status: 'active',
              slides: [],
            }}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form>
              <label>Title</label>
              <Field id={'project-card-add-title'} name="title" />

              <label>Text</label>
              <Field id={'project-card-add-text'} name="text" as="textarea" />

              <label>Status</label>
              <Field id={'project-card-add-status'} name="status" as="select">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Field>
              <label>Slides</label>
              <fieldset id="project-card-add-slides-container">
                {this.state.slideJSX}
              </fieldset>
              <button
                className="add-slide-to-form"
                onClick={this.addSlideToProject.bind(this)}
              >
                Add Slide
              </button>
            </Form>
          </Formik>
        </Modal>
      </>
    );
  }
}
