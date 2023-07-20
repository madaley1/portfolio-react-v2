import React, { Component } from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';

export default class Contact extends Component {
  submitEmail(values: Record<string, any>) {
    console.log(values);
    axios
      .post('/api/contact', values)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.error(err.response);
      });
  }
  render() {
    return (
      <div>
        <h2> Contact Me </h2>
        <p>
          This page is still under construction, as I don&apos;t want to have an
          insecure form on the page. Feel free to reach out to me at
          <a href="mailto:mor2daley@gmail.com"> mor2daley@gmail.com</a>.
        </p>
      </div>
    );
    // return (
    //   <div>
    //     <h1>The Contact</h1>
    //     <Formik
    //       initialValues={{
    //         fname: '',
    //         lname: '',
    //         email: '',
    //         message: '',
    //       }}
    //       onSubmit={this.submitEmail.bind(this)}
    //     >
    //       <Form>
    //         <label>First Name</label>
    //         <Field type="text" name="fname" />
    //         <label>Last Name</label>
    //         <Field type="text" name="lname" />
    //         <label>Email</label>
    //         <Field type="text" name="email" />
    //         <label>Message</label>
    //         <Field as="textarea" name="message" />
    //         <button type="submit">Submit</button>
    //         <button type="submit">Clear</button>
    //       </Form>
    //     </Formik>
    //   </div>
    // );
  }
}
