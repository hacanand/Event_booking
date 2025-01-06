import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  description: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const useToast = () => {
  const [toastState, setToastState] = useState<ToastProps | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error",
    description: string,
    duration?: number
  ) => {
    setToastState({ message, type, duration, description });
  };

  return { Toast, showToast };
};
