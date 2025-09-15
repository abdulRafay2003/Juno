import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type UserState = {
  tokens: {};
  loading: boolean;
  userDetail: {};
  dropdownData: any;
  statusBadges: any;
  fcm: string;
  filterPayload: {
    isApplied: boolean;
    data: any;
  };
  agent: boolean;
};

const initialState: UserState = {
  tokens: {},
  loading: false,
  userDetail: {},
  dropdownData: null,
  statusBadges: null,
  fcm: 'fcmToken',
  filterPayload: {
    isApplied: false,
    data: {},
  },
  agent: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<any>) => {
      state.tokens = action.payload;
    },
    isAgent: (state, action: PayloadAction<boolean>) => {
      state.agent = action.payload;
    },
    setUserDetail: (state, action: PayloadAction<any>) => {
      state.userDetail = action.payload;
    },
    setDropDownData: (state, action: PayloadAction<any>) => {
      state.dropdownData = action.payload;
    },
    setStatusBadges: (state, action: PayloadAction<any>) => {
      state.statusBadges = action.payload;
    },
    setFcmToken: (state, action: PayloadAction<string>) => {
      state.fcm = action.payload;
    },
    setFilterPayload: (state, action: PayloadAction<any>) => {
      state.filterPayload = action.payload;
    },
  },
});

export const {
  setTokens,
  setUserDetail,
  setDropDownData,
  setStatusBadges,
  setFcmToken,
  setFilterPayload,
  isAgent,
} = userSlice.actions;

export default userSlice.reducer;
