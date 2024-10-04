export interface Notification {
  text: string;
  viewed: boolean;
  recipient: {
    id: number;
  };
  sender: {
    id: number;
    readed: boolean;
    unread: boolean;
  };
}
