import React, { Component, createRef } from 'react';
import Head from 'next/head';
import { Formik, Form, Field, FormikProps, FormikValues } from 'formik';
import axios from 'axios';
import {
  IWithGoogleReCaptchaProps,
  withGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

class Contact extends Component {
  formRef = createRef<FormikProps<FormikValues>>();

  async submitEmail(values: Record<string, unknown>) {
    const { executeRecaptcha } = (this.props as IWithGoogleReCaptchaProps)
      .googleReCaptchaProps;
    if (!executeRecaptcha) {
      return;
    }

    const recaptchaResponse = await executeRecaptcha('homepage');
    if (!recaptchaResponse) {
      alert('Recaptcha not verified');
      return;
    }
    const body = {
      recaptchaResponse,
      values,
    };
    const result = await axios
      .post('/api/recaptcha', body)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        return err.response;
      });
    if (result.success) {
      axios
        .post('/api/contact', values)
        .then()
        .catch((err) => {
          return err.response;
        });
    }
  }

  clearForm() {
    if (!this.formRef.current) return;
    this.formRef.current.resetForm();
  }
  render() {
    return (
      <>
        <Head>
          <title>Contact | Daley Development</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <div id="contact">
          <h1>Contact Me</h1>
          <p>
            If you have any questions about my projects or would like to work
            with me, please feel free to reach out via the form below!
          </p>
          <Formik
            initialValues={{
              fname: '',
              lname: '',
              email: '',
              message: '',
            }}
            innerRef={this.formRef}
            onSubmit={this.submitEmail.bind(this)}
          >
            <Form>
              <label>First Name</label>
              <Field type="text" name="fname" />
              <label>Last Name</label>
              <Field type="text" name="lname" />
              <label>Email</label>
              <Field type="text" name="email" />
              <label>Message</label>
              <Field as="textarea" name="message" />
              <button type="submit">Submit</button>
              <button type="button" onClick={this.clearForm.bind(this)}>
                Clear
              </button>
            </Form>
          </Formik>
        </div>
      </>
    );
  }
}

export default withGoogleReCaptcha(Contact);
