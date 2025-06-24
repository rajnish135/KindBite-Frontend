import { configureStore } from '@reduxjs/toolkit';
import authReducer from './AuthSlice';
import donationsReducer from './donationSlice';


export const Store = configureStore({
    
  reducer: {
    donations: donationsReducer,
    auth: authReducer
  }

});