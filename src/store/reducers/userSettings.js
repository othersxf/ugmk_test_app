import { createSlice } from "@reduxjs/toolkit";
export const FILTER_PRODUCT_TYPE = {
  ALL: 'ALL'
}

const initialState = {
  filter: FILTER_PRODUCT_TYPE.ALL
}

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    setFilter(state, action){
      state.filter = action.payload
    }
  },
})

export const { setFilter } = userSettingsSlice.actions
export default userSettingsSlice.reducer
