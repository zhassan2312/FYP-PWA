// Toast utilities for robot service
// This file provides toast functionality that can be used from non-React contexts

let toastFunction: ((message: string, options?: any) => void) | null = null;

export const setToastFunction = (fn: (message: string, options?: any) => void) => {
  toastFunction = fn;
};

export const showToast = {
  success: (message: string, options?: { description?: string }) => {
    if (toastFunction) {
      toastFunction(message, { ...options, type: 'success' });
    }
  },
  error: (message: string, options?: { description?: string }) => {
    if (toastFunction) {
      toastFunction(message, { ...options, type: 'error' });
    }
  },
  info: (message: string, options?: { description?: string }) => {
    if (toastFunction) {
      toastFunction(message, { ...options, type: 'info' });
    }
  },
  warning: (message: string, options?: { description?: string }) => {
    if (toastFunction) {
      toastFunction(message, { ...options, type: 'warning' });
    }
  }
};
