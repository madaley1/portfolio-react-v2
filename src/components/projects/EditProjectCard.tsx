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

// interfaces
interface ProjectModalFormState extends ModalFormState {
  fields: number;
  slideJSX: JSX.Element[];
  initialValues: Record<string, any>;
}

// classes
export default class EditProjectCard extends Component<
  EditModalFormProps,
  ProjectModalFormState
> {
  defaultModalButtons: ButtonComponent[];
  state: ProjectModalFormState = {
    modalRef: null,
    formRef: null,
    fields: 0,
    slideJSX: [],
    initialValues: {},
  };
  modalCreateRef: React.RefObject<Modal> | null = createRef();
  formCreateRef: React.RefObject<FormikProps<any>> | null = createRef();
  constructor(props: editModalFormProps) {
    super(props);
    this.defaultModalButtons = [
      {
        id: `project-card-${props.index}-edit-submit`,
        text: 'Submit Edit',
        type: 'button',
        onClick: this.submitModalHandler.bind(this),
      },
      {
        id: `project-card-${props.index}-edit-cancel`,
        text: 'Cancel',
        type: 'button',
        onClick: closeModal,
      },
      {
        id: `project-card-${props.index}-edit-delete`,
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
    const { title, text, status, slides } = current.values;
    const data = JSON.stringify({
      id: this.props.index,
      title,
      text,
      status,
      slides: slides,
    });
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = '/api/projects';
      xhr.open('PATCH', url);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            project_section: title,
            project_text: text,
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
      const url = `/api/projects?id=${index}`;
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

  addSlideToProject() {
    if (Number.isNaN(this.state.fields)) {
      this.setState({ fields: 0 });
    }
    const { fields } = this.state;
    const slide = (
      <fieldset key={fields} id="project-card-add-slides">
        <label>Slide {fields}</label>
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
    return slide;
  }

  componentDidMount() {
    this.setState({
      modalRef: this.modalCreateRef,
      formRef: this.formCreateRef,
    });
    const { project, slides } = this.props.textObject;
    const { status, description, name } = project;
    if (slides && Object.entries(slides).length) {
      this.setState({ fields: Object.entries(slides).length });
    } else {
      this.setState({ fields: 0 });
    }
    const values = {
      title: name,
      text: decodeURIComponent(description),
      status,
      slides,
    };
    const processedSlides = Object.entries(slides).map(
      (slide: Record<string, any>, index: number) => {
        return (
          <fieldset key={index} id="project-card-add-slides">
            <label>Slide {index + 1}</label>
            <Field
              id={`project-card-add-slide-path-${index}`}
              name={`slides[${index}].path`}
              as="input"
            />
            <Field
              id={`project-card-add-slide-description-${index}`}
              name={`slides[${index}].description`}
              as="textarea"
            />
          </fieldset>
        );
      }
    );
    this.setState({
      initialValues: values,
      slideJSX: processedSlides,
    });
  }
  render() {
    if (!this.props.loggedIn) return;
    return (
      <>
        <button
          onClick={this.showCardModal}
          id={`project-card-${this.props.index}-edit`}
        >
          Edit
        </button>
        <Modal
          id={`project-card-${this.props.index}-edit-modal`}
          title={`Edit Project Card ${this.props.index}`}
          buttons={this.defaultModalButtons}
          ref={this.modalCreateRef}
        >
          <Formik
            innerRef={this.formCreateRef}
            key={this.props.index}
            initialValues={this.state.initialValues}
            enableReinitialize={true}
            onSubmit={(values) => {
              return values;
            }}
          >
            <Form>
              <label>Title</label>
              <Field id={'project-card-edit-title'} name="title" />

              <label>Text</label>
              <Field id={'project-card-edit-text'} name="text" as="textarea" />

              <label>Status</label>
              <Field id={'project-card-edit-status'} name="status" as="select">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Field>
              <label>Slides</label>
              <fieldset id="project-card-edit-slides-container">
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
