import React, { Component } from 'react';
import Head from 'next/head';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import {
  IWithGoogleReCaptchaProps,
  withGoogleReCaptcha,
} from 'react-google-recaptcha-v3';

class Contact extends Component {
  async submitEmail(values: Record<string, any>) {
    const { executeRecaptcha } = (this.props as IWithGoogleReCaptchaProps)
      .googleReCaptchaProps;
    if (!executeRecaptcha) {
      console.log('Recaptcha has not been loaded');
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
    console.log(body);
    const result = await axios
      .post('/api/recaptcha', body)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.error(err.response);
      });
    console.log(result);
    if (result.success) {
      axios
        .post('/api/contact', values)
        .then()
        .catch((err) => {
          console.error(err.response);
        });
    }
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
        <h1>The Contact</h1>
        <Formik
          initialValues={{
            fname: '',
            lname: '',
            email: '',
            message: '',
          }}
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
            <button type="submit">Clear</button>
          </Form>
        </Formik>
      </>
    );
  }
}

export default withGoogleReCaptcha(Contact);
