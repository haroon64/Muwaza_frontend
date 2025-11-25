// simple singleton event emitter for notifications
type NotificationType = "success" | "error";

type NotifyPayload = {
  message: string;
  type?: NotificationType;
  duration?: number;
};

type Listener = (payload: NotifyPayload) => void;

class NotificationService {
  private listeners: Listener[] = [];

  notify(payload: NotifyPayload) {
    this.listeners.forEach((listener) => listener(payload));
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const notificationService = new NotificationService();
