import { createSlice } from '@reduxjs/toolkit';

const donationSlice = createSlice({
  name: 'donations',
  initialState: {
    list: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {

    setDonations: (state, action) => {
      state.list = action.payload;
    },

    addDonation: (state, action) => {
      state.list.unshift(action.payload);
    },

    updateDonation: (state, action) => {
      const index = state.list.findIndex(d => d._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    deleteStaleDonationsByIds: (state, action) => {
    const idsToRemove = action.payload;
    state.list = state.list.filter(donation => !idsToRemove.includes(donation._id));
  }

  }
});

export const {
  setDonations,
  addDonation,
  updateDonation,
  setLoading,
  setError,
  deleteStaleDonationsByIds
} = donationSlice.actions;

export default donationSlice.reducer;


