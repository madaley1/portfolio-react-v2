import React, { Component, createRef } from 'react';

interface Props = {
  title: string;
  buttons?: Record<string, string>[];
};
export default class Modal extends Component {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { title } = this.props;
    return (
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h4>{this.props.title}</h4>
          </div>
        </div>
      </div>
    );
  }
}
