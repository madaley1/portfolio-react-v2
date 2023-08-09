import React from 'react';

import type { FormikProps } from 'formik';

import Modal from '@/Components/Modal';

// new interfaces
export interface AddModalFormProps {
  loggedIn: boolean;
}

export interface EditModalFormProps {
  index: number;
  textObject: Record<string, any>;
  loggedIn: boolean;
}

export interface ModalFormState {
  modalRef: React.RefObject<Modal> | null;
  formRef: React.RefObject<FormikProps<any>> | null;
}

// new Types
export type addModalFormProps = {
  loggedIn: boolean;
};

export type editModalFormProps = {
  index: number;
  textObject: Record<string, any>;
  loggedIn: boolean;
};

export type ButtonComponent = {
  id: string;
  text: string;
  type: 'button' | 'link';
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
};
