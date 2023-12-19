import { toast, ToastOptions } from "react-toastify";
import { useCallback } from "react";

export const useToast = () => {
  const showToast = useCallback(async (data: any, options?: ToastOptions) => {
    if (data.status === "error") {
      toast.error(data.message, options);
    } else {
      toast.success(data.message, options);
    }
  }, []);

  return { showToast };
};
