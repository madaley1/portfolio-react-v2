import React, { Component, createRef } from 'react';

import type { ButtonComponent } from '@/types/about/modalForm';

import styles from '@/Styles/sass/components/Modal.module.scss';

type Props = {
  id?: string;
  title: string;
  buttons?: ButtonComponent[];
  children: React.ReactNode | React.ReactNode[];
};

export function closeModal(
  e: React.MouseEvent<HTMLElement>,
  modalRef: React.RefObject<Modal | HTMLElement> | null
) {
  e.preventDefault();
  console.log(e, modalRef);
  if (!(e.target instanceof HTMLElement) || !modalRef) return;
  if (modalRef.current instanceof Modal) {
    if (!modalRef.current || !modalRef.current.modalRef.current) return;
    const { current } = modalRef.current.modalRef;
    if (!current) return;
    current.classList.remove(`${styles.open}`);
  } else if (modalRef.current instanceof HTMLElement) {
    if (!modalRef.current || !(modalRef.current instanceof HTMLElement)) return;
    const modal = modalRef.current.querySelector(`.${styles.open}`);
    if (!modal) return;
    modal.classList.remove(`${styles.open}`);
  }
}

export default class Modal extends Component<Props> {
  modalRef: React.RefObject<HTMLDivElement>;
  modalContainerRef: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.modalRef = createRef();
    this.modalContainerRef = createRef();
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
      <div
        className={styles.modalContainer}
        ref={this.modalContainerRef}
        onClick={(event) => {
          if (event.target !== this.modalContainerRef.current) return;
          closeModal(event, this.modalContainerRef);
        }}
      >
        <div className={styles.modal} id={id} ref={this.modalRef}>
          <div className={styles['modal-content']}>
            <div className={styles['modal-header']}>
              <h4>{title}</h4>
            </div>
            <div className={styles['modal-body']}>{children}</div>
            <div className={styles['modal-footer']}>
              {this.compileButtons()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
