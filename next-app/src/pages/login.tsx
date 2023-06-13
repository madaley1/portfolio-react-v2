// React Imports
import React, { Component, createRef } from 'react';

//Crypto Hashing Import
import * as crypto from 'crypto';

//component imports
import { Formik, Form, Field } from 'formik';

export default class Login extends Component {
  submitRef: React.RefObject<HTMLButtonElement>;
  userRef: React.RefObject<HTMLInputElement>;
  passwordRef: React.RefObject<HTMLInputElement>;
  state = {};
  hash: string;
  email: string;
  password: string;

  constructor(props: any) {
    super(props);
    this.submitRef = createRef();
    this.userRef = createRef();
    this.passwordRef = createRef();
    this.email = '';
    this.password = '';
    if (!process.env.NEXT_PUBLIC_PASS_HASH) {
      throw new Error('No hash found in environment variables');
    }
    this.hash = process.env.NEXT_PUBLIC_PASS_HASH;
  }

  submitLoginRequest(email: string, password: string) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/api/login?email=${email}&password=${password}`, true);
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

  async submitLogin(values: Record<string, string>) {
    const { email, password } = values;
    try {
      const loginRequest = await this.submitLoginRequest(email, password);
      if (!loginRequest) throw new Error('Login Failed');
      const loginRequestValidated = JSON.parse(loginRequest as string);
      console.log(loginRequestValidated.login);
      if (loginRequestValidated.login === true) {
        if (!process.env.NEXT_PUBLIC_ADMIN_KEY) {
          alert('An Error has occured, please try again later.');
          throw new Error('An Error has occured, please try again later.');
        }

        sessionStorage.setItem('admin', process.env.NEXT_PUBLIC_ADMIN_KEY);
        alert('Login Successful');
      }
      Promise.resolve();
    } catch (err) {
      console.error(err);
    }
  }

  componentDidMount(): void {
    if (
      !this.submitRef.current ||
      !this.passwordRef.current ||
      !this.userRef.current
    )
      return;
  }

  render() {
    return (
      <div id="login">
        <h1>The Login</h1>
        <Formik
          key={1}
          initialValues={{ email: '', password: '' }}
          onSubmit={(values) => this.submitLogin(values)}
        >
          <Form>
            <label>Email</label>
            <Field
              id="email"
              type="email"
              name="email"
              placeholder="email"
              required
            />

            <label>Password</label>
            <Field
              id="password"
              type="password"
              name="password"
              placeholder="password"
              required
            />

            <button type="submit">Login</button>
          </Form>
        </Formik>
      </div>
    );
  }
}
