import React, { Component, createRef } from 'react';

import Router from 'next/router';

import type { projectData } from '@/Types/projects/projectData';

import { AddModalFormProps } from '@/types/about/modalForm';
import Modal, { closeModal } from '@/Components/Modal';
import { Formik, Form, Field } from 'formik';
import Loading from '@/Components/Loading';
import { ModalFormState } from '@/types/about/modalForm';

type GlobalProjectEditProps = AddModalFormProps & {
  projectData: projectData[];
};
interface GlobalProjectEditState extends ModalFormState {
  projectData: projectData[];
  initialValues: Record<string, any>;
}
import type { FormikProps } from 'formik';
import type { ButtonComponent } from '@/types/about/modalForm';

import styles from '@/Styles/sass/components/Modal.module.scss';

export default class GlobalProjectEditCard extends Component<
  GlobalProjectEditProps,
  GlobalProjectEditState
> {
  modalButtons: ButtonComponent[];
  state: GlobalProjectEditState = {
    modalRef: null,
    formRef: null,
    projectData: this.props.projectData,
    initialValues: {},
  };
  modalCreateRef: React.RefObject<Modal> | null = createRef();
  formCreateRef: React.RefObject<FormikProps<any>> | null = createRef();
  constructor(props: GlobalProjectEditProps) {
    super(props);

    this.modalButtons = [
      {
        id: 'project-card-gobal-edit-submit',
        text: 'Submit Reorder',
        type: 'button',
        onClick: this.submitModalHandler.bind(this),
      },
      {
        id: 'project-card-gobal-edit-cancel',
        text: 'Cancel',
        type: 'button',
        onClick: closeModal,
      },
    ];
    this.state.projectData = this.props.projectData;
  }

  submitModal() {
    if (!this.state.formRef) return;
    const { current } = this.state.formRef;
    if (!current || !current.values) return;
    const { values } = current;
    if (values.active !== this.state.initialValues.active) {
      values.active.updated = true;
    }
    if (values.inactive !== this.state.initialValues.inactive) {
      values.inactive.updated = true;
    }
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const url = '/api/projects';
      xhr.open('PUT', url);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({});
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
      console.log(encodeURIComponent(JSON.stringify(values)));
      xhr.send(encodeURIComponent(JSON.stringify(values)));
    });
  }

  submitModalHandler(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (!this || !this.submitModal) return console.error('Error');
    (this.submitModal as () => Promise<any>)()
      .then((data) => {
        if (!data) return;
        Router.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  formCompiler() {
    const activeJSX = this.props.projectData
      ? this.state.projectData.map((project, index) => {
          const { title, id, status } = project;
          if (status !== 'active') return;
          return (
            <fieldset key={index}>
              <label>{title}</label>
              <Field type="number" key={id} name={`active.${project.id}`} />
            </fieldset>
          );
        })
      : [<Loading key="0" />];

    const inactiveJSX = this.props.projectData
      ? this.state.projectData.map((project, index) => {
          const { title, id, status } = project;
          if (status !== 'inactive') return;
          return (
            <fieldset key={index}>
              <label>{title}</label>
              <Field type="number" key={id} name={`inactive.${project.id}`} />
            </fieldset>
          );
        })
      : [<Loading key="0" />];

    const formJSX = {
      activeJSX,
      inactiveJSX,
    };
    return formJSX;
  }

  openModal(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!this.state.modalRef) return;

    const { modalRef } = this.state;
    const firstLayer = modalRef.current;
    if (!firstLayer || !firstLayer.modalRef.current) return;
    const { current } = firstLayer.modalRef;
    current.classList.add(`${styles.open}`);
  }

  componentDidMount() {
    const initialValues = {
      active: {} as Record<string, any>,
      inactive: {} as Record<string, any>,
    };

    this.setState({
      modalRef: this.modalCreateRef,
      formRef: this.formCreateRef,
    });
    const { projectData } = this.state;
    if (projectData.length > 0) {
      this.state.projectData.forEach((project, index) => {
        if (project.status === 'active') {
          initialValues.active[
            `${project.id}` as keyof typeof initialValues.active
          ] = Object.entries(initialValues.active).length;
        } else if (project.status === 'inactive') {
          initialValues.inactive[
            `${project.id}` as keyof typeof initialValues.active
          ] = Object.entries(initialValues.inactive).length;
        }
      });
      initialValues.active.updated = false;
      initialValues.inactive.updated = false;
      this.setState({ initialValues });
    }
  }

  render(): React.ReactNode {
    if (!this.props.loggedIn) return;
    const formJSX = this.formCompiler();
    const { activeJSX, inactiveJSX } = formJSX;
    return (
      <>
        <button onClick={this.openModal.bind(this)}>Reorder Cards</button>
        <Modal
          id="project-card-global-edit-modal"
          title="Rorder Cards"
          buttons={this.modalButtons}
          ref={this.modalCreateRef}
        >
          <Formik
            innerRef={this.formCreateRef}
            enableReinitialize={true}
            initialValues={this.state.initialValues}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            <Form>
              <fieldset>
                <legend>Active Projects</legend>
                {activeJSX}
              </fieldset>
              <fieldset>
                <legend>Inactive Projects</legend>
                {inactiveJSX}
              </fieldset>
            </Form>
          </Formik>
        </Modal>
      </>
    );
  }
}
