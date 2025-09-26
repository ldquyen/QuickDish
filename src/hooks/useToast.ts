import { addToast } from '@heroui/react';

export const useToast = () => {
  const showSuccess = (message: string) => {
    addToast({
      title: "Thành công",
      description: message,
      color: "success",
    });
  };

  const showError = (message: string) => {
    addToast({
      title: "Lỗi",
      description: message,
      color: "danger",
    });
  };

  const showWarning = (message: string) => {
    addToast({
      title: "Cảnh báo",
      description: message,
      color: "warning",
    });
  };

  const showInfo = (message: string) => {
    addToast({
      title: "Thông tin",
      description: message,
      color: "primary",
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
