import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice.js';
import donationsReducer from './donationSlice.js';
import notificationsReducer from './notificationSlice.js';

export const Store = configureStore({
    
  reducer: {
    donations: donationsReducer,
    auth: authReducer,
    notifications:notificationsReducer
  }

});