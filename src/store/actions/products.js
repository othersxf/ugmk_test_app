import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseDate } from "@app/utils/_date";
import { cachedAxiosInstance } from "@app/utils/axios/_instances";
import { getProductsStatus } from "@app/store/selectors/products";
import { REQUEST_STATUS_LIST } from "@app/utils/axios/_request";

const fetchProducts = createAsyncThunk(
    'products/fetchList',
    async () => {
      const response = await cachedAxiosInstance.get('/api/products')
      return response.data.filter(item => item.date).map(item => {
        item.date = parseDate(item.date)
        if(item.date){
          item.date = item.date.getTime()
        }
        item.total = item.product1 + item.product2 + item.product3
        return item;
      }).sort(item => item.date)
    },
    {
      condition(arg, api) {
        return getProductsStatus(api.getState()) === REQUEST_STATUS_LIST.FAILED ||
            getProductsStatus(api.getState()) === REQUEST_STATUS_LIST.IDLE
      }
    }
)

export { fetchProducts }
