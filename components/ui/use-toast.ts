import { useState, useCallback } from "react";

interface ToastOptions {
  message: string;
  type: "success" | "error";
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = useCallback((options: ToastOptions) => {
    setToast(options);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
};
