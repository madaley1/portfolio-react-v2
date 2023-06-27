import React, { Component, createRef } from 'react';

export type ButtonComponent = {
  id: string;
  text: string;
  type: 'button' | 'link';
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
};

type Props = {
  id?: string;
  title: string;
  buttons?: ButtonComponent[];
  children: React.ReactNode | React.ReactNode[];
};

export function closeModal(e: React.MouseEvent<HTMLElement>) {
  e.preventDefault();
  if (!(e.target instanceof HTMLElement)) return;
  if (e.target.matches('.modal') || e.target.matches('.modal *')) return;
  document.querySelectorAll('.modal.open').forEach((modal) => {
    modal.classList.remove('open');
  });
}

export default class Modal extends Component<Props> {
  modalRef: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.modalRef = createRef();
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
    const { title, children, id } = this.props;
    return (
      <div className="modalContainer" onClick={closeModal}>
        <div className="modal" id={id} ref={this.modalRef}>
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
