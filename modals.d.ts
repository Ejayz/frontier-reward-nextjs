declare module "modals" {
  type ToastOptions = {
    message: string;
    duration?: number;
  };

  type AlertOptions = {
    message: string;
    okTitle?: string;
    callback?: () => void;
  };

  type ConfirmOptions = {
    message: string;
    okTitle?: string;
    cancelTitle?: string;
    callback?: (val: string) => void;
  };

  type PromptOptions = {
    message: string;
    okTitle?: string;
    cancelTitle?: string;
    callback?: (result: string, data: string) => void;
  };

  type ModalAPI = {
    toast: (options: ToastOptions) => void;
    alert: (options: AlertOptions) => void;
    confirm: (options: ConfirmOptions) => void;
    prompt: (options: PromptOptions) => void;
  };

  const modal: ModalAPI;
  export default modal;
}
