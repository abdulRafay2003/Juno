import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  authorized: false,
  authPayload: {},
  userEmail: '',
  categoryType: '',
  keychainAccess: false,
  faceIdCredentials: {},
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSucces: (state, action: PayloadAction<boolean>) => {
      state.authorized = action.payload;
    },
    setAuthPayload: (state, action: PayloadAction<any>) => {
      state.authPayload = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<any>) => {
      state.userEmail = action.payload;
    },
    setCategoryType: (state, action: PayloadAction<any>) => {
      state.categoryType = action.payload;
    },
    setKeychainAcces: (state, action: PayloadAction<any>) => {
      state.keychainAccess = action.payload;
    },
    setFaceIdCredentials: (state, action: PayloadAction<any>) => {
      state.faceIdCredentials = action.payload;
    },
  },
});
export const {
  loginSucces,
  setAuthPayload,
  setUserEmail,
  setCategoryType,
  setKeychainAcces,
  setFaceIdCredentials,
} = authSlice.actions;

export default authSlice.reducer;
