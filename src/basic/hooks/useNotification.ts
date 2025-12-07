import { useState, useCallback } from "react";
import { Notification } from "../../../types";

/**
 * 알림 메시지를 관리하는 커스텀 훅
 * @param duration 알림이 표시되는 시간 (ms)
 * @returns 알림 목록과 알림 추가 함수
 */
export const useNotification = (duration: number = 3000) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: "error" | "success" | "warning" = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    },
    [duration]
  );

  return {
    notifications,
    setNotifications,
    addNotification,
  };
};
