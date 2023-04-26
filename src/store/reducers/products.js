import { createSlice } from "@reduxjs/toolkit";
import { REQUEST_STATUS_LIST } from "@app/utils/axios/_request";
import { fetchProducts } from "@app/store/actions/products";

const initialState = {
  list: [],
  status: REQUEST_STATUS_LIST.IDLE
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
  },
  extraReducers: builder => {

    builder.addCase(fetchProducts.pending, (state, action) => {
      state.status = REQUEST_STATUS_LIST.PENDING
    })

    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.error = action.payload;
      state.status = REQUEST_STATUS_LIST.FAILED
    })

    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.list = action.payload;
      state.status = REQUEST_STATUS_LIST.SUCCESS
    })
  }
})

export default productSlice.reducer
