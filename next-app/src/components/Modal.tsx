import React, { Component, createRef } from 'react';

export type ButtonComponent = {
  id: string;
  text: string;
  type: 'button' | 'link';
  onClick?: () => void;
  href?: string;
};

type Props = {
  title: string;
  buttons?: ButtonComponent[];
  children: React.ReactNode | React.ReactNode[];
};

class ButtonContainer extends Component<ButtonComponent> {}

export default class Modal extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  compileButtons() {
    const { buttons } = this.props;
    if (!buttons) return;
    return buttons.map((button, key) => {
      return (
        <button id={button.id} key={key} onClick={button.onClick}>
          {button.text}
        </button>
      );
    });
  }

  render() {
    const { title, children } = this.props;
    return (
      <div className="modalContainer">
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{title}</h4>
            </div>
            <div className="modal-body">{children}</div>
            <div className="modal-footer">{this.compileButtons()}</div>
          </div>
        </div>
      </div>
    );
  }
}
