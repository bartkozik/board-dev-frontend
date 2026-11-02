export type ToastType = 'success' | 'error' | 'warning';

export interface IToast {
  content: string;
  id: string;
  timeout?: number;
  type?: ToastType;
}

export type ToastMessages = Record<string, Record<string, string>>;
