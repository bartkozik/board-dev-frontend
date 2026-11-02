import { SUPPORT_EMAIL } from './constants';

export const supportInfo: Record<string, SupportInfoType> = {
  CONTACT: {
    text: 'Having difficulty logging in?',
    link: `mailto:${SUPPORT_EMAIL}`,
    buttonText: 'Contact us',
  },
  SIGN_UP: {
    text: "Need to create an account?",
    link: '/signup',
    buttonText: 'Sign up',
  },
  SIGN_IN: {
    text: 'Already have an account?',
    link: '/login',
    buttonText: 'Sign in',
  },
  TRAINING_MATERIALS_REQUEST: {
    text: 'To access training materials',
    link: `mailto:${SUPPORT_EMAIL}`,
    buttonText: 'contact us.',
  },
};

export interface SupportInfoType {
  text: string;
  link: string;
  buttonText: string;
}
