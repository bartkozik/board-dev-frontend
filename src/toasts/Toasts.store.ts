import { makeAutoObservable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { RootStore } from '@/RootStore';
import { toastMessages } from './toastMessages';
import { IToast, ToastMessages, ToastType } from './types';

class ToastsStore {
  rootStore: RootStore;

  toasts: IToast[] = [];
  toastMessages: ToastMessages = toastMessages;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  addToast = (content: string, type: ToastType = 'error', timeout?: number): void => {
    this.toasts = [...this.toasts, { id: uuidv4(), content, type, timeout }];
  };

  removeToast = (id: string): void => {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  };
}

export default ToastsStore;
