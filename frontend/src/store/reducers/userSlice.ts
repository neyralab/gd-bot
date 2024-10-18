import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Me } from '../../effects/types/users';
import { Notification } from '../../effects/types/notifications';
import { getStorageNotificationsEffect } from '../../effects/storageEffects';

interface UserLinks {
  copy: string;
  send: string;
  label: string;
}

interface Notifications {
  all: Notification[];
  sender: {
    read: Notification[];
    unread: Notification[];
  };
  recipient: Notification[];
}

interface InitialState {
  data: Me | null;
  link: UserLinks;
  initData: string | null;
  notifications: Notifications | null;
}

const initialState: InitialState = {
  data: null,
  link: {
    copy: '',
    send: '',
    label: ''
  },
  initData: null,
  notifications: null
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<Me | null>) => {
      state.data = payload;
    },
    setInitData: (state, { payload }: PayloadAction<string | null>) => {
      state.initData = payload;
    },
    setLink: (state, { payload }: PayloadAction<UserLinks>) => {
      state.link = payload;
    },
    updatePoints: (state, { payload }: PayloadAction<number>) => {
      if (state?.data) {
        state.data.points += payload;
      }
    },
    decreaseUsedSpace: (state, { payload }: PayloadAction<number>) => {
      if (state?.data) {
        state.data.space_used -= payload;
      }
    },
    increaseUsedSpace: (state, { payload }: PayloadAction<number>) => {
      if (state?.data) {
        state.data.space_used += payload;
      }
    },
    setNotifications: (state, { payload }: PayloadAction<Notification[]>) => {
      const senderRead: Notification[] = [];
      const senderUnread: Notification[] = [];
      const recipient: Notification[] = [];

      payload.forEach((notification) => {
        if (
          notification.text.includes('accept') ||
          notification.text.includes('rejected')
        ) {
          if (notification.viewed) {
            senderRead.push(notification);
          } else {
            senderUnread.push(notification);
          }
        } else {
          recipient.push(notification);
        }
      });

      state.notifications = {
        all: payload,
        sender: {
          read: senderRead,
          unread: senderUnread
        },
        recipient: recipient
      };
    }
  }
});

export const getNotifications = createAsyncThunk(
  'user/getNotifications',
  async (_, { dispatch }) => {
    const res = await getStorageNotificationsEffect();
    if (res) {
      dispatch(setNotifications(res));
    }
  }
);

export const {
  setUser,
  setInitData,
  setLink,
  updatePoints,
  decreaseUsedSpace,
  increaseUsedSpace,
  setNotifications
} = userSlice.actions;
export default userSlice.reducer;
