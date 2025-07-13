import { createSlice } from '@reduxjs/toolkit';

export const notificationSlice = createSlice({

    name:"notifications",

    initialState:{
        notifications:[],
        unreadCount: 0,
    },

    reducers: {

/*
➡ Loads notifications from backend
Sets the full list (notifications)
Counts how many are unread and updates unreadCount
*/
   setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },


/*
➡ Adds a new real-time notification
Inserts it at the top of the list
Increases the unreadCount by 1
*/
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },

  
/*
➡ Marks all notifications as read
Updates every notification's isRead to true
Resets unreadCount to 0
*/
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
      state.unreadCount = 0;
    },

  },

});

export const {
  setNotifications,
  addNotification,
  markAllAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
